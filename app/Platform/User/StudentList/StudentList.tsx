import {
  useState,
  useEffect,
  useMemo,
} from "react";

import apiClient from "~/utils/apiClient";
import Informations from "~/Common/Informations/Informations";

import Swal from "sweetalert2";

import {
  Users,
  Search,
  FileSpreadsheet,
  Download,
  Calendar,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type StudentRecord = {
  [key: string]: any;
};

export type StudentListData = {
  _id?: string;
  course: string;
  branch: string;
  year: string;
  filepath?: string;
  data: StudentRecord[];
  createdAt?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// BRANCHES
// ─────────────────────────────────────────────────────────────────────────────

const BRANCHES = {
  CE: "Civil Engineering",

  ME: "Mechanical Engineering",

  CSE: "Computer Science & Engineering",

  EE: "Electrical Engineering",

  ECE: "Electronics & Communication Engineering",
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function StudentList() {

  const [lists, setLists] =
    useState<StudentListData[]>(
      []
    );

  const [
    selectedListId,
    setSelectedListId,
  ] = useState<string | null>(
    null
  );

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  // Pagination

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState(20);

  // ───────────────────────────────────────────────────────────────────────────
  // FETCH
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {

    const fetchStudentLists =
      async () => {

        try {

          setLoading(true);

          const res =
            await apiClient.get(
              "/studentlist"
            );

          const fetched =
            res.data?.data ||
            [];

          setLists(fetched);

        } catch (error) {

          console.error(
            "Failed to fetch student lists:",
            error
          );

          Swal.fire({
            title:
              "Unable to load student list",

            text:
              error instanceof Error
                ? error.message
                : "Failed to fetch student lists from the server.",

            icon: "error",

            confirmButtonColor:
              "#0891b2",
          });

        } finally {

          setLoading(false);

        }

      };

    fetchStudentLists();

  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // SELECTED LIST
  // ───────────────────────────────────────────────────────────────────────────

  const currentListData =
    lists.find(
      (list) =>
        list._id ===
        selectedListId
    ) || null;

  const studentRows =
    currentListData?.data ||
    [];

  // ───────────────────────────────────────────────────────────────────────────
  // BRANCH NAME
  // ───────────────────────────────────────────────────────────────────────────

  const getBranchName = (
    branch: string
  ) => {

    return (
      BRANCHES[
        branch as keyof typeof BRANCHES
      ] ||
      branch
    );

  };

  // ───────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ───────────────────────────────────────────────────────────────────────────

  const filteredRows =
    useMemo(() => {

      if (
        !searchTerm.trim()
      ) {
        return studentRows;
      }

      const term =
        searchTerm
          .toLowerCase()
          .trim();

      return studentRows.filter(
        (row) =>
          Object.values(
            row
          ).some(
            (value) =>
              String(
                value ?? ""
              )
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

  // ───────────────────────────────────────────────────────────────────────────
  // RESET PAGE
  // ───────────────────────────────────────────────────────────────────────────

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
  // DOWNLOAD
  // ───────────────────────────────────────────────────────────────────────────

  const handleDownloadFile = (
    filepath?: string
  ) => {

    if (!filepath) {

      Swal.fire({
        title: "Notice",

        text:
          "No file available for download.",

        icon: "info",

        confirmButtonColor:
          "#0891b2",
      });

      return;
    }

    const fileUrl =
      filepath.startsWith(
        "http"
      )
        ? filepath
        : `/${filepath}`;

    Swal.fire({

      title:
        "Download Student List?",

      text:
        `Do you want to download the ${currentListData?.course} ${currentListData?.year} ${currentListData?.branch} student list?`,

      icon: "info",

      showCancelButton: true,

      confirmButtonText:
        "Download Now",

      cancelButtonText:
        "Cancel",

      confirmButtonColor:
        "#0891b2",

    }).then(
      (result) => {

        if (
          result.isConfirmed
        ) {

          window.open(
            fileUrl,
            "_blank",
            "noopener,noreferrer"
          );

        }

      }
    );

  };

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-12">

        {/* HEADER */}

        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-b-2 border-cyan-600 text-white text-center shadow-sm">
          Student List
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

          {/* LOADING */}

          {loading ? (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">

              <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4" />

              <p className="text-sm font-semibold text-gray-500">
                Loading student lists...
              </p>

            </div>

          ) : lists.length ===
            0 ? (

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-16 text-center">

              <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto mb-3" />

              <p className="text-gray-500 font-semibold text-sm">
                No student lists available.
              </p>

            </div>

          ) : !currentListData ? (

            /* ──────────────────────────────────────────────────────────────── */
            /* LIST OVERVIEW */
            /* ──────────────────────────────────────────────────────────────── */

            <div className="space-y-6">

              <div className="text-center">

                <div className="inline-flex p-3 bg-cyan-100 text-cyan-700 rounded-xl mb-3">

                  <GraduationCap className="w-7 h-7" />

                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                  Enrolled Students
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Select a course, academic year and branch.
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {lists.map(
                  (item) => (

                    <button
                      key={
                        item._id
                      }
                      type="button"
                      onClick={() =>
                        setSelectedListId(
                          item._id ||
                            null
                        )
                      }
                      className="text-left bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-cyan-400 transition-all p-5"
                    >

                      <div className="flex items-start justify-between">

                        <div className="p-3 bg-cyan-50 text-cyan-700 rounded-xl">

                          <GraduationCap className="w-6 h-6" />

                        </div>

                        <span className="text-xs font-bold bg-cyan-50 text-cyan-700 px-2.5 py-1 rounded-full">

                          {item.data?.length ||
                            0}{" "}
                          Students

                        </span>

                      </div>

                      <h2 className="text-lg font-bold text-gray-900 mt-5">

                        {item.course}

                      </h2>

                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">

                        <Calendar className="w-4 h-4 text-cyan-600" />

                        <span className="font-bold">
                          {item.year}
                        </span>

                      </div>

                      <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">

                        <BookOpen className="w-4 h-4 text-cyan-600" />

                        <span className="font-bold text-gray-900">
                          {item.branch}
                        </span>

                        <span>
                          (
                          {
                            getBranchName(
                              item.branch
                            )
                          }
                          )
                        </span>

                      </div>

                    </button>

                  )
                )}

              </div>

            </div>

          ) : (

            /* ──────────────────────────────────────────────────────────────── */
            /* STUDENT DETAIL */
            /* ──────────────────────────────────────────────────────────────── */

            <div className="space-y-6">

              {/* BACK */}

              <button
                type="button"
                onClick={() => {

                  setSelectedListId(
                    null
                  );

                  setSearchTerm("");

                }}
                className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-cyan-700"
              >

                <ArrowLeft className="w-4 h-4" />

                Back to Student Lists

              </button>

              {/* INFORMATION */}

              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                  <div>

                    <div className="flex items-center gap-3">

                      <div className="p-3 bg-cyan-100 text-cyan-700 rounded-xl">

                        <GraduationCap className="w-6 h-6" />

                      </div>

                      <div>

                        <h1 className="text-2xl font-bold text-gray-900">

                          {
                            currentListData.course
                          }{" "}
                          {
                            currentListData.year
                          }

                        </h1>

                        <p className="text-sm text-gray-500">

                          {
                            currentListData.branch
                          }{" "}
                          (
                          {
                            getBranchName(
                              currentListData.branch
                            )
                          }
                          )

                        </p>

                      </div>

                    </div>

                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">

                    {/* LIST DROPDOWN */}

                    <select
                      value={
                        currentListData._id ||
                        ""
                      }
                      onChange={(
                        e
                      ) => {

                        setSelectedListId(
                          e.target.value
                        );

                        setSearchTerm("");

                      }}
                      className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-sm font-bold text-gray-900"
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

                            {
                              item.course
                            }{" "}
                            {
                              item.year
                            }{" "}
                            {
                              item.branch
                            }

                          </option>

                        )
                      )}

                    </select>

                    {/* DOWNLOAD */}

                    {currentListData.filepath && (

                      <button
                        onClick={() =>
                          handleDownloadFile(
                            currentListData.filepath
                          )
                        }
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold rounded-xl"
                      >

                        <Download className="w-4 h-4" />

                        Download File

                      </button>

                    )}

                  </div>

                </div>

              </div>

              {/* SEARCH + PAGINATION SETTINGS */}

              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

                <div className="relative flex-1 max-w-md">

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
                    placeholder="Search by Roll No, Name, Branch..."
                    className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none shadow-sm"
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

                    <span className="text-xs font-semibold text-gray-500">
                      per page
                    </span>

                  </div>

                  {/* STATS */}

                  <div className="text-xs font-semibold text-gray-600 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">

                    <Users className="w-4 h-4 text-cyan-600" />

                    Showing{" "}

                    <span className="font-bold text-gray-900">

                      {totalRows ===
                      0
                        ? 0
                        : startIndex +
                          1}

                      –
                      {
                        endIndex
                      }

                    </span>

                    {" "}of{" "}

                    <span className="font-bold text-gray-900">

                      {
                        totalRows
                      }

                    </span>

                    {" "}students

                  </div>

                </div>

              </div>

              {/* TABLE */}

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {headers.length >
                  0 &&
                paginatedRows.length >
                  0 ? (

                  <div className="overflow-x-auto">

                    <table className="w-full text-left text-sm text-gray-700">

                      <thead className="bg-cyan-500 text-white uppercase text-xs">

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
                                  `${currentListData._id}-${actualIndex}`
                                }
                                className="hover:bg-gray-50 transition-colors"
                              >

                                <td className="px-5 py-3.5 font-mono text-cyan-700 font-bold text-center text-xs">

                                  {
                                    actualIndex +
                                    1
                                  }

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

                  <div className="p-12 text-center space-y-3">

                    <FileSpreadsheet className="w-12 h-12 text-gray-300 mx-auto" />

                    <p className="text-gray-500 font-semibold text-sm">

                      {searchTerm
                        ? `No students found matching "${searchTerm}".`
                        : `No student records available for ${currentListData.course} ${currentListData.year} ${currentListData.branch}.`}

                    </p>

                    {searchTerm && (

                      <button
                        onClick={() =>
                          setSearchTerm(
                            ""
                          )
                        }
                        className="text-xs font-bold text-cyan-600 hover:underline"
                      >
                        Clear search
                      </button>

                    )}

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

                      <span className="font-bold text-gray-900">
                        {
                          safeCurrentPage
                        }
                      </span>

                      {" "}of{" "}

                      <span className="font-bold text-gray-900">
                        {
                          totalPages
                        }
                      </span>

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
                        className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
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
                                    ? "bg-cyan-600 text-white border-cyan-600"
                                    : "bg-white text-gray-700 border-gray-200 hover:bg-cyan-50 hover:border-cyan-300"
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
                        className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
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

        </div>

      </div>

      <Informations />

    </>
  );
}