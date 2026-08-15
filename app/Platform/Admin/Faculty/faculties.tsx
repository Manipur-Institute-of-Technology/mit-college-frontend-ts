import { useEffect, useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaExternalLinkAlt,
  FaTimes,
  FaSave,
  FaBookOpen,
  FaArrowLeft,
} from "react-icons/fa";
import { BellIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import "./faculties.css";

import apiClient, {
  API_BASE_URL,
} from "~/utils/apiClient";

import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";

// IMPORTANT:
// Default import only.
// DO NOT import TeacherDataType from this file.
import Teacher_Profile_View from "~/Common/Teacher/Teacher_Profile_View";

// =========================================================
// TYPES
// =========================================================

type Department = {
  _id: string;
  name: string;
};

type Paper = {
  _id: string;
  facultyId: string;
  title: string;
  paperUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

type FacultyMember = {
  _id: string;
  accountId?: string;

  securityCode?: string;

  firstName?: string;
  middleName?: string;
  lastName?: string;
  namePrefix?: string;

  email?: string;
  username?: string;

  roles?: string | string[];

  departmentId?: string;
  department?: Department;

  contactInfo?: {
    email?: string;
    phone?: string;
  };

  phoneNumber?: string;

  highestDegree?: string;

  expertFields?: string[];

  photoId?: string;
  photo?: string;

  sex?:
    | "male"
    | "female"
    | "other"
    | "prefer not to say";

  bios?: string;

  hod?: boolean;

  papers?: Paper[];
};

type FacultyRequest = {
  _id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
};

type FacultyForm = {
  namePrefix: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  sex: string;
  highestDegree: string;
  expertFields: string;
  bios: string;
  roles: string;
  hod: boolean;
};

type PaperForm = {
  title: string;
  paperUrl: string;
};

// =========================================================
// HELPERS
// =========================================================

const getApiErrorMessage = (
  error: any,
  fallback: string
) => {
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

const getFacultyName = (
  faculty: FacultyMember
) => {
  return [
    faculty.namePrefix,
    faculty.firstName,
    faculty.middleName,
    faculty.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim() || "Faculty Member";
};

const getFacultyEmail = (
  faculty: FacultyMember
) => {
  return (
    faculty.email ||
    faculty.contactInfo?.email ||
    "No email"
  );
};

const getFacultyRole = (
  faculty: FacultyMember
) => {
  return formatRole(faculty.roles);
};

// =========================================================
// ADMIN FACULTY PAGE
// =========================================================

export default function Admin_Faculty_Page() {
  const {
    token,
    role,
  } = useAuth();

  // =======================================================
  // STATE
  // =======================================================

  const [showRequestModal, setShowRequestModal] =
    useState(false);

  const [showFacultyModal, setShowFacultyModal] =
    useState(false);

  const [showPaperModal, setShowPaperModal] =
    useState(false);

  const [showAllPapersModal, setShowAllPapersModal] =
    useState(false);

  // NEW:
  // Selected teacher for Teacher_Profile_View
  const [selectedTeacher, setSelectedTeacher] =
    useState<FacultyMember | null>(null);

  const [requests, setRequests] =
    useState<FacultyRequest[]>([]);

  const [facultyList, setFacultyList] =
    useState<FacultyMember[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [savingFaculty, setSavingFaculty] =
    useState(false);

  const [savingPaper, setSavingPaper] =
    useState(false);

  const [selectedFaculty, setSelectedFaculty] =
    useState<FacultyMember | null>(null);

  const [editingFacultyId, setEditingFacultyId] =
    useState<string | null>(null);

  const [editingPaperId, setEditingPaperId] =
    useState<string | null>(null);

  const [facultyForm, setFacultyForm] =
    useState<FacultyForm>({
      namePrefix: "",
      firstName: "",
      middleName: "",
      lastName: "",
      phoneNumber: "",
      sex: "",
      highestDegree: "",
      expertFields: "",
      bios: "",
      roles: "",
      hod: false,
    });

  const [paperForm, setPaperForm] =
    useState<PaperForm>({
      title: "",
      paperUrl: "",
    });

  // =======================================================
  // FETCH FACULTY + REQUESTS
  // =======================================================

  const fetchFacultyAndRequests =
    async () => {
      setLoading(true);

      try {
        const facultyResponse =
          await apiClient.get("/faculty");

        const facultyData =
          facultyResponse.data?.data;

        let loadedFaculty: FacultyMember[] = [];

        if (
          facultyData?.faculty &&
          Array.isArray(
            facultyData.faculty
          )
        ) {
          loadedFaculty =
            facultyData.faculty;
        } else if (
          Array.isArray(facultyData)
        ) {
          loadedFaculty =
            facultyData;
        } else if (
          Array.isArray(
            facultyResponse.data?.faculty
          )
        ) {
          loadedFaculty =
            facultyResponse.data.faculty;
        }

        setFacultyList(
          loadedFaculty
        );

        const requestResponse =
          await apiClient.get(
            "/account/requestfaculty"
          );

        const requestData =
          requestResponse.data?.data
            ?.requests ||
          requestResponse.data?.requests ||
          [];

        setRequests(
          Array.isArray(requestData)
            ? requestData
            : []
        );
      } catch (error) {
        console.error(
          "FACULTY FETCH ERROR:",
          error
        );

        toast.error(
          getApiErrorMessage(
            error,
            "Unable to load faculty information."
          )
        );
      } finally {
        setLoading(false);
      }
    };

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    if (
      token &&
      role === "admin"
    ) {
      fetchFacultyAndRequests();
    }
  }, [token, role]);

  // =======================================================
  // OPEN TEACHER PROFILE
  // =======================================================

  const openTeacherProfile = (
    teacher: FacultyMember
  ) => {
    /*
     * IMPORTANT:
     *
     * We are NOT navigating to:
     *
     * /teacher/:id
     *
     * Instead we pass the already loaded
     * teacher object directly to
     * Teacher_Profile_View.
     *
     * This follows the same data-driven
     * approach used by DepartmentData.
     */

    setSelectedTeacher(
      teacher
    );

    // Close anything else that might be open.
    setShowRequestModal(
      false
    );

    setShowFacultyModal(
      false
    );

    setShowPaperModal(
      false
    );

    setShowAllPapersModal(
      false
    );
  };

  // =======================================================
  // CLOSE TEACHER PROFILE
  // =======================================================

  const closeTeacherProfile =
    () => {
      setSelectedTeacher(
        null
      );
    };

  // =======================================================
  // ACCEPT REQUEST
  // =======================================================

  const handleAcceptRequest =
    async (
      id: string,
      name: string
    ) => {
      try {
        await apiClient.post(
          `/account/requestfaculty/accept/${id}`
        );

        setRequests(
          (previous) =>
            previous.filter(
              (request) =>
                request._id !== id
            )
        );

        toast.success(
          `Approved registration for ${name}`
        );

        fetchFacultyAndRequests();
      } catch (error) {
        console.error(
          "ACCEPT FACULTY ERROR:",
          error
        );

        toast.error(
          getApiErrorMessage(
            error,
            "Failed to approve faculty request."
          )
        );
      }
    };

  // =======================================================
  // REJECT REQUEST
  // =======================================================

  const handleRejectRequest =
    async (
      id: string,
      name: string
    ) => {
      const confirmation =
        await Swal.fire({
          title: "Reject registration?",
          text: `Reject the faculty registration request for ${name}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Reject",
          cancelButtonText: "Stay here",
          confirmButtonColor: "#ef4444",
          cancelButtonColor: "#22c55e",
          customClass: {
            popup: "rounded-xl",
          },
        });

      if (!confirmation.isConfirmed) {
        return;
      }

      try {
        await apiClient.delete(
          `/account/requestfaculty/delete/${id}`
        );

        setRequests(
          (previous) =>
            previous.filter(
              (request) =>
                request._id !== id
            )
        );

        toast.success(
          `Rejected registration for ${name}`
        );
      } catch (error) {
        console.error(
          "REJECT FACULTY ERROR:",
          error
        );

        toast.error(
          getApiErrorMessage(
            error,
            "Failed to reject faculty request."
          )
        );
      }
    };

  // =======================================================
  // OPEN FACULTY EDIT
  // =======================================================

  const openEditFaculty =
    (faculty: FacultyMember) => {
      setSelectedFaculty(
        faculty
      );

      setEditingFacultyId(
        faculty._id
      );

      setFacultyForm({
        namePrefix:
          faculty.namePrefix || "",

        firstName:
          faculty.firstName || "",

        middleName:
          faculty.middleName || "",

        lastName:
          faculty.lastName || "",

        phoneNumber:
          faculty.phoneNumber ||
          faculty.contactInfo?.phone ||
          "",

        sex:
          faculty.sex || "",

        highestDegree:
          faculty.highestDegree || "",

        expertFields:
          Array.isArray(
            faculty.expertFields
          )
            ? faculty.expertFields.join(
                ", "
              )
            : "",

        bios:
          faculty.bios || "",

        roles:
          Array.isArray(
            faculty.roles
          )
            ? faculty.roles.join(", ")
            : faculty.roles || "",

        hod:
          Boolean(faculty.hod),
      });

      setShowFacultyModal(
        true
      );
    };

  // =======================================================
  // CLOSE FACULTY MODAL
  // =======================================================

  const closeFacultyModal =
    () => {
      if (savingFaculty) {
        return;
      }

      setShowFacultyModal(
        false
      );

      setSelectedFaculty(
        null
      );

      setEditingFacultyId(
        null
      );
    };

  // =======================================================
  // FACULTY INPUT
  // =======================================================

  const handleFacultyChange =
    (
      field: keyof FacultyForm,
      value:
        | string
        | boolean
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
      if (!editingFacultyId) {
        return;
      }

      if (
        !facultyForm.firstName.trim() &&
        !facultyForm.lastName.trim()
      ) {
        toast.error(
          "Please enter the faculty name."
        );

        return;
      }

      try {
        setSavingFaculty(true);

        const payload = {
          namePrefix:
            facultyForm.namePrefix.trim(),

          firstName:
            facultyForm.firstName.trim(),

          middleName:
            facultyForm.middleName.trim(),

          lastName:
            facultyForm.lastName.trim(),

          phoneNumber:
            facultyForm.phoneNumber.trim(),

          sex:
            facultyForm.sex || undefined,

          highestDegree:
            facultyForm.highestDegree.trim(),

          expertFields:
            facultyForm.expertFields
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean),

          bios:
            facultyForm.bios.trim(),

          roles:
            facultyForm.roles
              .split(",")
              .map(
                (item) =>
                  item.trim()
              )
              .filter(Boolean),

          hod:
            facultyForm.hod,
        };

        const response =
          await apiClient.put(
            `/faculty-update/${editingFacultyId}`,
            payload
          );

        const updatedFaculty =
          response.data?.data;

        if (updatedFaculty) {
          setFacultyList(
            (previous) =>
              previous.map(
                (faculty) =>
                  faculty._id ===
                  editingFacultyId
                    ? {
                        ...faculty,
                        ...updatedFaculty,
                      }
                    : faculty
              )
          );

          // Keep profile data synchronized
          setSelectedTeacher(
            (previous) => {
              if (
                !previous ||
                previous._id !==
                  editingFacultyId
              ) {
                return previous;
              }

              return {
                ...previous,
                ...updatedFaculty,
              };
            }
          );
        }

        toast.success(
          "Faculty profile updated successfully."
        );

        closeFacultyModal();
      } catch (error) {
        console.error(
          "FACULTY UPDATE ERROR:",
          error
        );

        toast.error(
          getApiErrorMessage(
            error,
            "Unable to update faculty."
          )
        );
      } finally {
        setSavingFaculty(false);
      }
    };

  // =======================================================
  // DELETE FACULTY
  // =======================================================

  const handleDeleteFaculty =
    async (
      faculty: FacultyMember
    ) => {
      const name =
        getFacultyName(
          faculty
        );

      const confirmation =
        await Swal.fire({
          title: "Delete faculty?",
          html: `
            <div style="font-size:14px">
              You are about to permanently delete
              <strong>${name}</strong>.
              <br/><br/>
              This action cannot be undone.
            </div>
          `,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText:
            "Delete Faculty",
          cancelButtonText:
            "Cancel",
          confirmButtonColor:
            "#ef4444",
          cancelButtonColor:
            "#22c55e",
          customClass: {
            popup: "rounded-xl",
          },
        });

      if (!confirmation.isConfirmed) {
        return;
      }

      try {
        await apiClient.delete(
          `/faculty-update/${faculty.accountId}`
        );

        setFacultyList(
          (previous) =>
            previous.filter(
              (item) =>
                item._id !==
                faculty._id
            )
        );

        // If deleted teacher is currently
        // being viewed, close profile.
        setSelectedTeacher(
          (previous) =>
            previous?._id ===
            faculty._id
              ? null
              : previous
        );

        toast.success(
          `${name} was deleted successfully.`
        );
      } catch (error) {
        console.error(
          "DELETE FACULTY ERROR:",
          error
        );

        toast.error(
          getApiErrorMessage(
            error,
            "Unable to delete faculty."
          )
        );
      }
    };

  // =======================================================
  // OPEN ADD PAPER
  // =======================================================

  const openAddPaper =
    (
      faculty: FacultyMember
    ) => {
      setSelectedFaculty(
        faculty
      );

      setEditingPaperId(
        null
      );

      setPaperForm({
        title: "",
        paperUrl: "",
      });

      setShowPaperModal(
        true
      );
    };

  // =======================================================
  // OPEN EDIT PAPER
  // =======================================================

  const openEditPaper =
    (
      faculty: FacultyMember,
      paper: Paper
    ) => {
      setSelectedFaculty(
        faculty
      );

      setEditingPaperId(
        paper._id
      );

      setPaperForm({
        title:
          paper.title || "",

        paperUrl:
          paper.paperUrl || "",
      });

      setShowPaperModal(
        true
      );
    };

  // =======================================================
  // OPEN ALL PAPERS
  // =======================================================

  const openAllPapers =
    (
      faculty: FacultyMember
    ) => {
      setSelectedFaculty(
        faculty
      );

      setShowAllPapersModal(
        true
      );
    };

  // =======================================================
  // CLOSE ALL PAPERS
  // =======================================================

  const closeAllPapers =
    () => {
      setShowAllPapersModal(
        false
      );

      setSelectedFaculty(
        null
      );
    };

  // =======================================================
  // CLOSE PAPER MODAL
  // =======================================================

  const closePaperModal =
    () => {
      if (savingPaper) {
        return;
      }

      setShowPaperModal(
        false
      );

      setSelectedFaculty(
        null
      );

      setEditingPaperId(
        null
      );

      setPaperForm({
        title: "",
        paperUrl: "",
      });
    };

  // =======================================================
  // PAPER INPUT
  // =======================================================

  const handlePaperChange =
    (
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
      if (!selectedFaculty) {
        return;
      }

      if (
        !paperForm.title.trim()
      ) {
        toast.error(
          "Paper title is required."
        );

        return;
      }

      try {
        setSavingPaper(true);

        const facultyId =
          selectedFaculty._id;

        const payload = {
          title:
            paperForm.title.trim(),

          paperUrl:
            paperForm.paperUrl.trim() ||
            undefined,
        };

        // =================================================
        // EDIT PAPER
        // =================================================

        if (editingPaperId) {
          const response =
            await apiClient.put(
              `/paper/${facultyId}/${editingPaperId}`,
              payload
            );

          const updatedPaper =
            response.data?.data;

          if (updatedPaper) {
            setFacultyList(
              (previous) =>
                previous.map(
                  (faculty) => {
                    if (
                      faculty._id !==
                      facultyId
                    ) {
                      return faculty;
                    }

                    return {
                      ...faculty,
                      papers:
                        faculty.papers?.map(
                          (paper) =>
                            paper._id ===
                            editingPaperId
                              ? updatedPaper
                              : paper
                        ) || [],
                    };
                  }
                )
            );

            setSelectedFaculty(
              (previous) => {
                if (
                  !previous ||
                  previous._id !==
                    facultyId
                ) {
                  return previous;
                }

                return {
                  ...previous,
                  papers:
                    previous.papers?.map(
                      (paper) =>
                        paper._id ===
                        editingPaperId
                          ? updatedPaper
                          : paper
                    ) || [],
                };
              }
            );

            // Also update the teacher profile
            setSelectedTeacher(
              (previous) => {
                if (
                  !previous ||
                  previous._id !==
                    facultyId
                ) {
                  return previous;
                }

                return {
                  ...previous,
                  papers:
                    previous.papers?.map(
                      (paper) =>
                        paper._id ===
                        editingPaperId
                          ? updatedPaper
                          : paper
                    ) || [],
                };
              }
            );
          }

          toast.success(
            "Paper updated successfully."
          );
        }

        // =================================================
        // ADD PAPER
        // =================================================

        else {
          const response =
            await apiClient.post(
              `/paper/${facultyId}`,
              payload
            );

          const newPaper =
            response.data?.data;

          if (newPaper) {
            setFacultyList(
              (previous) =>
                previous.map(
                  (faculty) => {
                    if (
                      faculty._id !==
                      facultyId
                    ) {
                      return faculty;
                    }

                    return {
                      ...faculty,
                      papers: [
                        newPaper,
                        ...(faculty.papers ||
                          []),
                      ],
                    };
                  }
                )
            );

            setSelectedFaculty(
              (previous) => {
                if (
                  !previous ||
                  previous._id !==
                    facultyId
                ) {
                  return previous;
                }

                return {
                  ...previous,
                  papers: [
                    newPaper,
                    ...(previous.papers ||
                      []),
                  ],
                };
              }
            );

            setSelectedTeacher(
              (previous) => {
                if (
                  !previous ||
                  previous._id !==
                    facultyId
                ) {
                  return previous;
                }

                return {
                  ...previous,
                  papers: [
                    newPaper,
                    ...(previous.papers ||
                      []),
                  ],
                };
              }
            );
          }

          toast.success(
            "Paper added successfully."
          );
        }

        setShowPaperModal(
          false
        );

        setEditingPaperId(
          null
        );

        setPaperForm({
          title: "",
          paperUrl: "",
        });
      } catch (error) {
        console.error(
          "PAPER SAVE ERROR:",
          error
        );

        toast.error(
          getApiErrorMessage(
            error,
            "Unable to save paper."
          )
        );
      } finally {
        setSavingPaper(false);
      }
    };

  // =======================================================
  // DELETE PAPER
  // =======================================================

  const handleDeletePaper =
    async (
      faculty: FacultyMember,
      paper: Paper
    ) => {
      const confirmation =
        await Swal.fire({
          title: "Delete paper?",
          text: `Delete "${paper.title}" permanently?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText:
            "Delete",
          cancelButtonText:
            "Stay here",
          confirmButtonColor:
            "#ef4444",
          cancelButtonColor:
            "#22c55e",
          customClass: {
            popup: "rounded-xl",
          },
        });

      if (!confirmation.isConfirmed) {
        return;
      }

      try {
        await apiClient.delete(
          `/paper/${faculty._id}/${paper._id}`
        );

        setFacultyList(
          (previous) =>
            previous.map(
              (item) => {
                if (
                  item._id !==
                  faculty._id
                ) {
                  return item;
                }

                return {
                  ...item,
                  papers:
                    item.papers?.filter(
                      (currentPaper) =>
                        currentPaper._id !==
                        paper._id
                    ) || [],
                };
              }
            )
        );

        setSelectedFaculty(
          (previous) => {
            if (
              !previous ||
              previous._id !==
                faculty._id
            ) {
              return previous;
            }

            return {
              ...previous,
              papers:
                previous.papers?.filter(
                  (currentPaper) =>
                    currentPaper._id !==
                    paper._id
                ) || [],
            };
          }
        );

        setSelectedTeacher(
          (previous) => {
            if (
              !previous ||
              previous._id !==
                faculty._id
            ) {
              return previous;
            }

            return {
              ...previous,
              papers:
                previous.papers?.filter(
                  (currentPaper) =>
                    currentPaper._id !==
                    paper._id
                ) || [],
            };
          }
        );

        toast.success(
          "Paper deleted successfully."
        );
      } catch (error) {
        console.error(
          "PAPER DELETE ERROR:",
          error
        );

        toast.error(
          getApiErrorMessage(
            error,
            "Unable to delete paper."
          )
        );
      }
    };

  // =======================================================
  // EXTERNAL LINK
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

  const openPaperLink =
    (
      href: string
    ) => {
      if (!href) {
        return;
      }

      if (!isExternalLink(href)) {
        window.open(
          href,
          "_blank",
          "noopener,noreferrer"
        );

        return;
      }

      Swal.fire({
        title: "Leave this site?",
        text:
          "You are being redirected to an external website.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText:
          "Continue",
        cancelButtonText:
          "Stay here",
        confirmButtonColor:
          "#22c55e",
        cancelButtonColor:
          "#ef4444",
        customClass: {
          popup: "rounded-xl",
        },
      }).then(
        (result) => {
          if (
            result.isConfirmed
          ) {
            window.open(
              href,
              "_blank",
              "noopener,noreferrer"
            );
          }
        }
      );
    };

  // =======================================================
  // AUTH CHECK
  // =======================================================

  if (
    !token ||
    role !== "admin"
  ) {
    return (
      <div className="p-4">
        <SignIn_SignUP
          role="admin"
        />
      </div>
    );
  }

  // =======================================================
  // IMPORTANT:
  // SHOW EXISTING TEACHER PROFILE
  // =======================================================

  if (selectedTeacher) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Back button */}

        <div
          className="
            sticky
            top-0
            z-40
            bg-white
            border-b
            border-gray-200
            px-4
            sm:px-6
            py-3
            shadow-sm
          "
        >
          <button
            type="button"
            onClick={
              closeTeacherProfile
            }
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              text-gray-700
              font-bold
              text-sm
              transition-colors
            "
          >
            <FaArrowLeft />

            Back to Faculty
          </button>
        </div>

        {/* 
          =====================================================
          EXISTING PROFILE COMPONENT

          The teacher object is passed directly.

          This is the important part that prevents the
          white blank route page.
          =====================================================
        */}

        <Teacher_Profile_View
          teachers={[
            selectedTeacher,
          ]}
        />
      </div>
    );
  }

  // =======================================================
  // RENDER FACULTY ADMIN PAGE
  // =======================================================

  return (
    <div
      className="
        p-4
        sm:p-6
        max-w-7xl
        mx-auto
        space-y-8
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <div
        className="
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-4
          border-b
          pb-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-4
          "
        >
          <h1
            className="
              text-2xl
              sm:text-3xl
              font-extrabold
              text-gray-900
            "
          >
            Faculty Members
          </h1>

          <button
            type="button"
            className="
              relative
              p-2
              bg-blue-50
              hover:bg-blue-100
              rounded-xl
              transition-colors
            "
            onClick={() =>
              setShowRequestModal(
                true
              )
            }
            aria-label="View Faculty Requests"
          >
            <BellIcon
              className="
                w-7
                h-7
                text-blue-600
              "
            />

            {requests.length > 0 && (
              <span
                className="
                  absolute
                  -top-1
                  -right-1
                  bg-red-600
                  text-white
                  text-xs
                  rounded-full
                  px-2
                  py-0.5
                  font-bold
                  animate-pulse
                "
              >
                {requests.length}
              </span>
            )}
          </button>
        </div>

        <span
          className="
            text-sm
            font-semibold
            text-gray-500
            bg-gray-100
            px-3
            py-1
            rounded-full
          "
        >
          Total Faculty:{" "}
          {facultyList.length}
        </span>
      </div>

      {/* ===================================================
          REQUEST MODAL
      =================================================== */}

      {showRequestModal && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            backdrop-blur-md
            bg-black/40
            p-4
          "
          onClick={() =>
            setShowRequestModal(
              false
            )
          }
        >
          <div
            className="
              bg-white
              rounded-2xl
              shadow-2xl
              p-6
              w-full
              max-w-2xl
              max-h-[80vh]
              flex
              flex-col
              relative
              border
              border-blue-200
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              type="button"
              className="
                absolute
                top-4
                right-4
                text-gray-400
                hover:text-gray-600
                text-2xl
                font-bold
              "
              onClick={() =>
                setShowRequestModal(
                  false
                )
              }
            >
              &times;
            </button>

            <h2
              className="
                text-xl
                font-bold
                mb-4
                text-gray-900
                border-b
                pb-2
              "
            >
              Pending Faculty Account Registration Requests
              {" "}
              ({requests.length})
            </h2>

            {requests.length === 0 ? (
              <div
                className="
                  text-gray-500
                  text-center
                  py-12
                  flex-1
                  flex
                  items-center
                  justify-center
                  font-medium
                "
              >
                No pending registration requests.
              </div>
            ) : (
              <div
                className="
                  space-y-3
                  overflow-y-auto
                  flex-1
                  pr-1
                "
              >
                {requests.map(
                  (request) => (
                    <div
                      key={
                        request._id
                      }
                      className="
                        flex
                        flex-col
                        sm:flex-row
                        sm:items-center
                        justify-between
                        bg-blue-50
                        border
                        border-blue-200
                        rounded-xl
                        p-4
                        gap-3
                      "
                    >
                      <div>
                        <p
                          className="
                            font-bold
                            text-gray-900
                            text-sm
                          "
                        >
                          {request.firstName
                            ? `${request.firstName} ${request.lastName || ""}`
                            : request.username}
                        </p>

                        <p
                          className="
                            text-xs
                            text-gray-500
                            font-mono
                          "
                        >
                          {request.email}
                        </p>
                      </div>

                      <div
                        className="
                          flex
                          gap-2
                        "
                      >
                        <button
                          type="button"
                          className="
                            px-3
                            py-1.5
                            bg-green-600
                            hover:bg-green-700
                            text-white
                            rounded-lg
                            text-xs
                            font-bold
                          "
                          onClick={() =>
                            handleAcceptRequest(
                              request._id,
                              request.firstName ||
                                request.username
                            )
                          }
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          className="
                            px-3
                            py-1.5
                            bg-red-600
                            hover:bg-red-700
                            text-white
                            rounded-lg
                            text-xs
                            font-bold
                          "
                          onClick={() =>
                            handleRejectRequest(
                              request._id,
                              request.firstName ||
                                request.username
                            )
                          }
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================
          FACULTY LIST
      =================================================== */}

      {loading ? (
        <div
          className="
            text-center
            py-20
            text-gray-500
            font-semibold
          "
        >
          Loading faculty database...
        </div>
      ) : facultyList.length === 0 ? (
        <div
          className="
            text-center
            py-16
            text-gray-500
            font-medium
            bg-white
            rounded-2xl
            border
            border-gray-200
          "
        >
          No faculty profiles created in database yet.
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >
          {facultyList.map(
            (teacher) => {
              const fullName =
                getFacultyName(
                  teacher
                );

              const photoSrc =
                teacher.photoId
                  ? `${API_BASE_URL}/uploads/faculty/${teacher.photoId}`
                  : teacher.photo ||
                    "/Images/Faculty/placeholder.jpg";

              const papers =
                teacher.papers || [];

              return (
                <div
                  key={
                    teacher._id
                  }
                  className="
                    relative
                    flex
                    flex-col
                    bg-white
                    rounded-2xl
                    shadow-sm
                    hover:shadow-md
                    transition-shadow
                    p-5
                    border
                    border-gray-200
                  "
                >
                  {/* ==========================================
                      CLICKABLE TEACHER PROFILE AREA
                  ========================================== */}

                  <button
                    type="button"
                    onClick={() =>
                      openTeacherProfile(
                        teacher
                      )
                    }
                    className="
                      w-full
                      text-left
                      flex
                      items-start
                      gap-4
                      cursor-pointer
                      group
                    "
                  >
                    <img
                      src={
                        photoSrc
                      }
                      alt={
                        fullName
                      }
                      className="
                        w-20
                        h-24
                        object-cover
                        rounded-xl
                        border
                        border-gray-200
                        bg-gray-100
                        flex-shrink-0
                        group-hover:ring-2
                        group-hover:ring-cyan-300
                        transition-all
                      "
                    />

                    <div
                      className="
                        flex-1
                        text-xs
                        space-y-1
                        min-w-0
                      "
                    >
                      <h3
                        className="
                          font-bold
                          text-sm
                          text-gray-900
                          group-hover:text-cyan-700
                          transition-colors
                        "
                      >
                        {fullName}
                      </h3>

                      <p
                        className="
                          text-cyan-800
                          font-semibold
                        "
                      >
                        {getFacultyRole(
                          teacher
                        )}
                      </p>

                      <p
                        className="
                          text-gray-500
                          font-mono
                          truncate
                        "
                      >
                        {getFacultyEmail(
                          teacher
                        )}
                      </p>

                      {teacher.highestDegree && (
                        <p
                          className="
                            text-gray-700
                            font-medium
                          "
                        >
                          {
                            teacher.highestDegree
                          }
                        </p>
                      )}
                    </div>
                  </button>

                  {/* ==========================================
                      FACULTY ACTIONS
                  ========================================== */}

                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      mt-5
                      pt-4
                      border-t
                      border-gray-100
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        min-w-0
                      "
                    >
                      <span
                        className="
                          text-[10px]
                          sm:text-xs
                          font-semibold
                          text-gray-500
                          whitespace-nowrap
                        "
                      >
                        Security Code:
                      </span>

                      <span
                        className="
                          px-2.5
                          py-1.5
                          rounded-lg
                          bg-gray-100
                          border
                          border-gray-200
                          text-gray-800
                          font-mono
                          text-xs
                          sm:text-sm
                          font-bold
                          tracking-widest
                          whitespace-nowrap
                        "
                      >
                        {teacher.securityCode ||
                          "------"}
                      </span>
                    </div>

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        flex-shrink-0
                      "
                    >
                      <button
                        type="button"
                        onClick={() =>
                          openEditFaculty(
                            teacher
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
                        title="Edit faculty"
                      >
                        <FaEdit />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          openAddPaper(
                            teacher
                          )
                        }
                        className="
                          w-9
                          h-9
                          rounded-lg
                          bg-cyan-50
                          text-cyan-700
                          hover:bg-cyan-100
                          flex
                          items-center
                          justify-center
                        "
                        title="Add paper"
                      >
                        <FaPlus />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteFaculty(
                            teacher
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
                        title="Delete faculty"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* ==========================================
                      PAPERS PREVIEW
                  ========================================== */}

                  <div
                    className="
                      mt-5
                      pt-4
                      border-t
                      border-gray-100
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        mb-3
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <FaBookOpen
                          className="
                            text-cyan-700
                          "
                        />

                        <h4
                          className="
                            text-sm
                            font-bold
                            text-gray-900
                          "
                        >
                          Papers
                        </h4>

                        <span
                          className="
                            min-w-[24px]
                            h-6
                            px-1.5
                            rounded-full
                            bg-cyan-100
                            text-cyan-700
                            text-xs
                            font-bold
                            flex
                            items-center
                            justify-center
                          "
                        >
                          {papers.length}
                        </span>
                      </div>

                      {papers.length > 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            openAllPapers(
                              teacher
                            )
                          }
                          className="
                            text-xs
                            font-bold
                            text-cyan-700
                            hover:text-cyan-900
                            hover:underline
                          "
                        >
                          View all
                        </button>
                      )}
                    </div>

                    {papers.length === 0 ? (
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          gap-3
                          bg-gray-50
                          border
                          border-gray-100
                          rounded-xl
                          px-3
                          py-3
                        "
                      >
                        <p
                          className="
                            text-xs
                            text-gray-400
                            italic
                          "
                        >
                          No papers added.
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            openAddPaper(
                              teacher
                            )
                          }
                          className="
                            text-xs
                            font-bold
                            text-cyan-700
                            hover:text-cyan-900
                            whitespace-nowrap
                          "
                        >
                          + Add Paper
                        </button>
                      </div>
                    ) : (
                      <>
                        <div
                          className="
                            space-y-2
                          "
                        >
                          {papers
                            .slice(0, 1)
                            .map(
                              (paper) => (
                                <div
                                  key={
                                    paper._id
                                  }
                                  className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-2
                                    bg-gray-50
                                    border
                                    border-gray-100
                                    rounded-lg
                                    p-2.5
                                  "
                                >
                                  <div
                                    className="
                                      min-w-0
                                      flex-1
                                    "
                                  >
                                    <p
                                      className="
                                        text-xs
                                        font-bold
                                        text-gray-800
                                        truncate
                                      "
                                      title={
                                        paper.title
                                      }
                                    >
                                      {
                                        paper.title
                                      }
                                    </p>

                                    {paper.paperUrl && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          openPaperLink(
                                            paper.paperUrl!
                                          )
                                        }
                                        className="
                                          inline-flex
                                          items-center
                                          gap-1
                                          text-[11px]
                                          text-cyan-700
                                          font-semibold
                                          mt-1
                                          hover:underline
                                        "
                                      >
                                        Open

                                        <FaExternalLinkAlt
                                          className="
                                            text-[9px]
                                          "
                                        />
                                      </button>
                                    )}
                                  </div>

                                  <div
                                    className="
                                      flex
                                      items-center
                                      gap-1
                                      flex-shrink-0
                                    "
                                  >
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openEditPaper(
                                          teacher,
                                          paper
                                        )
                                      }
                                      className="
                                        w-7
                                        h-7
                                        rounded-md
                                        bg-blue-50
                                        text-blue-600
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-blue-100
                                      "
                                    >
                                      <FaEdit
                                        className="
                                          text-xs
                                        "
                                      />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeletePaper(
                                          teacher,
                                          paper
                                        )
                                      }
                                      className="
                                        w-7
                                        h-7
                                        rounded-md
                                        bg-red-50
                                        text-red-600
                                        flex
                                        items-center
                                        justify-center
                                        hover:bg-red-100
                                      "
                                    >
                                      <FaTrash
                                        className="
                                          text-xs
                                        "
                                      />
                                    </button>
                                  </div>
                                </div>
                              )
                            )}
                        </div>

                        {papers.length > 2 && (
                          <button
                            type="button"
                            onClick={() =>
                              openAllPapers(
                                teacher
                              )
                            }
                            className="
                              w-full
                              mt-2
                              py-2
                              rounded-lg
                              bg-cyan-50
                              hover:bg-cyan-100
                              text-cyan-700
                              text-xs
                              font-bold
                            "
                          >
                            +{" "}
                            {papers.length - 1}{" "}
                            more paper
                            {papers.length - 1 !==
                            1
                              ? "s"
                              : ""}{" "}
                            — View All
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* ===================================================
          FACULTY EDIT MODAL
      =================================================== */}

      {showFacultyModal && (
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
              bg-white
              w-full
              max-w-2xl
              max-h-[90vh]
              overflow-y-auto
              rounded-2xl
              shadow-2xl
            "
          >
            <div
              className="
                sticky
                top-0
                bg-white
                z-10
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
                    text-xl
                    font-extrabold
                    text-gray-900
                  "
                >
                  Edit Faculty
                </h2>

                <p
                  className="
                    text-xs
                    text-gray-400
                    mt-1
                  "
                >
                  Update faculty information.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeFacultyModal
                }
                disabled={
                  savingFaculty
                }
                className="
                  w-9
                  h-9
                  rounded-lg
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-200
                "
              >
                <FaTimes />
              </button>
            </div>

            <div
              className="
                p-6
                space-y-5
              "
            >
              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-2
                  gap-4
                "
              >
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Prefix
                  </label>

                  <input
                    value={
                      facultyForm.namePrefix
                    }
                    onChange={(e) =>
                      handleFacultyChange(
                        "namePrefix",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    First Name
                  </label>

                  <input
                    value={
                      facultyForm.firstName
                    }
                    onChange={(e) =>
                      handleFacultyChange(
                        "firstName",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Middle Name
                  </label>

                  <input
                    value={
                      facultyForm.middleName
                    }
                    onChange={(e) =>
                      handleFacultyChange(
                        "middleName",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Last Name
                  </label>

                  <input
                    value={
                      facultyForm.lastName
                    }
                    onChange={(e) =>
                      handleFacultyChange(
                        "lastName",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Phone
                  </label>

                  <input
                    value={
                      facultyForm.phoneNumber
                    }
                    onChange={(e) =>
                      handleFacultyChange(
                        "phoneNumber",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Highest Degree
                  </label>

                  <input
                    value={
                      facultyForm.highestDegree
                    }
                    onChange={(e) =>
                      handleFacultyChange(
                        "highestDegree",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Gender
                  </label>

                  <select
                    value={
                      facultyForm.sex
                    }
                    onChange={(e) =>
                      handleFacultyChange(
                        "sex",
                        e.target.value
                      )
                    }
                    className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Roles
                  </label>

                  <input
                    value={
                      facultyForm.roles
                    }
                    onChange={(e) =>
                      handleFacultyChange(
                        "roles",
                        e.target.value
                      )
                    }
                    placeholder="professor, dean"
                    className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Areas of Expertise
                </label>

                <input
                  value={
                    facultyForm.expertFields
                  }
                  onChange={(e) =>
                    handleFacultyChange(
                      "expertFields",
                      e.target.value
                    )
                  }
                  placeholder="AI, Machine Learning, Computer Vision"
                  className="w-full border rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <label className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <input
                  type="checkbox"
                  checked={
                    facultyForm.hod
                  }
                  onChange={(e) =>
                    handleFacultyChange(
                      "hod",
                      e.target.checked
                    )
                  }
                  className="w-4 h-4"
                />

                Head of Department
              </label>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Biography
                </label>

                <textarea
                  value={
                    facultyForm.bios
                  }
                  onChange={(e) =>
                    handleFacultyChange(
                      "bios",
                      e.target.value
                    )
                  }
                  rows={5}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm resize-y outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={
                    closeFacultyModal
                  }
                  disabled={
                    savingFaculty
                  }
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
                >
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
                  className="flex-1 py-3 rounded-xl bg-cyan-700 text-white font-bold flex items-center justify-center gap-2 hover:bg-cyan-800"
                >
                  <FaSave />

                  {savingFaculty
                    ? "Saving..."
                    : "Save Faculty"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          PAPER MODAL
      =================================================== */}

      {showPaperModal && (
        <div className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">
                  {editingPaperId
                    ? "Edit Paper"
                    : "Add Paper"}
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  {selectedFaculty
                    ? getFacultyName(
                        selectedFaculty
                      )
                    : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closePaperModal
                }
                disabled={
                  savingPaper
                }
                className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
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
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Paper URL
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
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={
                    closePaperModal
                  }
                  disabled={
                    savingPaper
                  }
                  className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200"
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
                  className="flex-1 py-3 rounded-xl bg-cyan-700 text-white font-bold flex items-center justify-center gap-2 hover:bg-cyan-800"
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

      {/* ===================================================
          ALL PAPERS MODAL
      =================================================== */}

      {showAllPapersModal &&
        selectedFaculty && (
          <div
            className="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={
              closeAllPapers
            }
          >
            <div
              className="bg-white w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              onClick={(e) =>
                e.stopPropagation()
              }
            >
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FaBookOpen className="text-cyan-700" />

                    <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                      Research Papers
                    </h2>

                    <span className="px-2.5 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-bold">
                      {
                        selectedFaculty
                          .papers
                          ?.length || 0
                      }
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {getFacultyName(
                      selectedFaculty
                    )}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    closeAllPapers
                  }
                  className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 flex-shrink-0 ml-3"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {(!selectedFaculty.papers ||
                  selectedFaculty.papers
                    .length === 0) && (
                  <div className="text-center py-12 text-gray-400 text-sm">
                    No papers added.
                  </div>
                )}

                {selectedFaculty.papers?.map(
                  (
                    paper,
                    index
                  ) => (
                    <div
                      key={
                        paper._id
                      }
                      className="group flex items-start gap-3 bg-gray-50 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-200 rounded-xl p-3 sm:p-4 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-extrabold flex-shrink-0">
                        {index + 1}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900 break-words">
                          {
                            paper.title
                          }
                        </p>

                        {paper.createdAt && (
                          <p className="text-[10px] text-gray-400 mt-1">
                            Added{" "}
                            {new Date(
                              paper.createdAt
                            ).toLocaleDateString()}
                          </p>
                        )}

                        {paper.paperUrl ? (
                          <button
                            type="button"
                            onClick={() =>
                              openPaperLink(
                                paper.paperUrl!
                              )
                            }
                            className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-cyan-700 hover:text-cyan-900 hover:underline"
                          >
                            Open Paper

                            <FaExternalLinkAlt className="text-[9px]" />
                          </button>
                        ) : (
                          <p className="text-[10px] text-gray-400 italic mt-2">
                            No paper link available
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            openEditPaper(
                              selectedFaculty,
                              paper
                            )
                          }
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100"
                        >
                          <FaEdit className="text-xs" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDeletePaper(
                              selectedFaculty,
                              paper
                            )
                          }
                          className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              <div className="px-5 sm:px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 flex-shrink-0">
                <p className="text-xs text-gray-500">
                  {
                    selectedFaculty
                      .papers
                      ?.length || 0
                  }{" "}
                  paper
                  {(selectedFaculty.papers
                    ?.length || 0) !==
                  1
                    ? "s"
                    : ""}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    openAddPaper(
                      selectedFaculty
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold"
                >
                  <FaPlus />
                  Add Paper
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}