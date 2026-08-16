import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";

type DepartmentDataProps = {
  name: string;
};

type Paper = {
  _id?: string;
  desc?: string;
  link?: string;
  title?: string;
  name?: string;
  description?: string;
  url?: string;
  paperUrl?: string;
};

type FacultyMember = {
  _id: string;

  firstName?: string;
  lastName?: string;
  namePrefix?: string;

  roles?: any;
  hod?: boolean;
  departmentId?: any;
  department?: any;

  contactInfo?: {
    email?: string;
    phone?: string;
  };

  phoneNumber?: string;

  highestDegree?: string;

  // DB format:
  // ['["AI, Machine Learning"]']
  expertFields?: string[];

  photoId?: string;
  photo?: string;

  papers?: Paper[];
};

export default function DepartmentData({
  name,
}: DepartmentDataProps) {
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState<
    FacultyMember[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  // ======================================================
  // FACULTY URL SLUG
  // ======================================================

  const getFacultySlug = (
    teacher: FacultyMember
  ): string => {
    return `${teacher.firstName || ""}_${teacher.lastName || ""}`
      .trim()
      .replace(/\s+/g, "_")
      .replace(/_+/g, "_")
      .toLowerCase();
  };

  // ======================================================
  // FETCH DEPARTMENT FACULTY
  // ======================================================

  useEffect(() => {

    let mounted = true;

    const fetchDepartmentFaculty =
      async () => {

        if (!name?.trim()) {

          if (mounted) {
            setFaculty([]);
            setLoading(false);
          }

          return;
        }

        try {

          setLoading(true);

          const response =
            await apiClient.get(
              `/faculty/department/${encodeURIComponent(
                name.trim()
              )}`
            );

          const facultyData =
            response.data?.data?.faculty ||
            [];

          if (mounted) {

            setFaculty(
              Array.isArray(
                facultyData
              )
                ? facultyData
                : []
            );

          }

        } catch (error: any) {

          if (mounted) {
            setFaculty([]);
          }

        } finally {

          if (mounted) {
            setLoading(false);
          }

        }
      };

    fetchDepartmentFaculty();

    return () => {
      mounted = false;
    };
  }, [name]);

  // ======================================================
  // SAFE ROLE CONVERTER
  // ======================================================

  const getRolesText = (
    roles: any
  ): string => {

    if (!roles) {
      return "";
    }

    // STRING

    if (
      typeof roles === "string"
    ) {
      return roles;
    }

    // ARRAY

    if (
      Array.isArray(roles)
    ) {

      return roles
        .map((role) => {

          if (
            typeof role === "string"
          ) {
            return role;
          }

          if (
            role &&
            typeof role === "object"
          ) {
            return (
              role.name ||
              role.title ||
              role.role ||
              ""
            );
          }

          return "";
        })
        .filter(Boolean)
        .join(", ");
    }

    // OBJECT

    if (
      typeof roles === "object"
    ) {
      return (
        roles.name ||
        roles.title ||
        roles.role ||
        ""
      );
    }

    return String(roles);
  };

  // ======================================================
  // EXPERTISE CONVERTER
  // ======================================================
  //
  // DB:
  //
  // ['["AI, Machine Learning"]']
  //
  // FRONTEND:
  //
  // AI, Machine Learning
  //
  // ======================================================

  const getExpertFieldsText = (
    expertFields:
      | string[]
      | undefined
  ): string => {

    if (
      !expertFields ||
      expertFields.length === 0
    ) {
      return "";
    }

    try {

      // Get first value
      //
      // '["AI, Machine Learning"]'

      const firstValue =
        expertFields[0];

      if (!firstValue) {
        return "";
      }

      // Parse JSON
      //
      // ["AI, Machine Learning"]

      const parsed =
        JSON.parse(firstValue);

      // If JSON is an array

      if (
        Array.isArray(parsed)
      ) {

        return parsed.join(", ");

      }

      return String(parsed);

    } catch (error) {

      console.error(
        "Error parsing expertFields:",
        error
      );

      return "";

    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        className="
          p-6
          max-w-6xl
          mx-auto
        "
      >

        <div
          className="
            text-center
            py-12
            text-gray-500
            font-semibold
          "
        >
          Loading faculty list...
        </div>
      </div>
    );
  }

  // ======================================================
  // EMPTY
  // ======================================================

  if (
    faculty.length === 0
  ) {

    return (
      <div
        className="
          p-6
          max-w-6xl
          mx-auto
        "
      >

        <div
          className="
            text-center
            py-12
            text-gray-500
            font-medium
            bg-white
            rounded-2xl
            border
            border-gray-200
          "
        >
          No faculty members listed under{" "}

          <span
            className="font-bold"
          >
            {name}
          </span>

          .
        </div>
      </div>
    );
  }

  // ======================================================
  // FACULTY LIST
  // ======================================================

  return (
    <div
      className="
        p-6
        max-w-6xl
        mx-auto
        space-y-6
      "
    >

      {/* ==================================================
          HEADER
      ================================================== */}

      <div
        className="
          border-b
          border-gray-200
          pb-3
        "
      >

        <h2
          className="
            text-2xl
            font-bold
            text-gray-900
          "
        >
          Faculty Members (
          {name.toUpperCase()}
          )
        </h2>

        <p
          className="
            text-sm
            text-gray-500
            mt-1
          "
        >
          {faculty.length} faculty member
          {faculty.length !== 1
            ? "s"
            : ""}
        </p>

      </div>

      {/* ==================================================
          FACULTY GRID
      ================================================== */}

      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-6
        "
      >

        {faculty.map(
          (teacher) => {

            // =============================================
            // NAME
            // =============================================

            const fullName =
              `${teacher.namePrefix || ""} ${
                teacher.firstName || ""
              } ${
                teacher.lastName || ""
              }`
                .replace(/\s+/g, " ")
                .trim() ||
              "Faculty Member";

            // =============================================
            // ROLE
            // =============================================

            const rolesText =
              getRolesText(
                teacher.roles
              );

            // =============================================
            // PHOTO
            // =============================================

            const photoSrc =
              teacher.photoId
                ? `${API_BASE_URL}/uploads/faculty/${teacher.photoId}`
                : teacher.photo 

            // =============================================
            // EMAIL
            // =============================================

            const email =
              teacher.contactInfo?.email ||
              "";

            // =============================================
            // PHONE
            // =============================================

            const phone =
              teacher.contactInfo?.phone ||
              teacher.phoneNumber ||
              "";

            // =============================================
            // PAPERS
            // =============================================

            const paperCount =
              Array.isArray(
                teacher.papers
              )
                ? teacher.papers.length
                : 0;

            // =============================================
            // FACULTY URL
            // =============================================

            const facultySlug =
              getFacultySlug(
                teacher
              );

            // =============================================
            // EXPERTISE
            // =============================================

            const expertFields =
              getExpertFieldsText(
                teacher.expertFields
              );

            return (

              <button
                type="button"
                key={teacher._id}
                onClick={() =>
                  navigate(
                    `/faculty/${facultySlug}`,
                    {
                      state: {
                        teacher,
                      },
                    }
                  )
                }
                className="
                  relative
                  flex
                  w-full
                  text-left
                  bg-white
                  rounded-2xl
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-200
                  p-5
                  items-start
                  gap-4
                  border
                  border-gray-200
                  hover:border-rose-200
                  cursor-pointer
                  overflow-hidden
                "
              >

                {/* ======================================
                    HOD BADGE
                ======================================= */}

                {teacher.hod === true && (

                  <div
                    className="
                      absolute
                      top-5
                      right-[-34px]
                      z-20
                      w-32
                      py-1.5
                      bg-rose-700
                      text-white
                      text-xs
                      font-extrabold
                      text-center
                      tracking-widest
                      shadow-md
                      rotate-45
                      pointer-events-none
                    "
                  >
                    HOD
                  </div>

                )}

                {/* ======================================
                    PHOTO
                ======================================= */}

                <img
                  src={photoSrc}
                  alt={fullName}
                  className="
                    w-24
                    h-28
                    object-cover
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-100
                    flex-shrink-0
                  "
                  onError={(e) => {                     
                  }}
                />

                {/* ======================================
                    INFORMATION
                ======================================= */}

                <div
                  className="
                    flex-1
                    min-w-0
                    text-sm
                    space-y-1.5
                  "
                >

                  {/* NAME */}

                  <h3
                    className="
                      font-bold
                      text-base
                      text-gray-900
                      pr-10
                    "
                  >
                    {fullName}
                  </h3>

                  {/* ROLE */}

                  {rolesText && (

                    <p
                      className="
                        text-cyan-800
                        font-medium
                        text-xs
                      "
                    >
                      {rolesText}
                    </p>

                  )}

                  {/* EMAIL */}

                  {email && (

                    <p
                      className="
                        text-gray-500
                        text-xs
                        font-mono
                        break-all
                      "
                    >
                      {email}
                    </p>

                  )}

                  {/* PHONE */}

                  {phone && (

                    <p
                      className="
                        text-gray-500
                        text-xs
                      "
                    >
                      {phone}
                    </p>

                  )}

                  {/* DEGREE */}

                  {teacher.highestDegree && (

                    <p
                      className="
                        text-gray-700
                        text-xs
                        font-medium
                      "
                    >
                      Degree:{" "}
                      {teacher.highestDegree}
                    </p>

                  )}

                  {/* EXPERTISE */}

                  {expertFields && (

                    <p
                      className="
                        text-gray-600
                        text-xs
                        line-clamp-2
                      "
                    >
                      Expertise:{" "}
                      {expertFields}
                    </p>

                  )}

                  {/* PAPER COUNT */}

                  {paperCount > 0 && (

                    <p
                      className="
                        text-xs
                        text-rose-700
                        font-semibold
                        pt-1
                      "
                    >
                      {paperCount} research paper
                      {paperCount !== 1
                        ? "s"
                        : ""}
                    </p>

                  )}

                  {/* VIEW PROFILE */}

                  <p
                    className="
                      text-xs
                      text-cyan-700
                      font-semibold
                      pt-2
                    "
                  >
                    Click to view full profile →
                  </p>

                </div>

              </button>
            );
          }
        )}

      </div>
    </div>
  );
}