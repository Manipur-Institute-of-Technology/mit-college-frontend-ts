import * as React from "react";
import { useEffect, useState } from "react";
import { confirmExternalLink, showAlert } from "~/utils/alert_utils";

import {
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaEdit,
  FaSave,
  FaTrash,
  FaPlus,
  FaExternalLinkAlt,
  FaTimesCircle,
  FaBookOpen,
} from "react-icons/fa";

import { useAuth } from "~/context/AuthContext";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";

import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";

// =========================================================
// TYPES
// =========================================================

type Department = {
  _id: string;
  name: string;
};

type Faculty = {
  _id?: string;
  accountId?: string;

  email?: string;
  username?: string;

  photoId?: string;

  namePrefix?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;

  phoneNumber?: string;

  sex?:
    | "male"
    | "female"
    | "other"
    | "prefer not to say";

  dob?: string;

  department?: Department;
  departmentId?: string | Department;

  hod?: boolean;

  highestDegree?: string;

  expertFields?: string[];

  roles?: string | string[];

  bios?: string;

  securityCode?: string;
};

type FacultyResponse = {
  data?: {
    faculty?: Faculty;
  };

  faculty?: Faculty;
};

type Paper = {
  _id: string;
  facultyId: string;
  title: string;
  paperUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

// =========================================================
// API ERROR
// =========================================================

const getApiErrorMessage = (
  error: any,
  fallback: string
): string => {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  if (
    data.message &&
    typeof data.message.message === "string"
  ) {
    return data.message.message;
  }

  if (typeof data.error === "string") {
    return data.error;
  }

  if (
    data.error &&
    typeof data.error.message === "string"
  ) {
    return data.error.message;
  }

  return fallback;
};

// =========================================================
// FORMAT ROLE
// =========================================================

const formatRole = (
  role?: string | string[]
) => {
  if (!role) {
    return "Faculty";
  }

  const value = Array.isArray(role)
    ? role[0]
    : role;

  return value
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
};

// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (
  date?: string
) => {
  if (!date) {
    return "Not available";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
};

// =========================================================
// DATE FOR INPUT
// =========================================================

const formatDateForInput = (
  date?: string
) => {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const year =
    parsed.getFullYear();

  const month =
    String(
      parsed.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      parsed.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

// =========================================================
// DEPARTMENT NAME
// =========================================================

const getDepartmentName = (
  department?: string | Department
) => {
  if (!department) {
    return "Department not assigned";
  }

  if (typeof department === "string") {
    return department;
  }

  return department.name;
};

// =========================================================
// GET DEPARTMENT ID
// =========================================================

const getDepartmentId = (
  faculty?: Faculty
): string => {
  if (!faculty) {
    return "";
  }

  if (
    typeof faculty.departmentId ===
    "string"
  ) {
    return faculty.departmentId;
  }

  if (
    faculty.departmentId &&
    typeof faculty.departmentId ===
      "object"
  ) {
    return faculty.departmentId._id;
  }

  if (
    faculty.department &&
    typeof faculty.department ===
      "object"
  ) {
    return faculty.department._id;
  }

  return "";
};

// =========================================================
// TEACHER HOME PAGE
// =========================================================

export default function TeacherHomePage() {

  // =======================================================
  // AUTH CONTEXT
  // =======================================================

  const {
    token,
    role,
    user,
    setToken,
    setRole,
    setUser,
  } = useAuth();

  // =======================================================
  // FACULTY STATE
  // =======================================================

  const [faculty, setFaculty] =
    useState<Faculty | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  // =======================================================
  // DEPARTMENTS
  // =======================================================

  const [departments, setDepartments] =
    useState<Department[]>([]);

  const [departmentsLoading, setDepartmentsLoading] =
    useState(false);

  // =======================================================
  // EDIT FACULTY
  // =======================================================

  const [editingFaculty, setEditingFaculty] =
    useState(false);

  const [savingFaculty, setSavingFaculty] =
    useState(false);

  const [facultyForm, setFacultyForm] =
    useState<Faculty>({});

  // =======================================================
  // PAPERS
  // =======================================================

  const [papers, setPapers] =
    useState<Paper[]>([]);

  const [papersLoading, setPapersLoading] =
    useState(false);

  const [paperError, setPaperError] =
    useState("");

  const [showPaperForm, setShowPaperForm] =
    useState(false);

  const [editingPaperId, setEditingPaperId] =
    useState<string | null>(null);

  const [savingPaper, setSavingPaper] =
    useState(false);

  const [paperForm, setPaperForm] =
    useState({
      title: "",
      paperUrl: "",
    });

  // =======================================================
  // ACCOUNT ID
  // =======================================================

  const accountId =
    user?._id ||
    (user as any)?.id ||
    (user as any)?.accountId;

  // =======================================================
  // FACULTY ID
  // =======================================================

  const facultyId =
    faculty?._id;

  // =======================================================
  // AUTHENTICATED CHECK
  // =======================================================

  const isAuthenticated =
    Boolean(
      token &&
      role === "faculty" &&
      user
    );

  // =======================================================
  // FACULTY ROLE OPTIONS
  // =======================================================

  const facultyRoleOptions = [
    "faculty",
    "assistant professor",
    "associate professor",
    "professor",
    "guest faculty",
    "lecturer",
    "head of department",
  ];

  // =======================================================
  // PREFIX OPTIONS
  // =======================================================

  const prefixOptions = [
    "Dr.",
    "Mr.",
    "Ms.",
    "Mrs.",
    "Prof.",
  ];

  // =======================================================
  // EXTERNAL LINK CHECK
  // =======================================================

  const isExternalLink = (
    url: string
  ) => {
    try {
      const linkUrl =
        new URL(
          url,
          window.location.origin
        );

      return (
        linkUrl.origin !==
        window.location.origin
      );
    } catch {
      return false;
    }
  };

  // =======================================================
  // EXTERNAL LINK NAVIGATION
  // =======================================================

  const handlePaperLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!isExternalLink(href)) {
      return;
    }

    e.preventDefault();

    confirmExternalLink({
      title: "Leave this site?",
      text: "You are being redirected to an external website.",
      confirmButtonText: "Continue",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#ef4444",
      customClass: {
        popup: "rounded-xl",
      },
    }).then((confirmed) => {
      if (confirmed) {
        window.open(
          href,
          "_blank",
          "noopener,noreferrer"
        );
      }
    });
  };

  // =======================================================
  // FETCH DEPARTMENTS
  // =======================================================

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const fetchDepartments =
      async () => {
        try {
          setDepartmentsLoading(true);

          const response =
            await apiClient.get(
              "/department"
            );

          const responseData =
            response.data;

          const departmentData =
            responseData?.data?.departments ||
            responseData?.data ||
            responseData?.departments ||
            [];

          if (
            Array.isArray(
              departmentData
            )
          ) {
            setDepartments(
              departmentData
            );
          } else {
            setDepartments([]);
          }

        } catch (err) {
          setDepartments([]);
        } finally {
          setDepartmentsLoading(false);
        }
      };

    fetchDepartments();

  }, [isAuthenticated]);

  // =======================================================
  // FETCH FACULTY
  // =======================================================

  useEffect(() => {
    if (
      !token ||
      role !== "faculty" ||
      !user ||
      !accountId
    ) {
      setFaculty(null);
      setLoading(false);
      return;
    }

    const fetchFaculty =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await apiClient.get(
              `/faculty/${accountId}`
            );

          const responseData =
            response.data as FacultyResponse;

          const facultyData =
            responseData?.data?.faculty ||
            responseData?.faculty ||
            responseData?.data;

          if (!facultyData) {
            throw new Error(
              "Faculty profile was not found."
            );
          }

          const loadedFaculty =
            facultyData as Faculty;

          setFaculty(
            loadedFaculty
          );

          setFacultyForm({
            ...loadedFaculty,
            departmentId:
              getDepartmentId(
                loadedFaculty
              ),
            dob:
              formatDateForInput(
                loadedFaculty.dob
              ),
          });

        } catch (err: any) {
          setError(
            getApiErrorMessage(
              err,
              "Unable to load your faculty profile."
            )
          );

        } finally {
          setLoading(false);
        }
      };

    fetchFaculty();

  }, [
    token,
    role,
    user,
    accountId,
  ]);

  // =======================================================
  // FETCH PAPERS
  // =======================================================

  useEffect(() => {
    if (
      !isAuthenticated ||
      !faculty?._id
    ) {
      setPapers([]);
      return;
    }

    const fetchPapers =
      async () => {
        try {
          setPapersLoading(true);
          setPaperError("");

          const response =
            await apiClient.get(
              `/paper/faculty/${faculty._id}`
            );

          const data =
            response.data?.data;

          setPapers(
            Array.isArray(data)
              ? data
              : []
          );

        } catch (err: any) {
          setPaperError(
            getApiErrorMessage(
              err,
              "Unable to load papers."
            )
          );

        } finally {
          setPapersLoading(false);
        }
      };

    fetchPapers();

  }, [
    isAuthenticated,
    faculty?._id,
  ]);

  // =======================================================
  // FULL NAME
  // =======================================================

  const fullName = [
    faculty?.namePrefix,
    faculty?.firstName,
    faculty?.middleName,
    faculty?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  // =======================================================
  // PHOTO URL
  // =======================================================

  const photoUrl =
    faculty?.photoId
      ? `${API_BASE_URL}/uploads/faculty/${faculty.photoId}`
      : "";

  // =======================================================
  // FACULTY FORM CHANGE
  // =======================================================

  const handleFacultyChange = (
    field: keyof Faculty,
    value: any
  ) => {
    setFacultyForm(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  // =======================================================
  // SAVE FACULTY
  // =======================================================

  const handleSaveFaculty =
    async () => {

      if (!faculty?._id) {
        return;
      }

      try {
        setSavingFaculty(true);
        setError("");

        const departmentId =
          getDepartmentId(
            facultyForm
          );

        const response =
          await apiClient.put(
            `/faculty-update/me`,
            {
              namePrefix:
                facultyForm.namePrefix,

              firstName:
                facultyForm.firstName,

              middleName:
                facultyForm.middleName,

              lastName:
                facultyForm.lastName,

              phoneNumber:
                facultyForm.phoneNumber,

              sex:
                facultyForm.sex,

              dob:
                facultyForm.dob || undefined,

              departmentId:
                departmentId || undefined,

              roles:
                facultyForm.roles,

              highestDegree:
                facultyForm.highestDegree,

              expertFields:
                facultyForm.expertFields,

              bios:
                facultyForm.bios,
            }
          );

        const updatedFaculty =
          response.data?.data?.faculty ||
          response.data?.faculty ||
          response.data?.data;

        if (updatedFaculty) {

          const normalizedFaculty =
            {
              ...updatedFaculty,
              dob:
                formatDateForInput(
                  updatedFaculty.dob
                ),
              departmentId:
                getDepartmentId(
                  updatedFaculty
                ),
            };

          setFaculty(
            updatedFaculty
          );

          setFacultyForm(
            normalizedFaculty
          );

        } else {

          setFaculty(
            facultyForm
          );

        }

        setEditingFaculty(false);

        await showAlert({
          title: "Updated!",
          text: "Your faculty information has been updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#22c55e",
          customClass: {
            popup: "rounded-xl",
          },
        });

      } catch (err: any) {

        setError(
          getApiErrorMessage(
            err,
            "Unable to update faculty information."
          )
        );

      } finally {
        setSavingFaculty(false);
      }
    };

  // =======================================================
  // CANCEL FACULTY EDIT
  // =======================================================

  const cancelFacultyEdit =
    () => {

      setFacultyForm({
        ...(faculty || {}),
        departmentId:
          getDepartmentId(
            faculty || undefined
          ),
        dob:
          formatDateForInput(
            faculty?.dob
          ),
      });

      setEditingFaculty(false);
    };

  // =======================================================
  // OPEN ADD PAPER
  // =======================================================

  const openAddPaper =
    () => {

      setEditingPaperId(null);

      setPaperForm({
        title: "",
        paperUrl: "",
      });

      setPaperError("");
      setShowPaperForm(true);
    };

  // =======================================================
  // OPEN EDIT PAPER
  // =======================================================

  const openEditPaper =
    (paper: Paper) => {

      setEditingPaperId(
        paper._id
      );

      setPaperForm({
        title:
          paper.title || "",

        paperUrl:
          paper.paperUrl || "",
      });

      setPaperError("");
      setShowPaperForm(true);
    };

  // =======================================================
  // CLOSE PAPER FORM
  // =======================================================

  const closePaperForm =
    () => {

      if (savingPaper) {
        return;
      }

      setShowPaperForm(false);

      setEditingPaperId(null);

      setPaperForm({
        title: "",
        paperUrl: "",
      });

      setPaperError("");
    };

  // =======================================================
  // PAPER FORM CHANGE
  // =======================================================

  const handlePaperChange = (
    field:
      | "title"
      | "paperUrl",
    value: string
  ) => {

    setPaperForm(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  // =======================================================
  // SAVE PAPER
  // =======================================================

  const handleSavePaper =
    async () => {

      if (
        !paperForm.title.trim()
      ) {

        setPaperError(
          "Please enter the paper title."
        );

        return;
      }

      try {

        setSavingPaper(true);
        setPaperError("");

        const paperPayload = {
          title:
            paperForm.title.trim(),

          paperUrl:
            paperForm.paperUrl.trim() ||
            undefined,
        };

        // =================================================
        // EDIT
        // =================================================

        if (editingPaperId) {

          const response =
            await apiClient.put(
              `/paper/me/${editingPaperId}`,
              paperPayload
            );

          const updatedPaper =
            response.data?.data;

          if (updatedPaper) {

            setPapers(
              (previous) =>
                previous.map(
                  (paper) =>
                    paper._id ===
                    editingPaperId
                      ? updatedPaper
                      : paper
                )
            );
          }

        }

        // =================================================
        // ADD
        // =================================================

        else {

          const response =
            await apiClient.post(
              "/paper/me",
              paperPayload
            );

          const newPaper =
            response.data?.data;

          if (newPaper) {

            setPapers(
              (previous) => [
                newPaper,
                ...previous,
              ]
            );
          }
        }

        const wasEditing =
          Boolean(
            editingPaperId
          );

        closePaperForm();

        await showAlert({
          title: wasEditing
            ? "Paper updated!"
            : "Paper added!",

          text: wasEditing
            ? "The paper has been updated successfully."
            : "The paper has been added successfully.",

          icon: "success",

          confirmButtonText:
            "OK",

          confirmButtonColor:
            "#22c55e",

          customClass: {
            popup: "rounded-xl",
          },
        });

      } catch (err: any) {

        const message =
          getApiErrorMessage(
            err,
            "Unable to save paper."
          );

        setPaperError(message);

        await showAlert({
          title:
            "Unable to save paper",

          text:
            message,

          icon:
            "error",

          confirmButtonText:
            "OK",

          confirmButtonColor:
            "#ef4444",

          customClass: {
            popup: "rounded-xl",
          },
        });

      } finally {
        setSavingPaper(false);
      }
    };

  // =======================================================
  // DELETE PAPER
  // =======================================================

  const handleDeletePaper =
    async (
      paperId: string
    ) => {

      const result =
        await showAlert({
          title:
            "Delete paper?",

          text:
            "This paper will be permanently deleted.",

          icon:
            "warning",

          showCancelButton:
            true,

          confirmButtonText:
            "Delete",

          cancelButtonText:
            "Cancel",

          confirmButtonColor:
            "#ef4444",

          cancelButtonColor:
            "#22c55e",

          customClass: {
            popup:
              "rounded-xl",
          },
        });

      if (!result.isConfirmed) {
        return;
      }

      try {

        setPaperError("");

        await apiClient.delete(
          `/paper/me/${paperId}`
        );

        setPapers(
          (previous) =>
            previous.filter(
              (paper) =>
                paper._id !==
                paperId
            )
        );

        await showAlert({
          title:
            "Deleted!",

          text:
            "The paper has been deleted successfully.",

          icon:
            "success",

          confirmButtonText:
            "OK",

          confirmButtonColor:
            "#22c55e",

          customClass: {
            popup:
              "rounded-xl",
          },
        });

      } catch (err: any) {

        const message =
          getApiErrorMessage(
            err,
            "Unable to delete paper."
          );

        setPaperError(message);

        await showAlert({
          title:
            "Delete failed",

          text:
            message,

          icon:
            "error",

          confirmButtonText:
            "OK",

          confirmButtonColor:
            "#ef4444",

          customClass: {
            popup:
              "rounded-xl",
          },
        });
      }
    };

  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout =
    async () => {

      const result =
        await showAlert({
          title:
            "Logout?",

          text:
            "Are you sure you want to sign out?",

          icon:
            "warning",

          showCancelButton:
            true,

          confirmButtonText:
            "Logout",

          cancelButtonText:
            "Cancel",

          confirmButtonColor:
            "#ef4444",

          cancelButtonColor:
            "#22c55e",

          customClass: {
            popup:
              "rounded-xl",
          },
        });

      if (!result.isConfirmed) {
        return;
      }

      try {

        if (user?.email) {

          await apiClient.post(
            "/account/logout",
            {
              email:
                user.email,
            }
          );
        }

      } catch (error) {

      } finally {

        setToken("");
        setRole("");
        setUser(null);

        window.location.href =
          "/faculty";
      }
    };

  // =======================================================
  // AUTH CHECK
  // =======================================================

  if (!isAuthenticated) {

    return (
      <div className="p-4">

        <SignIn_SignUP
          role="faculty"
        />

      </div>
    );
  }

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {

    return (
      <div
        className="
          min-h-screen
          bg-gray-50
          flex
          items-center
          justify-center
        "
      >

        <div className="text-center">

          <div
            className="
              w-12
              h-12
              border-4
              border-cyan-700
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p
            className="
              mt-4
              text-sm
              font-semibold
              text-gray-600
            "
          >
            Loading faculty dashboard...
          </p>

        </div>

      </div>
    );
  }

  // =======================================================
  // ERROR
  // =======================================================

  if (error) {

    return (
      <div
        className="
          min-h-screen
          bg-gray-50
          flex
          items-center
          justify-center
          px-4
        "
      >

        <div
          className="
            w-full
            max-w-md
            bg-white
            rounded-3xl
            shadow-xl
            border
            border-red-100
            p-8
            text-center
          "
        >

          <FaUserCircle
            className="
              text-5xl
              text-red-400
              mx-auto
            "
          />

          <h2
            className="
              text-xl
              font-bold
              text-gray-900
              mt-5
            "
          >
            Unable to Load Profile
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              mt-2
            "
          >
            {error}
          </p>

          <div
            className="
              flex
              gap-3
              mt-6
            "
          >

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="
                flex-1
                bg-cyan-700
                hover:bg-cyan-800
                text-white
                font-bold
                py-3
                rounded-xl
              "
            >
              Try Again
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="
                flex-1
                bg-gray-100
                hover:bg-gray-200
                text-gray-700
                font-bold
                py-3
                rounded-xl
              "
            >
              Sign Out
            </button>

          </div>

        </div>

      </div>
    );
  }

  // =======================================================
  // MAIN PAGE
  // =======================================================

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
      "
    >

      {/* =================================================
          MOBILE HEADER
      ================================================= */}

      <header
        className="
          lg:hidden
          fixed
          top-0
          left-0
          right-0
          h-16
          bg-white
          border-b
          border-gray-200
          z-40
          flex
          items-center
          justify-between
          px-4
        "
      >

        <button
          type="button"
          onClick={() =>
            setSidebarOpen(true)
          }
          className="
            w-10
            h-10
            rounded-xl
            bg-gray-100
            flex
            items-center
            justify-center
            text-gray-700
          "
        >
          <FaBars />
        </button>

        <div className="text-center">

          <p
            className="
              text-sm
              font-extrabold
              text-gray-900
            "
          >
            Faculty CMS
          </p>

          <p
            className="
              text-[10px]
              text-gray-400
            "
          >
            Teacher Portal
          </p>

        </div>

        <div
          className="
            w-10
            h-10
            rounded-full
            overflow-hidden
            bg-cyan-100
            flex
            items-center
            justify-center
          "
        >

          {photoUrl ? (

            <img
              src={photoUrl}
              alt={fullName}
              className="
                w-full
                h-full
                object-cover
              "
            />

          ) : (

            <FaUserCircle
              className="
                text-cyan-700
                text-xl
              "
            />

          )}

        </div>

      </header>

      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="
            lg:hidden
            fixed
            inset-0
            bg-black/40
            z-40
          "
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed
          top-0
          left-0
          bottom-0
          w-72
          bg-white
          border-r
          border-gray-200
          z-50
          transform
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <div
          className="
            h-20
            px-6
            flex
            items-center
            justify-between
            border-b
            border-gray-100
          "
        >

          <div>

            <h1
              className="
                text-lg
                font-extrabold
                text-gray-900
              "
            >
              Faculty CMS
            </h1>

            <p
              className="
                text-[10px]
                text-gray-400
                font-semibold
                uppercase
                tracking-wider
              "
            >
              Teacher Portal
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(false)
            }
            className="
              lg:hidden
              w-9
              h-9
              rounded-lg
              bg-gray-100
              flex
              items-center
              justify-center
            "
          >
            <FaTimes />
          </button>

        </div>

        {/* Faculty */}

        <div
          className="
            px-5
            py-5
            border-b
            border-gray-100
          "
        >

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-12
                h-12
                rounded-full
                overflow-hidden
                bg-cyan-100
                border-2
                border-cyan-100
                flex-shrink-0
              "
            >

              {photoUrl ? (

                <img
                  src={photoUrl}
                  alt={fullName}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <FaUserCircle
                  className="
                    text-cyan-700
                    text-4xl
                    m-1
                  "
                />

              )}

            </div>

            <div className="min-w-0">

              <p
                className="
                  text-sm
                  font-bold
                  text-gray-900
                  truncate
                "
              >
                {fullName ||
                  faculty?.username ||
                  "Faculty"}
              </p>

              <p
                className="
                  text-[11px]
                  text-gray-500
                  truncate
                "
              >
                {formatRole(
                  faculty?.roles
                )}
              </p>

            </div>

          </div>

        </div>

        {/* Dashboard */}

        <nav className="p-4">

          <button
            type="button"
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-sm
              font-semibold
              bg-cyan-700
              text-white
              shadow-md
            "
          >

            <FaHome />

            <span>
              Dashboard
            </span>

          </button>

        </nav>

        {/* Logout */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            p-4
            border-t
            border-gray-100
          "
        >

          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-sm
              font-semibold
              text-red-600
              hover:bg-red-50
              transition
            "
          >

            <FaSignOutAlt />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main
        className="
          lg:ml-72
          min-h-screen
          pt-16
          lg:pt-0
        "
      >

        {/* Desktop Header */}

        <div
          className="
            hidden
            lg:flex
            h-20
            bg-white
            border-b
            border-gray-200
            items-center
            justify-between
            px-8
          "
        >

          <div>

            <p
              className="
                text-xs
                font-semibold
                text-gray-400
                uppercase
                tracking-wider
              "
            >
              Faculty Portal
            </p>

            <h2
              className="
                text-xl
                font-extrabold
                text-gray-900
              "
            >
              Dashboard
            </h2>

          </div>

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <div
              className="
                w-10
                h-10
                rounded-full
                overflow-hidden
                bg-cyan-100
                flex
                items-center
                justify-center
              "
            >

              {photoUrl ? (

                <img
                  src={photoUrl}
                  alt={fullName}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              ) : (

                <FaUserCircle
                  className="
                    text-cyan-700
                    text-xl
                  "
                />

              )}

            </div>

            <div>

              <p
                className="
                  text-sm
                  font-bold
                  text-gray-900
                "
              >
                {fullName ||
                  faculty?.username ||
                  "Faculty"}
              </p>

              <p
                className="
                  text-[10px]
                  text-gray-400
                "
              >
                {formatRole(
                  faculty?.roles
                )}
              </p>

            </div>

          </div>

        </div>

        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          className="
            p-4
            sm:p-6
            lg:p-8
            max-w-7xl
            mx-auto
          "
        >

          {/* =================================================
              WELCOME
          ================================================= */}

          <section
            className="
              bg-gradient-to-r
              from-cyan-950
              via-slate-900
              to-cyan-900
              rounded-3xl
              p-6
              sm:p-8
              text-white
              shadow-xl
            "
          >

            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                justify-between
                gap-6
              "
            >

              <div>

                <p
                  className="
                    text-cyan-300
                    text-xs
                    font-bold
                    uppercase
                    tracking-widest
                  "
                >
                  Welcome back
                </p>

                <h1
                  className="
                    text-2xl
                    sm:text-3xl
                    font-extrabold
                    mt-2
                  "
                >
                  {fullName ||
                    faculty?.username ||
                    "Faculty"}
                </h1>

                <p
                  className="
                    text-sm
                    text-slate-300
                    mt-2
                    max-w-xl
                  "
                >
                  Manage your faculty information
                  and research papers from your
                  dashboard.
                </p>

              </div>

              <div
                className="
                  w-24
                  h-24
                  rounded-full
                  overflow-hidden
                  border-4
                  border-white/20
                  bg-white/10
                  flex-shrink-0
                "
              >

                {photoUrl ? (

                  <img
                    src={photoUrl}
                    alt={fullName}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                ) : (

                  <FaUserCircle
                    className="
                      text-white/70
                      text-6xl
                      m-2
                    "
                  />

                )}

              </div>

            </div>

          </section>

          {/* =================================================
              FACULTY INFORMATION
          ================================================= */}

          <section
            className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              shadow-sm
              mt-6
            "
          >

            {/* Header */}

            <div
              className="
                px-6
                py-5
                border-b
                border-gray-100
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
              "
            >

              <div>

                <h2
                  className="
                    text-lg
                    font-extrabold
                    text-gray-900
                  "
                >
                  Faculty Information
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-1
                  "
                >
                  Edit your professional information
                </p>

              </div>

              {!editingFaculty ? (

                <button
                  type="button"
                  onClick={() =>
                    setEditingFaculty(true)
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    bg-cyan-700
                    hover:bg-cyan-800
                    text-white
                    px-4
                    py-2.5
                    rounded-xl
                    text-sm
                    font-bold
                  "
                >

                  <FaEdit />

                  Edit Information

                </button>

              ) : (

                <div
                  className="
                    flex
                    gap-2
                  "
                >

                  <button
                    type="button"
                    onClick={
                      cancelFacultyEdit
                    }
                    disabled={
                      savingFaculty
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      bg-gray-100
                      hover:bg-gray-200
                      text-gray-700
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      font-bold
                    "
                  >

                    <FaTimesCircle />

                    Cancel

                  </button>

                  <button
                    type="button"
                    onClick={
                      handleSaveFaculty
                    }
                    disabled={
                      savingFaculty
                    }
                    className="
                      inline-flex
                      items-center
                      gap-2
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      px-4
                      py-2.5
                      rounded-xl
                      text-sm
                      font-bold
                    "
                  >

                    <FaSave />

                    {savingFaculty
                      ? "Saving..."
                      : "Save"}

                  </button>

                </div>

              )}

            </div>

            {/* Faculty Table */}

            <div className="overflow-x-auto">

              <table
                className="
                  w-full
                  min-w-[700px]
                "
              >

                <tbody>

                  {/* =================================================
                      NAME
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        w-1/3
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                      "
                    >
                      Full Name
                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >

                      {editingFaculty ? (

                        <div
                          className="
                            grid
                            grid-cols-2
                            md:grid-cols-4
                            gap-2
                          "
                        >

                          {/* PREFIX DROPDOWN */}

                          <select
                            value={
                              facultyForm.namePrefix ||
                              ""
                            }
                            onChange={(e) =>
                              handleFacultyChange(
                                "namePrefix",
                                e.target.value
                              )
                            }
                            className="
                              border
                              border-gray-200
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              outline-none
                              bg-white
                              focus:ring-2
                              focus:ring-cyan-500
                            "
                          >

                            <option value="">
                              Prefix
                            </option>

                            {prefixOptions.map(
                              (prefix) => (

                                <option
                                  key={prefix}
                                  value={prefix}
                                >
                                  {prefix}
                                </option>

                              )
                            )}

                          </select>

                          {/* FIRST NAME */}

                          <input
                            value={
                              facultyForm.firstName ||
                              ""
                            }
                            onChange={(e) =>
                              handleFacultyChange(
                                "firstName",
                                e.target.value
                              )
                            }
                            placeholder="First name"
                            className="
                              border
                              border-gray-200
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              outline-none
                              focus:ring-2
                              focus:ring-cyan-500
                            "
                          />

                          {/* MIDDLE NAME */}

                          <input
                            value={
                              facultyForm.middleName ||
                              ""
                            }
                            onChange={(e) =>
                              handleFacultyChange(
                                "middleName",
                                e.target.value
                              )
                            }
                            placeholder="Middle name"
                            className="
                              border
                              border-gray-200
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              outline-none
                              focus:ring-2
                              focus:ring-cyan-500
                            "
                          />

                          {/* LAST NAME */}

                          <input
                            value={
                              facultyForm.lastName ||
                              ""
                            }
                            onChange={(e) =>
                              handleFacultyChange(
                                "lastName",
                                e.target.value
                              )
                            }
                            placeholder="Last name"
                            className="
                              border
                              border-gray-200
                              rounded-lg
                              px-3
                              py-2
                              text-sm
                              outline-none
                              focus:ring-2
                              focus:ring-cyan-500
                            "
                          />

                        </div>

                      ) : (

                        fullName ||
                        faculty?.username ||
                        "Not available"

                      )}

                    </td>

                  </tr>

                  {/* =================================================
                      EMAIL
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                      "
                    >
                      Email
                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >

                      {faculty?.email ||
                        user?.email ||
                        "Not available"}

                    </td>

                  </tr>

                  {/* =================================================
                      PHONE
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                      "
                    >
                      Phone
                    </td>

                    <td className="px-6 py-4">

                      {editingFaculty ? (

                        <input
                          value={
                            facultyForm.phoneNumber ||
                            ""
                          }
                          onChange={(e) =>
                            handleFacultyChange(
                              "phoneNumber",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            max-w-md
                            border
                            border-gray-200
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-cyan-500
                          "
                        />

                      ) : (

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                        >
                          {faculty?.phoneNumber ||
                            "Not available"}
                        </span>

                      )}

                    </td>

                  </tr>

                  {/* =================================================
                      DEPARTMENT - DROPDOWN
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                      "
                    >
                      Department
                    </td>

                    <td className="px-6 py-4">

                      {editingFaculty ? (

                        <select
                          value={
                            getDepartmentId(
                              facultyForm
                            )
                          }
                          onChange={(e) =>
                            handleFacultyChange(
                              "departmentId",
                              e.target.value
                            )
                          }
                          disabled={
                            departmentsLoading
                          }
                          className="
                            w-full
                            max-w-md
                            border
                            border-gray-200
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            outline-none
                            bg-white
                            focus:ring-2
                            focus:ring-cyan-500
                            disabled:bg-gray-100
                            disabled:cursor-not-allowed
                          "
                        >

                          <option value="">
                            {departmentsLoading
                              ? "Loading departments..."
                              : "Select Department"}
                          </option>

                          {departments.map(
                            (department) => (

                              <option
                                key={
                                  department._id
                                }
                                value={
                                  department._id
                                }
                              >
                                {department.name}
                              </option>

                            )
                          )}

                        </select>

                      ) : (

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                        >
                          {getDepartmentName(
                            faculty?.department ||
                            faculty?.departmentId
                          )}
                        </span>

                      )}

                    </td>

                  </tr>

                  {/* =================================================
                      FACULTY ROLE - DROPDOWN
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                      "
                    >
                      Faculty Role
                    </td>

                    <td className="px-6 py-4">

                      {editingFaculty ? (

                        <select
                          value={
                            Array.isArray(
                              facultyForm.roles
                            )
                              ? facultyForm.roles[0] ||
                                ""
                              : facultyForm.roles ||
                                ""
                          }
                          onChange={(e) =>
                            handleFacultyChange(
                              "roles",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            max-w-md
                            border
                            border-gray-200
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            outline-none
                            bg-white
                            focus:ring-2
                            focus:ring-cyan-500
                          "
                        >

                          <option value="">
                            Select Faculty Role
                          </option>

                          {facultyRoleOptions.map(
                            (roleOption) => (

                              <option
                                key={
                                  roleOption
                                }
                                value={
                                  roleOption
                                }
                              >
                                {formatRole(
                                  roleOption
                                )}
                              </option>

                            )
                          )}

                        </select>

                      ) : (

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                        >
                          {formatRole(
                            faculty?.roles
                          )}
                        </span>

                      )}

                    </td>

                  </tr>

                  {/* =================================================
                      HIGHEST DEGREE
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                      "
                    >
                      Highest Degree
                    </td>

                    <td className="px-6 py-4">

                      {editingFaculty ? (

                        <input
                          value={
                            facultyForm.highestDegree ||
                            ""
                          }
                          onChange={(e) =>
                            handleFacultyChange(
                              "highestDegree",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            max-w-md
                            border
                            border-gray-200
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-cyan-500
                          "
                        />

                      ) : (

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                        >
                          {faculty?.highestDegree ||
                            "Not available"}
                        </span>

                      )}

                    </td>

                  </tr>

                  {/* =================================================
                      GENDER
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                      "
                    >
                      Gender
                    </td>

                    <td className="px-6 py-4">

                      {editingFaculty ? (

                        <select
                          value={
                            facultyForm.sex ||
                            ""
                          }
                          onChange={(e) =>
                            handleFacultyChange(
                              "sex",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            max-w-md
                            border
                            border-gray-200
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            outline-none
                            bg-white
                            focus:ring-2
                            focus:ring-cyan-500
                          "
                        >

                          <option value="">
                            Select
                          </option>

                          <option value="male">
                            Male
                          </option>

                          <option value="female">
                            Female
                          </option>

                          <option value="other">
                            Other
                          </option>

                          <option value="prefer not to say">
                            Prefer not to say
                          </option>

                        </select>

                      ) : (

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                            capitalize
                          "
                        >
                          {faculty?.sex ||
                            "Not available"}
                        </span>

                      )}

                    </td>

                  </tr>

                  {/* =================================================
                      DATE OF BIRTH - DATE PICKER
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                      "
                    >
                      Date of Birth
                    </td>

                    <td className="px-6 py-4">

                      {editingFaculty ? (

                        <input
                          type="date"
                          value={
                            facultyForm.dob
                              ? formatDateForInput(
                                  facultyForm.dob
                                )
                              : ""
                          }
                          onChange={(e) =>
                            handleFacultyChange(
                              "dob",
                              e.target.value
                            )
                          }
                          className="
                            w-full
                            max-w-md
                            border
                            border-gray-200
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            outline-none
                            bg-white
                            focus:ring-2
                            focus:ring-cyan-500
                          "
                        />

                      ) : (

                        <span
                          className="
                            text-sm
                            font-semibold
                            text-gray-800
                          "
                        >
                          {formatDate(
                            faculty?.dob
                          )}
                        </span>

                      )}

                    </td>

                  </tr>

                  {/* =================================================
                      HOD
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                      "
                    >
                      HOD Status
                    </td>

                    <td
                      className="
                        px-6
                        py-4
                        text-sm
                        font-semibold
                        text-gray-800
                      "
                    >

                      {faculty?.hod
                        ? "Head of Department"
                        : "Faculty Member"}

                    </td>

                  </tr>

                  {/* =================================================
                      BIOGRAPHY
                  ================================================= */}

                  <tr
                    className="
                      border-b
                      border-gray-100
                    "
                  >

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                        align-top
                      "
                    >
                      Biography
                    </td>

                    <td className="px-6 py-4">

                      {editingFaculty ? (

                        <textarea
                          value={
                            facultyForm.bios ||
                            ""
                          }
                          onChange={(e) =>
                            handleFacultyChange(
                              "bios",
                              e.target.value
                            )
                          }
                          rows={5}
                          className="
                            w-full
                            border
                            border-gray-200
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            outline-none
                            resize-y
                            focus:ring-2
                            focus:ring-cyan-500
                          "
                        />

                      ) : (

                        <p
                          className="
                            text-sm
                            leading-6
                            text-gray-600
                            whitespace-pre-line
                          "
                        >
                          {faculty?.bios ||
                            "No biography available."}
                        </p>

                      )}

                    </td>

                  </tr>

                  {/* =================================================
                      EXPERT FIELDS
                  ================================================= */}

                  <tr>

                    <td
                      className="
                        px-6
                        py-4
                        text-xs
                        font-bold
                        text-gray-400
                        uppercase
                        align-top
                      "
                    >
                      Areas of Expertise
                    </td>

                    <td className="px-6 py-4">

                      {editingFaculty ? (

                        <input
                          value={
                            facultyForm.expertFields?.join(
                              ", "
                            ) || ""
                          }
                          onChange={(e) =>
                            handleFacultyChange(
                              "expertFields",
                              e.target.value
                                .split(",")
                                .map(
                                  (item) =>
                                    item.trim()
                                )
                                .filter(
                                  Boolean
                                )
                            )
                          }
                          placeholder="AI, Machine Learning, Computer Vision"
                          className="
                            w-full
                            border
                            border-gray-200
                            rounded-lg
                            px-3
                            py-2
                            text-sm
                            outline-none
                            focus:ring-2
                            focus:ring-cyan-500
                          "
                        />

                      ) : (

                        <div
                          className="
                            flex
                            flex-wrap
                            gap-2
                          "
                        >

                          {faculty?.expertFields &&
                          faculty.expertFields.length >
                            0 ? (

                            faculty.expertFields.map(
                              (
                                field,
                                index
                              ) => (

                                <span
                                  key={
                                    `${field}-${index}`
                                  }
                                  className="
                                    px-3
                                    py-1.5
                                    rounded-lg
                                    bg-cyan-50
                                    text-cyan-800
                                    text-xs
                                    font-bold
                                  "
                                >
                                  {field}
                                </span>

                              )
                            )

                          ) : (

                            <span
                              className="
                                text-sm
                                text-gray-400
                              "
                            >
                              No expertise information.
                            </span>

                          )}

                        </div>

                      )}

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </section>

          {/* =================================================
              PAPERS PANEL
          ================================================= */}

          <section
            className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              shadow-sm
              mt-6
              mb-8
            "
          >

            {/* Papers Header */}

            <div
              className="
                px-6
                py-5
                border-b
                border-gray-100
                flex
                flex-col
                sm:flex-row
                sm:items-center
                sm:justify-between
                gap-3
              "
            >

              <div>

                <h2
                  className="
                    text-lg
                    font-extrabold
                    text-gray-900
                  "
                >
                  Research Papers
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-1
                  "
                >
                  Manage your research papers,
                  publications and documents.
                </p>

              </div>

              <button
                type="button"
                onClick={openAddPaper}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-cyan-700
                  hover:bg-cyan-800
                  text-white
                  px-4
                  py-2.5
                  rounded-xl
                  text-sm
                  font-bold
                "
              >

                <FaPlus />

                Add Paper

              </button>

            </div>

            {/* Paper Error */}

            {paperError &&
              !showPaperForm && (
                <div
                  className="
                    mx-6
                    mt-5
                    px-4
                    py-3
                    rounded-xl
                    bg-red-50
                    border
                    border-red-100
                    text-sm
                    text-red-600
                  "
                >
                  {paperError}
                </div>
              )}

            {/* Loading */}

            {papersLoading ? (

              <div
                className="
                  p-10
                  text-center
                "
              >

                <div
                  className="
                    w-8
                    h-8
                    border-4
                    border-cyan-700
                    border-t-transparent
                    rounded-full
                    animate-spin
                    mx-auto
                  "
                />

                <p
                  className="
                    mt-3
                    text-sm
                    text-gray-400
                  "
                >
                  Loading papers...
                </p>

              </div>

            ) : papers.length === 0 ? (

              <div
                className="
                  p-10
                  text-center
                "
              >

                <FaBookOpen
                  className="
                    text-4xl
                    text-gray-300
                    mx-auto
                  "
                />

                <h3
                  className="
                    text-base
                    font-bold
                    text-gray-700
                    mt-4
                  "
                >
                  No papers yet
                </h3>

                <p
                  className="
                    text-sm
                    text-gray-400
                    mt-1
                  "
                >
                  Add your first research paper.
                </p>

                <button
                  type="button"
                  onClick={openAddPaper}
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-2
                    bg-cyan-700
                    text-white
                    px-4
                    py-2.5
                    rounded-xl
                    text-sm
                    font-bold
                  "
                >

                  <FaPlus />

                  Add Paper

                </button>

              </div>

            ) : (

              <div
                className="
                  overflow-x-auto
                "
              >

                <table
                  className="
                    w-full
                    min-w-[700px]
                  "
                >

                  <thead>

                    <tr
                      className="
                        bg-gray-50
                        border-b
                        border-gray-200
                      "
                    >

                      <th
                        className="
                          text-left
                          px-6
                          py-4
                          text-[11px]
                          font-bold
                          text-gray-400
                          uppercase
                        "
                      >
                        Title
                      </th>

                      <th
                        className="
                          text-left
                          px-6
                          py-4
                          text-[11px]
                          font-bold
                          text-gray-400
                          uppercase
                        "
                      >
                        Link
                      </th>

                      <th
                        className="
                          text-right
                          px-6
                          py-4
                          text-[11px]
                          font-bold
                          text-gray-400
                          uppercase
                        "
                      >
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {papers.map(
                      (paper) => (

                        <tr
                          key={paper._id}
                          className="
                            border-b
                            border-gray-100
                            hover:bg-gray-50
                          "
                        >

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

                            <p
                              className="
                                text-sm
                                font-bold
                                text-gray-900
                              "
                            >
                              {paper.title}
                            </p>

                          </td>

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

                            {paper.paperUrl ? (

                              <a
                                href={
                                  paper.paperUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) =>
                                  handlePaperLinkClick(
                                    e,
                                    paper.paperUrl!
                                  )
                                }
                                className="
                                  inline-flex
                                  items-center
                                  gap-2
                                  text-sm
                                  font-bold
                                  text-cyan-700
                                  hover:text-cyan-900
                                "
                              >

                                Open Paper

                                <FaExternalLinkAlt
                                  className="
                                    text-xs
                                  "
                                />

                              </a>

                            ) : (

                              <span
                                className="
                                  text-sm
                                  text-gray-400
                                  italic
                                "
                              >
                                No link provided
                              </span>

                            )}

                          </td>

                          <td
                            className="
                              px-6
                              py-5
                            "
                          >

                            <div
                              className="
                                flex
                                items-center
                                justify-end
                                gap-2
                              "
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  openEditPaper(
                                    paper
                                  )
                                }
                                className="
                                  w-9
                                  h-9
                                  rounded-lg
                                  bg-blue-50
                                  text-blue-600
                                  hover:bg-blue-100
                                  flex
                                  items-center
                                  justify-center
                                "
                                title="Edit paper"
                              >

                                <FaEdit />

                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeletePaper(
                                    paper._id
                                  )
                                }
                                className="
                                  w-9
                                  h-9
                                  rounded-lg
                                  bg-red-50
                                  text-red-600
                                  hover:bg-red-100
                                  flex
                                  items-center
                                  justify-center
                                "
                                title="Delete paper"
                              >

                                <FaTrash />

                              </button>

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

      </main>

      {/* =====================================================
          PAPER MODAL
      ===================================================== */}

      {showPaperForm && (

        <div
          className="
            fixed
            inset-0
            z-[100]
            bg-black/50
            flex
            items-center
            justify-center
            p-4
          "
        >

          <div
            className="
              w-full
              max-w-lg
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden
            "
          >

            <div
              className="
                px-6
                py-5
                border-b
                border-gray-100
                flex
                items-center
                justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-lg
                    font-extrabold
                    text-gray-900
                  "
                >
                  {editingPaperId
                    ? "Edit Paper"
                    : "Add Research Paper"}
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-1
                  "
                >
                  Enter your paper information.
                </p>

              </div>

              <button
                type="button"
                onClick={closePaperForm}
                disabled={savingPaper}
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-gray-100
                  text-gray-600
                  hover:bg-gray-200
                  flex
                  items-center
                  justify-center
                "
              >
                <FaTimes />
              </button>

            </div>

            <div className="p-6 space-y-5">

              {/* Title */}

              <div>

                <label
                  className="
                    block
                    text-xs
                    font-bold
                    text-gray-600
                    mb-2
                  "
                >
                  Paper Title

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>

                <input
                  value={
                    paperForm.title
                  }
                  onChange={(e) =>
                    handlePaperChange(
                      "title",
                      e.target.value
                    )
                  }
                  placeholder="Enter paper title"
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:ring-2
                    focus:ring-cyan-500
                  "
                />

              </div>

              {/* URL */}

              <div>

                <label
                  className="
                    block
                    text-xs
                    font-bold
                    text-gray-600
                    mb-2
                  "
                >
                  Paper URL

                  <span
                    className="
                      ml-2
                      text-[10px]
                      font-medium
                      text-gray-400
                      normal-case
                    "
                  >
                    Optional
                  </span>

                </label>

                <input
                  type="url"
                  value={
                    paperForm.paperUrl
                  }
                  onChange={(e) =>
                    handlePaperChange(
                      "paperUrl",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:ring-2
                    focus:ring-cyan-500
                  "
                />

                <p
                  className="
                    mt-2
                    text-[11px]
                    text-gray-400
                  "
                >
                  You can leave this empty if the
                  paper does not have an online link.
                </p>

              </div>

              {/* Error */}

              {paperError && (

                <div
                  className="
                    p-3
                    rounded-xl
                    bg-red-50
                    text-red-600
                    text-xs
                    font-semibold
                  "
                >
                  {paperError}
                </div>

              )}

              {/* Buttons */}

              <div
                className="
                  flex
                  gap-3
                  pt-2
                "
              >

                <button
                  type="button"
                  onClick={closePaperForm}
                  disabled={savingPaper}
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-gray-100
                    hover:bg-gray-200
                    text-gray-700
                    text-sm
                    font-bold
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleSavePaper
                  }
                  disabled={
                    savingPaper
                  }
                  className="
                    flex-1
                    py-3
                    rounded-xl
                    bg-cyan-700
                    hover:bg-cyan-800
                    text-white
                    text-sm
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <FaSave />

                  {savingPaper
                    ? "Saving..."
                    : editingPaperId
                      ? "Update Paper"
                      : "Add Paper"}

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
