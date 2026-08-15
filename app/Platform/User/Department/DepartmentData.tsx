import { useEffect, useState } from "react";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";
import Teacher_Profile_View from "../../../Common/Teacher/Teacher_Profile_View";

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
};

type FacultyMember = {
  _id: string;

  firstName?: string;
  lastName?: string;
  namePrefix?: string;

  roles?: any;

  departmentId?: any;
  department?: any;

  contactInfo?: {
    email?: string;
    phone?: string;
  };

  phoneNumber?: string;

  highestDegree?: string;

  expertFields?: string;

  photoId?: string;
  photo?: string;

  papers?: Paper[];
};

export default function DepartmentData({
  name,
}: DepartmentDataProps) {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);

  const [selectedTeacher, setSelectedTeacher] =
    useState<FacultyMember | null>(null);

  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH DEPARTMENT FACULTY
  // ======================================================

  useEffect(() => {
    let mounted = true;

    const fetchDepartmentFaculty = async () => {
      if (!name?.trim()) {
        if (mounted) {
          setFaculty([]);
          setLoading(false);
        }

        return;
      }

      try {
        setLoading(true);

        console.log(
          "Fetching department faculty:",
          name
        );

        const response = await apiClient.get(
          `/faculty/department/${encodeURIComponent(
            name.trim()
          )}`
        );

        console.log(
          "Faculty API response:",
          response.data
        );

        const facultyData =
          response.data?.data?.faculty || [];

        if (mounted) {
          setFaculty(
            Array.isArray(facultyData)
              ? facultyData
              : []
          );
        }
      } catch (error: any) {
        console.error(
          "Failed to fetch department faculty:",
          error
        );

        console.error(
          "API error response:",
          error?.response?.data
        );

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

  const getRolesText = (roles: any): string => {
    if (!roles) {
      return "";
    }

    // String
    if (typeof roles === "string") {
      return roles;
    }

    // Array
    if (Array.isArray(roles)) {
      return roles
        .map((role) => {
          if (typeof role === "string") {
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

    // Object
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
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12 text-gray-500 font-semibold">
          Loading faculty list...
        </div>
      </div>
    );
  }

  // ======================================================
  // SELECTED TEACHER
  // ======================================================

  if (selectedTeacher) {
    return (
      <div className="p-6 max-w-6xl mx-auto">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => setSelectedTeacher(null)}
          className="
            mb-5
            inline-flex
            items-center
            gap-2
            px-4
            py-2
            rounded-lg
            bg-gray-100
            hover:bg-gray-200
            text-gray-700
            font-semibold
            text-sm
            transition
          "
        >
          ← Back to Faculty List
        </button>

        {/* TEACHER PROFILE */}

        <Teacher_Profile_View
          teachers={[selectedTeacher]}
        />

      </div>
    );
  }

  // ======================================================
  // EMPTY
  // ======================================================

  if (faculty.length === 0) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
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

          <span className="font-bold">
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
    <div className="p-6 max-w-6xl mx-auto space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="border-b border-gray-200 pb-3">

        <h2 className="text-2xl font-bold text-gray-900">
          Faculty Members ({name.toUpperCase()})
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {faculty.length} faculty member
          {faculty.length !== 1
            ? "s"
            : ""}
        </p>

      </div>

      {/* ==================================================
          FACULTY GRID
      ================================================== */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        gap-6
      ">

        {faculty.map((teacher) => {

          // =================================================
          // NAME
          // =================================================

          const fullName =
            `${teacher.namePrefix || ""} ${
              teacher.firstName || ""
            } ${
              teacher.lastName || ""
            }`
              .replace(/\s+/g, " ")
              .trim() ||
            "Faculty Member";

          // =================================================
          // ROLE
          // =================================================

          const rolesText =
            getRolesText(
              teacher.roles
            );

          // =================================================
          // HOD
          // =================================================

          const rolesLower =
            rolesText.toLowerCase();

          const isHOD =
            rolesLower.includes("head") ||
            rolesLower.includes("hod");

          // =================================================
          // PHOTO
          // =================================================

          const photoSrc =
            teacher.photoId
              ? `${API_BASE_URL}/uploads/faculty/${teacher.photoId}`
              : teacher.photo ||
                "/Images/Faculty/placeholder.jpg";

          // =================================================
          // EMAIL
          // =================================================

          const email =
            teacher.contactInfo?.email ||
            "";

          // =================================================
          // PHONE
          // =================================================

          const phone =
            teacher.contactInfo?.phone ||
            teacher.phoneNumber ||
            "";

          // =================================================
          // PAPERS
          // =================================================

          const paperCount =
            Array.isArray(
              teacher.papers
            )
              ? teacher.papers.length
              : 0;

          return (
            <button
              type="button"
              key={teacher._id}
              onClick={() =>
                setSelectedTeacher(
                  teacher
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
              "
            >

              {/* =========================================
                  HOD BADGE
              ========================================== */}

              {isHOD && (
                <div
                  className="
                    absolute
                    top-0
                    right-0
                    bg-rose-700
                    text-white
                    text-xs
                    px-3
                    py-1
                    rounded-bl-xl
                    font-bold
                  "
                >
                  HOD
                </div>
              )}

              {/* =========================================
                  PHOTO
              ========================================== */}

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
                  if (
                    e.currentTarget.src.includes(
                      "placeholder.jpg"
                    )
                  ) {
                    return;
                  }

                  e.currentTarget.src =
                    "/Images/Faculty/placeholder.jpg";
                }}
              />

              {/* =========================================
                  INFORMATION
              ========================================== */}

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

                {teacher.expertFields && (
                  <p
                    className="
                      text-gray-600
                      text-xs
                      line-clamp-2
                    "
                  >
                    Expertise:{" "}
                    {teacher.expertFields}
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
        })}

      </div>
    </div>
  );
}