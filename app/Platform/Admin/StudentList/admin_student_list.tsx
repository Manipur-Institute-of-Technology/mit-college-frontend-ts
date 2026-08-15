import {
  useState,
  useEffect,
  useMemo,
} from "react";

import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import apiClient from "~/utils/apiClient";

import Swal from "sweetalert2";

import {
  GraduationCap,
  Plus,
  Trash2,
  RefreshCw,
  Upload,
  FileSpreadsheet,
  Search,
  Users,
  X,
  Replace,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Calendar,
  BookOpen,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type StudentRecord = {
  [key: string]: any;
};

export type StudentListData = {
  _id: string;
  course: string;
  branch: string;
  year: string;
  filepath?: string;
  data: StudentRecord[];
  createdAt?: string;
  updatedAt?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COURSES = [
  "M.Tech",
  "B.E./B.Tech",
];

const BRANCHES = [
  {
    code: "CE",
    name: "Civil Engineering",
  },
  {
    code: "ME",
    name: "Mechanical Engineering",
  },
  {
    code: "CSE",
    name: "Computer Science & Engineering",
  },
  {
    code: "EE",
    name: "Electrical Engineering",
  },
  {
    code: "ECE",
    name: "Electronics & Communication Engineering",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Admin_StudentList() {
  const { token, role } = useAuth();

  const [lists, setLists] =
    useState<StudentListData[]>([]);

  const [selectedListId, setSelectedListId] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  // ───────────────────────────────────────────────────────────────────────────
  // UPLOAD MODAL
  // ───────────────────────────────────────────────────────────────────────────

  const [showUploadModal, setShowUploadModal] =
    useState(false);

  const [uploadCourse, setUploadCourse] =
    useState("M.Tech");

  const [uploadBranch, setUploadBranch] =
    useState("CSE");

  const [uploadYear, setUploadYear] =
    useState("");

  const [uploadFile, setUploadFile] =
    useState<File | null>(null);

  const [uploading, setUploading] =
    useState(false);

  const [replaceId, setReplaceId] =
    useState<string | null>(null);

  // ───────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ───────────────────────────────────────────────────────────────────────────

  const [searchTerm, setSearchTerm] =
    useState("");

  // ───────────────────────────────────────────────────────────────────────────
  // PAGINATION
  // ───────────────────────────────────────────────────────────────────────────

  const [currentPage, setCurrentPage] =
    useState(1);

  const [rowsPerPage, setRowsPerPage] =
    useState(20);

  // ───────────────────────────────────────────────────────────────────────────
  // FETCH
  // ───────────────────────────────────────────────────────────────────────────

  const fetchStudentLists = async () => {
    setIsLoading(true);

    try {
      const res =
        await apiClient.get(
          "/studentlist"
        );

      const fetched =
        res.data?.data || [];

      setLists(fetched);

    } catch (error: any) {
      console.error(
        "Fetch student lists error:",
        error
      );

      Swal.fire({
        title: "Unable to load",
        text:
          error?.response?.data?.message ||
          "Failed to load student lists.",
        icon: "error",
        confirmButtonColor: "#be123c",
      });

      setLists([]);

    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (
      token &&
      role === "admin"
    ) {
      fetchStudentLists();
    }
  }, [token, role]);

  // ───────────────────────────────────────────────────────────────────────────
  // SELECTED LIST
  // ───────────────────────────────────────────────────────────────────────────

  const selectedList =
    lists.find(
      (list) =>
        list._id === selectedListId
    ) || null;

  const studentRows =
    selectedList?.data || [];

  // ───────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ───────────────────────────────────────────────────────────────────────────

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) {
      return studentRows;
    }

    const term =
      searchTerm
        .toLowerCase()
        .trim();

    return studentRows.filter(
      (row) =>
        Object.values(row).some(
          (value) =>
            String(value ?? "")
              .toLowerCase()
              .includes(term)
        )
    );
  }, [
    studentRows,
    searchTerm,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // HEADERS
  // ───────────────────────────────────────────────────────────────────────────

  const headers =
    studentRows.length > 0
      ? Object.keys(
          studentRows[0]
        ).filter(
          (key) =>
            key !== "_id"
        )
      : [];

  // ───────────────────────────────────────────────────────────────────────────
  // PAGINATION
  // ───────────────────────────────────────────────────────────────────────────

  const totalRows =
    filteredRows.length;

  const totalPages =
    totalRows > 0
      ? Math.ceil(
          totalRows /
            rowsPerPage
        )
      : 1;

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const startIndex =
    (safeCurrentPage - 1) *
    rowsPerPage;

  const endIndex =
    Math.min(
      startIndex +
        rowsPerPage,
      totalRows
    );

  const paginatedRows =
    filteredRows.slice(
      startIndex,
      endIndex
    );

  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedListId,
    rowsPerPage,
  ]);

  // ───────────────────────────────────────────────────────────────────────────
  // PAGE NUMBERS
  // ───────────────────────────────────────────────────────────────────────────

  const getPageNumbers = () => {
    const pages: (
      | number
      | string
    )[] = [];

    if (totalPages <= 7) {
      for (
        let i = 1;
        i <= totalPages;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }

    pages.push(1);

    if (
      safeCurrentPage > 3
    ) {
      pages.push("...");
    }

    const start = Math.max(
      2,
      safeCurrentPage - 1
    );

    const end = Math.min(
      totalPages - 1,
      safeCurrentPage + 1
    );

    for (
      let i = start;
      i <= end;
      i++
    ) {
      pages.push(i);
    }

    if (
      safeCurrentPage <
      totalPages - 2
    ) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  // ───────────────────────────────────────────────────────────────────────────
  // OPEN UPLOAD
  // ───────────────────────────────────────────────────────────────────────────

  const openUploadModal = () => {
    setReplaceId(null);

    setUploadCourse(
      "M.Tech"
    );

    setUploadBranch(
      "CSE"
    );

    setUploadYear("");

    setUploadFile(null);

    setShowUploadModal(
      true
    );
  };

  // ───────────────────────────────────────────────────────────────────────────
  // OPEN REPLACE
  // ───────────────────────────────────────────────────────────────────────────

  const openReplaceModal = (
    item: StudentListData
  ) => {
    setReplaceId(
      item._id
    );

    setUploadCourse(
      item.course
    );

    setUploadBranch(
      item.branch
    );

    setUploadYear(
      item.year
    );

    setUploadFile(null);

    setShowUploadModal(
      true
    );
  };

  // ───────────────────────────────────────────────────────────────────────────
  // CLOSE MODAL
  // ───────────────────────────────────────────────────────────────────────────

  const closeUploadModal = () => {
    if (uploading) return;

    setShowUploadModal(
      false
    );

    setUploadCourse(
      "M.Tech"
    );

    setUploadBranch(
      "CSE"
    );

    setUploadYear("");

    setUploadFile(null);

    setReplaceId(null);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // UPLOAD / REPLACE
  // ───────────────────────────────────────────────────────────────────────────

  const handleUploadSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!uploadCourse) {
      Swal.fire({
        title: "Course Required",
        text: "Please select a course.",
        icon: "warning",
        confirmButtonColor: "#be123c",
      });

      return;
    }

    if (!uploadBranch) {
      Swal.fire({
        title: "Branch Required",
        text: "Please select a branch.",
        icon: "warning",
        confirmButtonColor: "#be123c",
      });

      return;
    }

    if (!uploadYear.trim()) {
      Swal.fire({
        title: "Year Required",
        text: "Please enter the academic year.",
        icon: "warning",
        confirmButtonColor: "#be123c",
      });

      return;
    }

    if (!uploadFile) {
      Swal.fire({
        title: "File Required",
        text: "Please select a CSV or Excel file.",
        icon: "warning",
        confirmButtonColor: "#be123c",
      });

      return;
    }

    const extension =
      uploadFile.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      ![
        "csv",
        "xlsx",
        "xls",
      ].includes(
        extension || ""
      )
    ) {
      Swal.fire({
        title: "Invalid File",
        text: "Only CSV, XLS and XLSX files are allowed.",
        icon: "error",
        confirmButtonColor: "#be123c",
      });

      return;
    }

    setUploading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "course",
        uploadCourse
      );

      formData.append(
        "branch",
        uploadBranch
      );

      formData.append(
        "year",
        uploadYear.trim()
      );

      formData.append(
        "file",
        uploadFile
      );

      if (replaceId) {
        await apiClient.put(
          `/studentlist/edit/${replaceId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        await Swal.fire({
          title: "Replaced!",
          text: `${uploadCourse} ${uploadYear} ${uploadBranch} has been replaced successfully.`,
          icon: "success",
          confirmButtonColor: "#be123c",
        });

      } else {
        await apiClient.post(
          "/studentlist/add",
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        await Swal.fire({
          title: "Uploaded!",
          text: `${uploadCourse} ${uploadYear} ${uploadBranch} uploaded successfully.`,
          icon: "success",
          confirmButtonColor: "#be123c",
        });
      }

      closeUploadModal();

      await fetchStudentLists();

    } catch (error: any) {
      console.error(
        "Student list upload error:",
        error
      );

      const status =
        error?.response?.status;

      const message =
        error?.response?.data
          ?.message;

      if (status === 409) {
        Swal.fire({
          title: "Already Exists",
          text:
            message ||
            "A student list with the same course, branch and year already exists.",
          icon: "warning",
          confirmButtonColor:
            "#be123c",
        });
      } else {
        Swal.fire({
          title: "Upload Failed",
          text:
            message ||
            "Failed to upload student list.",
          icon: "error",
          confirmButtonColor:
            "#be123c",
        });
      }

    } finally {
      setUploading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // DELETE
  // ───────────────────────────────────────────────────────────────────────────

  const handleDelete = async (
    item: StudentListData
  ) => {
    const result =
      await Swal.fire({
        title: "Delete Student List?",
        html: `
          <div style="font-size:14px">
            <strong>${item.course}</strong><br/>
            ${item.year} ${item.branch}<br/>
            ${getBranchName(
              item.branch
            )}
            <br/><br/>
            This will delete the database record,
            uploaded file and student records.
          </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText:
          "Yes, Delete",
        cancelButtonText:
          "Cancel",
        confirmButtonColor:
          "#dc2626",
        cancelButtonColor:
          "#6b7280",
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(
        `/studentlist/delete/${item._id}`
      );

      await Swal.fire({
        title: "Deleted!",
        text: "Student list deleted successfully.",
        icon: "success",
        confirmButtonColor:
          "#be123c",
      });

      if (
        selectedListId ===
        item._id
      ) {
        setSelectedListId(
          null
        );
      }

      await fetchStudentLists();

    } catch (error: any) {
      Swal.fire({
        title: "Delete Failed",
        text:
          error?.response?.data
            ?.message ||
          "Failed to delete student list.",
        icon: "error",
        confirmButtonColor:
          "#be123c",
      });
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // BRANCH NAME
  // ───────────────────────────────────────────────────────────────────────────

  function getBranchName(
    branch: string
  ) {
    return (
      BRANCHES.find(
        (item) =>
          item.code === branch
      )?.name ||
      branch
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // AUTH
  // ───────────────────────────────────────────────────────────────────────────

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

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-200">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-rose-700" />

            Student List Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage student lists by course,
            branch and academic year.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={
              fetchStudentLists
            }
            disabled={
              isLoading
            }
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isLoading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </button>

          <button
            onClick={
              openUploadModal
            }
            className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg shadow-md"
          >
            <Plus className="w-4 h-4" />

            Upload Student List
          </button>

        </div>
      </div>

      {/* LOADING */}

      {isLoading && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">

          <RefreshCw className="w-10 h-10 text-rose-700 animate-spin mx-auto mb-4" />

          <p className="text-sm text-gray-500 font-semibold">
            Loading student lists...
          </p>

        </div>
      )}

      {/* LIST OVERVIEW */}

      {!isLoading &&
        !selectedList && (
          <>
            {lists.length ===
            0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">

                <FileSpreadsheet className="w-14 h-14 text-gray-300 mx-auto mb-4" />

                <h2 className="text-lg font-bold text-gray-700">
                  No Student Lists Found
                </h2>

                <p className="text-sm text-gray-500 mt-1 mb-5">
                  Upload a CSV or Excel student list to get started.
                </p>

                <button
                  onClick={
                    openUploadModal
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-sm font-semibold"
                >
                  <Upload className="w-4 h-4" />

                  Upload Student List
                </button>

              </div>
            ) : (
              <div className="space-y-5">

                <div className="flex items-center justify-between">

                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      Student Lists
                    </h2>

                    <p className="text-sm text-gray-500">
                      Select a course, year and branch to view students.
                    </p>
                  </div>

                  <div className="text-xs font-semibold text-gray-500">
                    {lists.length} lists
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                  {lists.map(
                    (item) => (
                      <div
                        key={
                          item._id
                        }
                        className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all"
                      >

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedListId(
                              item._id
                            )
                          }
                          className="w-full text-left p-5"
                        >

                          <div className="flex items-start justify-between gap-3">

                            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl">
                              <GraduationCap className="w-6 h-6" />
                            </div>

                            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                              {item.data?.length ||
                                0}{" "}
                              Students
                            </span>

                          </div>

                          <h3 className="text-lg font-bold text-gray-900 mt-4">
                            {item.course}
                          </h3>

                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">

                            <Calendar className="w-4 h-4 text-rose-600" />

                            <span className="font-semibold">
                              {item.year}
                            </span>

                          </div>

                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">

                            <BookOpen className="w-4 h-4 text-rose-600" />

                            <span className="font-bold text-gray-900">
                              {item.branch}
                            </span>

                            <span>
                              (
                              {getBranchName(
                                item.branch
                              )}
                              )
                            </span>

                          </div>

                        </button>

                        <div className="border-t border-gray-100 px-5 py-3 flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openReplaceModal(
                                item
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-lg"
                          >
                            <Replace className="w-3.5 h-3.5" />

                            Replace
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item
                              )
                            }
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />

                            Delete
                          </button>

                        </div>

                      </div>
                    )
                  )}

                </div>
              </div>
            )}
          </>
        )}

      {/* STUDENT DETAIL */}

      {!isLoading &&
        selectedList && (
          <div className="space-y-5">

            {/* BACK */}

            <button
              type="button"
              onClick={() =>
                setSelectedListId(
                  null
                )
              }
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-rose-700"
            >
              <ArrowLeft className="w-4 h-4" />

              Back to Student Lists
            </button>

            {/* SELECTOR */}

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedList.course}{" "}
                    {selectedList.year}{" "}
                    {selectedList.branch}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {
                      getBranchName(
                        selectedList.branch
                      )
                    }
                  </p>

                </div>

                <div className="flex flex-wrap gap-3">

                  <select
                    value={
                      selectedList._id
                    }
                    onChange={(
                      e
                    ) =>
                      setSelectedListId(
                        e.target.value
                      )
                    }
                    className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm font-bold"
                  >
                    {lists.map(
                      (
                        item
                      ) => (
                        <option
                          key={
                            item._id
                          }
                          value={
                            item._id
                          }
                        >
                          {item.course}{" "}
                          {item.year}{" "}
                          {item.branch}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    onClick={() =>
                      openReplaceModal(
                        selectedList
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold"
                  >
                    <Replace className="w-4 h-4" />

                    Replace
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        selectedList
                      )
                    }
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold"
                  >
                    <Trash2 className="w-4 h-4" />

                    Delete
                  </button>

                </div>

              </div>

            </div>

            {/* SEARCH */}

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

              <div className="relative max-w-md">

                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />

                <input
                  type="text"
                  value={
                    searchTerm
                  }
                  onChange={(
                    e
                  ) =>
                    setSearchTerm(
                      e.target.value
                    )
                  }
                  placeholder="Search student records..."
                  className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none shadow-sm"
                />

              </div>

              <div className="flex flex-col sm:flex-row gap-3">

                {/* SHOW */}

                <div className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">

                  <span className="text-xs font-semibold text-gray-600">
                    Show:
                  </span>

                  <select
                    value={
                      rowsPerPage
                    }
                    onChange={(
                      e
                    ) =>
                      setRowsPerPage(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 text-xs font-bold"
                  >
                    <option value={10}>
                      10
                    </option>

                    <option value={20}>
                      20
                    </option>

                    <option value={50}>
                      50
                    </option>
                  </select>

                  <span className="text-xs text-gray-500">
                    per page
                  </span>

                </div>

                {/* STATS */}

                <div className="text-xs font-semibold text-gray-600 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">

                  <Users className="w-4 h-4 text-rose-600" />

                  Showing{" "}

                  <strong className="text-gray-900">
                    {totalRows ===
                    0
                      ? 0
                      : startIndex +
                        1}
                    –
                    {
                      endIndex
                    }
                  </strong>

                  {" "}of{" "}

                  <strong className="text-gray-900">
                    {
                      totalRows
                    }
                  </strong>

                </div>

              </div>

            </div>

            {/* TABLE */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

              {headers.length >
                0 &&
              paginatedRows.length >
                0 ? (
                <div className="overflow-x-auto max-h-[650px]">

                  <table className="w-full text-left text-sm text-gray-700">

                    <thead className="bg-gray-100 uppercase text-xs text-gray-700 border-b sticky top-0 z-10">

                      <tr>

                        <th className="px-5 py-3.5 font-bold w-12 text-center">
                          #
                        </th>

                        {headers.map(
                          (
                            header,
                            index
                          ) => (
                            <th
                              key={
                                index
                              }
                              className="px-5 py-3.5 font-bold whitespace-nowrap"
                            >
                              {
                                header
                              }
                            </th>
                          )
                        )}

                      </tr>

                    </thead>

                    <tbody className="divide-y divide-gray-200">

                      {paginatedRows.map(
                        (
                          row,
                          rowIndex
                        ) => {

                          const actualIndex =
                            startIndex +
                            rowIndex;

                          return (
                            <tr
                              key={
                                row._id ||
                                `${selectedList._id}-${actualIndex}`
                              }
                              className="hover:bg-gray-50"
                            >

                              <td className="px-5 py-3.5 font-mono text-gray-400 font-bold text-center text-xs">
                                {actualIndex +
                                  1}
                              </td>

                              {headers.map(
                                (
                                  header,
                                  columnIndex
                                ) => (
                                  <td
                                    key={
                                      columnIndex
                                    }
                                    className={`px-5 py-3.5 whitespace-nowrap ${
                                      columnIndex ===
                                      0
                                        ? "font-bold text-gray-900"
                                        : ""
                                    }`}
                                  >
                                    {String(
                                      row[
                                        header
                                      ] ??
                                        "-"
                                    )}
                                  </td>
                                )
                              )}

                            </tr>
                          );
                        }
                      )}

                    </tbody>

                  </table>

                </div>
              ) : (
                <div className="p-12 text-center">

                  <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                  <p className="text-gray-500 font-semibold text-sm">
                    {searchTerm
                      ? `No records match "${searchTerm}".`
                      : "No student records available."}
                  </p>

                </div>
              )}

            </div>

            {/* PAGINATION */}

            {totalRows >
              0 &&
              totalPages >
                1 && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-4">

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                    <div className="text-xs font-semibold text-gray-500">

                      Page{" "}

                      <strong className="text-gray-900">
                        {
                          safeCurrentPage
                        }
                      </strong>

                      {" "}of{" "}

                      <strong className="text-gray-900">
                        {
                          totalPages
                        }
                      </strong>

                    </div>

                    <div className="flex items-center gap-1">

                      <button
                        disabled={
                          safeCurrentPage ===
                          1
                        }
                        onClick={() =>
                          setCurrentPage(
                            safeCurrentPage -
                              1
                          )
                        }
                        className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                      >
                        <ChevronLeft className="w-4 h-4" />

                        <span className="hidden sm:inline">
                          Previous
                        </span>
                      </button>

                      <div className="flex items-center gap-1">

                        {getPageNumbers().map(
                          (
                            page,
                            index
                          ) => {
                            if (
                              page ===
                              "..."
                            ) {
                              return (
                                <span
                                  key={`ellipsis-${index}`}
                                  className="px-2 py-2 text-xs font-bold text-gray-400"
                                >
                                  ...
                                </span>
                              );
                            }

                            const pageNumber =
                              page as number;

                            return (
                              <button
                                key={
                                  pageNumber
                                }
                                onClick={() =>
                                  setCurrentPage(
                                    pageNumber
                                  )
                                }
                                className={`min-w-9 px-3 py-2 text-xs font-bold rounded-lg border ${
                                  safeCurrentPage ===
                                  pageNumber
                                    ? "bg-rose-700 text-white border-rose-700"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-rose-50"
                                }`}
                              >
                                {
                                  pageNumber
                                }
                              </button>
                            );
                          }
                        )}

                      </div>

                      <button
                        disabled={
                          safeCurrentPage ===
                          totalPages
                        }
                        onClick={() =>
                          setCurrentPage(
                            safeCurrentPage +
                              1
                          )
                        }
                        className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                      >
                        <span className="hidden sm:inline">
                          Next
                        </span>

                        <ChevronRight className="w-4 h-4" />
                      </button>

                    </div>

                  </div>

                </div>
              )}

          </div>
        )}

      {/* UPLOAD MODAL */}

      {showUploadModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={
            closeUploadModal
          }
        >

          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="flex justify-between items-center border-b pb-3 mb-5">

              <div>

                <h3 className="text-xl font-bold text-gray-800">
                  {replaceId
                    ? "Replace Student List"
                    : "Upload Student List"}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Select course, branch and year.
                </p>

              </div>

              <button
                onClick={
                  closeUploadModal
                }
                disabled={
                  uploading
                }
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

            </div>

            <form
              onSubmit={
                handleUploadSubmit
              }
              className="space-y-5"
            >

              {/* COURSE */}

              <div>

                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Course *
                </label>

                <select
                  value={
                    uploadCourse
                  }
                  onChange={(
                    e
                  ) =>
                    setUploadCourse(
                      e.target.value
                    )
                  }
                  disabled={
                    !!replaceId
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100"
                >
                  {COURSES.map(
                    (
                      course
                    ) => (
                      <option
                        key={
                          course
                        }
                        value={
                          course
                        }
                      >
                        {
                          course
                        }
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* BRANCH */}

              <div>

                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Branch *
                </label>

                <select
                  value={
                    uploadBranch
                  }
                  onChange={(
                    e
                  ) =>
                    setUploadBranch(
                      e.target.value
                    )
                  }
                  disabled={
                    !!replaceId
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100"
                >
                  {BRANCHES.map(
                    (
                      branch
                    ) => (
                      <option
                        key={
                          branch.code
                        }
                        value={
                          branch.code
                        }
                      >
                        {
                          branch.code
                        }{" "}
                        (
                        {
                          branch.name
                        }
                        )
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* YEAR */}

              <div>

                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Academic Year *
                </label>

                <input
                  type="text"
                  value={
                    uploadYear
                  }
                  onChange={(
                    e
                  ) =>
                    setUploadYear(
                      e.target.value
                    )
                  }
                  disabled={
                    !!replaceId
                  }
                  placeholder="e.g. 2025"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100"
                />

              </div>

              {/* FILE */}

              <div>

                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Student List File *
                </label>

                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(
                    e
                  ) =>
                    setUploadFile(
                      e.target.files?.[0] ||
                        null
                    )
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                />

                <p className="text-[11px] text-gray-400 mt-1">
                  CSV, XLS or XLSX
                </p>

              </div>

              {/* SELECTED FILE */}

              {uploadFile && (
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">

                  <FileSpreadsheet className="w-8 h-8 text-green-600" />

                  <div className="min-w-0">

                    <p className="text-xs font-semibold truncate">
                      {
                        uploadFile.name
                      }
                    </p>

                    <p className="text-[11px] text-gray-400">
                      {(
                        uploadFile.size /
                        1024 /
                        1024
                      ).toFixed(
                        2
                      )}{" "}
                      MB
                    </p>

                  </div>

                </div>
              )}

              {replaceId && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">

                  <strong>
                    Warning:
                  </strong>{" "}
                  The existing student records and uploaded file will be replaced.

                </div>
              )}

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3 border-t">

                <button
                  type="button"
                  onClick={
                    closeUploadModal
                  }
                  disabled={
                    uploading
                  }
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    uploading
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold"
                >

                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />

                      {replaceId
                        ? "Replacing..."
                        : "Uploading..."}
                    </>
                  ) : (
                    <>
                      {replaceId ? (
                        <Replace className="w-4 h-4" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}

                      {replaceId
                        ? "Replace List"
                        : "Upload List"}
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}