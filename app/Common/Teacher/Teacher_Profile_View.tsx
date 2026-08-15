import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { API_BASE_URL } from "~/utils/apiClient";

export type PaperType = {
  _id?: string;

  desc?: string;
  description?: string;

  link?: string;
  url?: string;

  title?: string;
  name?: string;
};

export type TeacherDataType = {
  _id?: string;

  firstName?: string;
  lastName?: string;
  namePrefix?: string;

  roles?: any;

  contactInfo?: {
    email?: string;
    phone?: string;
  };

  phoneNumber?: string;

  highestDegree?: string;

  expertFields?: string;

  photoId?: string;
  photo?: string;

  departmentId?: any;
  department?: any;

  papers?: PaperType[];
};

type Teacher_Profile_ViewProps = {
  teachers: TeacherDataType[];
};

const Teacher_Profile_View: React.FC<
  Teacher_Profile_ViewProps
> = ({ teachers }) => {

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

    if (typeof roles === "string") {
      return roles;
    }

    // ARRAY

    if (Array.isArray(roles)) {

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
  // DEPARTMENT NAME
  // ======================================================

  const getDepartmentName = (
    department: any,
    departmentId: any
  ): string => {

    if (
      typeof department === "string"
    ) {
      return department;
    }

    if (department?.name) {
      return department.name;
    }

    if (
      typeof departmentId === "string"
    ) {
      return departmentId;
    }

    if (departmentId?.name) {
      return departmentId.name;
    }

    return "";
  };

  // ======================================================
  // PAPER DESCRIPTION
  // ======================================================

  const getPaperDescription = (
    paper: PaperType
  ): string => {

    return (
      paper.desc ||
      paper.description ||
      paper.title ||
      paper.name ||
      "Research Publication"
    );
  };

  // ======================================================
  // PAPER LINK
  // ======================================================

  const getPaperLink = (
    paper: PaperType
  ): string => {

    return (
      paper.link ||
      paper.url ||
      ""
    );
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div
      className="
        max-w-6xl
        mx-auto
        space-y-6
        bg-gray-50
        rounded-2xl
        shadow-sm
        border
        border-gray-200
        p-6
      "
    >

      {teachers.map(
        (teacher, index) => {

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

          const position =
            getRolesText(
              teacher.roles
            );

          // =================================================
          // HOD
          // =================================================

          const roleLower =
            position.toLowerCase();

          const isHOD =
            roleLower.includes("hod") ||
            roleLower.includes("head");

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
          // DEPARTMENT
          // =================================================

          const department =
            getDepartmentName(
              teacher.department,
              teacher.departmentId
            );

          // =================================================
          // PHOTO
          // =================================================

          const photoSrc =
            teacher.photoId
              ? `${API_BASE_URL}/uploads/faculty/${teacher.photoId}`
              : teacher.photo ||
                "";

          // =================================================
          // PAPERS
          // =================================================

          const papers =
            Array.isArray(
              teacher.papers
            )
              ? teacher.papers
              : [];

          return (
            <div
              key={
                teacher._id ||
                index
              }
              className="space-y-6"
            >

              {/* =========================================
                  HEADER
              ========================================== */}

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
                    text-center
                    uppercase
                    tracking-wider
                    text-gray-900
                  "
                >
                  Faculty Profile
                </h2>

              </div>

              {/* =========================================
                  PROFILE SECTION
              ========================================== */}

              <div
                className="
                  flex
                  flex-col
                  lg:flex-row
                  gap-6
                "
              >

                {/* =======================================
                    PROFILE CARD
                ======================================== */}

                <div
                  className="
                    relative
                    flex
                    flex-col
                    items-center
                    bg-white
                    rounded-2xl
                    border
                    border-gray-200
                    shadow-sm
                    p-6
                    w-full
                    lg:w-1/3
                  "
                >

                  {/* HOD */}

                  {isHOD && (
                    <div
                      className="
                        absolute
                        top-0
                        right-0
                        bg-rose-700
                        text-white
                        text-xs
                        font-bold
                        px-4
                        py-1.5
                        rounded-bl-xl
                      "
                    >
                      HOD
                    </div>
                  )}

                  {/* PHOTO */}

                  {photoSrc ? (

                    <img
                      src={photoSrc}
                      alt={fullName}
                      className="
                        w-44
                        h-52
                        object-cover
                        rounded-xl
                        border
                        border-gray-200
                        shadow-sm
                        bg-gray-100
                      "
                      onError={(
                        e
                      ) => {

                        e.currentTarget.style.display =
                          "none";

                        const parent =
                          e.currentTarget
                            .parentElement;

                        if (
                          parent &&
                          !parent.querySelector(
                            ".profile-placeholder"
                          )
                        ) {

                          const placeholder =
                            document.createElement(
                              "div"
                            );

                          placeholder.className =
                            "profile-placeholder w-44 h-52 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center";

                          placeholder.innerHTML =
                            `
                              <svg
                                class="w-16 h-16 text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zM9 12a4 4 0 018 0H9z"
                                  clip-rule="evenodd"
                                />
                              </svg>
                            `;

                          parent.appendChild(
                            placeholder
                          );
                        }
                      }}
                    />

                  ) : (

                    <div
                      className="
                        w-44
                        h-52
                        rounded-xl
                        bg-gray-100
                        border
                        border-gray-200
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <FaUserCircle
                        className="
                          w-20
                          h-20
                          text-gray-300
                        "
                      />
                    </div>

                  )}

                  {/* NAME */}

                  <h3
                    className="
                      text-xl
                      font-bold
                      mt-4
                      text-center
                      text-gray-900
                    "
                  >
                    {fullName}
                  </h3>

                  {/* POSITION */}

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-cyan-800
                      text-center
                      uppercase
                      tracking-wide
                      mt-1
                    "
                  >
                    {position ||
                      "Faculty Member"}
                  </p>

                </div>

                {/* =======================================
                    INFORMATION
                ======================================== */}

                <div
                  className="
                    bg-white
                    rounded-2xl
                    border
                    border-gray-200
                    shadow-sm
                    p-6
                    w-full
                    lg:w-2/3
                  "
                >

                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-5
                      text-sm
                    "
                  >

                    {/* EMAIL */}

                    <div>

                      <p
                        className="
                          font-semibold
                          text-gray-500
                          text-xs
                          uppercase
                        "
                      >
                        Email
                      </p>

                      <p
                        className="
                          font-medium
                          text-gray-900
                          break-all
                        "
                      >
                        {email ||
                          "N/A"}
                      </p>

                    </div>

                    {/* PHONE */}

                    <div>

                      <p
                        className="
                          font-semibold
                          text-gray-500
                          text-xs
                          uppercase
                        "
                      >
                        Phone
                      </p>

                      <p
                        className="
                          font-medium
                          text-gray-900
                        "
                      >
                        {phone ||
                          "N/A"}
                      </p>

                    </div>

                    {/* QUALIFICATION */}

                    <div>

                      <p
                        className="
                          font-semibold
                          text-gray-500
                          text-xs
                          uppercase
                        "
                      >
                        Qualification
                      </p>

                      <p
                        className="
                          font-medium
                          text-gray-900
                        "
                      >
                        {teacher.highestDegree ||
                          "N/A"}
                      </p>

                    </div>

                    {/* DEPARTMENT */}

                    <div>

                      <p
                        className="
                          font-semibold
                          text-gray-500
                          text-xs
                          uppercase
                        "
                      >
                        Department
                      </p>

                      <p
                        className="
                          font-medium
                          text-gray-900
                        "
                      >
                        {department ||
                          "N/A"}
                      </p>

                    </div>

                    {/* POSITION */}

                    <div>

                      <p
                        className="
                          font-semibold
                          text-gray-500
                          text-xs
                          uppercase
                        "
                      >
                        Position
                      </p>

                      <p
                        className="
                          font-medium
                          text-gray-900
                        "
                      >
                        {position ||
                          "N/A"}
                      </p>

                    </div>

                    {/* EXPERTISE */}

                    <div
                      className="
                        sm:col-span-2
                      "
                    >

                      <p
                        className="
                          font-semibold
                          text-gray-500
                          text-xs
                          uppercase
                        "
                      >
                        Speciality / Expertise
                      </p>

                      <p
                        className="
                          font-medium
                          text-gray-900
                          leading-relaxed
                        "
                      >
                        {teacher.expertFields ||
                          "N/A"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

              {/* =========================================
                  PUBLICATIONS
              ========================================== */}

              <div
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-gray-200
                  shadow-sm
                  p-6
                "
              >

                {/* HEADER */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-gray-200
                    pb-3
                    mb-4
                  "
                >

                  <h3
                    className="
                      text-lg
                      font-bold
                      text-gray-900
                    "
                  >
                    Publications & Research Papers
                  </h3>

                  {papers.length > 0 && (
                    <span
                      className="
                        text-xs
                        font-bold
                        text-gray-500
                        bg-gray-100
                        px-3
                        py-1
                        rounded-full
                      "
                    >
                      {papers.length}{" "}
                      {papers.length === 1
                        ? "Paper"
                        : "Papers"}
                    </span>
                  )}

                </div>

                {/* PAPERS */}

                {papers.length > 0 ? (

                  <div
                    className="
                      space-y-3
                      max-h-80
                      overflow-y-auto
                      pr-2
                    "
                  >

                    {papers.map(
                      (
                        paper,
                        paperIndex
                      ) => {

                        const paperDescription =
                          getPaperDescription(
                            paper
                          );

                        const paperLink =
                          getPaperLink(
                            paper
                          );

                        return (
                          <div
                            key={
                              paper._id ||
                              paperIndex
                            }
                            className="
                              border
                              border-gray-200
                              p-4
                              rounded-xl
                              bg-gray-50
                              hover:bg-gray-100
                              transition-colors
                            "
                          >

                            <div
                              className="
                                flex
                                items-start
                                gap-3
                              "
                            >

                              {/* NUMBER */}

                              <span
                                className="
                                  flex-shrink-0
                                  w-7
                                  h-7
                                  rounded-full
                                  bg-cyan-100
                                  text-cyan-800
                                  text-xs
                                  font-bold
                                  flex
                                  items-center
                                  justify-center
                                "
                              >
                                {paperIndex + 1}
                              </span>

                              {/* DESCRIPTION */}

                              <p
                                className="
                                  font-semibold
                                  text-gray-900
                                  text-sm
                                  leading-relaxed
                                "
                              >
                                {
                                  paperDescription
                                }
                              </p>

                            </div>

                            {/* LINK */}

                            {paperLink &&
                              paperLink !== "#" && (
                                <a
                                  href={
                                    paperLink
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) =>
                                    e.stopPropagation()
                                  }
                                  className="
                                    ml-10
                                    mt-2
                                    text-cyan-700
                                    hover:text-cyan-900
                                    hover:underline
                                    text-xs
                                    font-bold
                                    inline-block
                                  "
                                >
                                  View Publication
                                  Link →
                                </a>
                              )}

                          </div>
                        );
                      }
                    )}

                  </div>

                ) : (

                  <p
                    className="
                      text-gray-500
                      text-sm
                      italic
                    "
                  >
                    No publications currently
                    uploaded.
                  </p>

                )}

              </div>

            </div>
          );
        }
      )}

    </div>
  );
};

export default Teacher_Profile_View;