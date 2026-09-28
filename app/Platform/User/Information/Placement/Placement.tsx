import {
  useState,
  useEffect,
  useMemo,
} from "react";

import apiClient from "~/utils/apiClient";
import Informations from "~/Common/Informations/Informations";

import { showAlert } from "~/utils/alert_utils";

import {
  Users,
  Search,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

import { Placement_data } from "./Placement_data";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export type PlacementRecord = {
  [key: string]: any;
};

export type PlacementStudentListData = {
  _id?: string;
  name: string;
  filename: string;
  filepath?: string;
  data: PlacementRecord[];
  createdAt?: string;
  updatedAt?: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Placement() {
  // ───────────────────────────────────────────────────────────────────────────
  // PLACEMENT LISTS
  // ───────────────────────────────────────────────────────────────────────────

  const [
    placementLists,
    setPlacementLists,
  ] = useState<PlacementStudentListData[]>(
    []
  );

  const [
    selectedListId,
    setSelectedListId,
  ] = useState<string | null>(
    null
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  // ───────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ───────────────────────────────────────────────────────────────────────────

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  // ───────────────────────────────────────────────────────────────────────────
  // TABLE PAGINATION
  // ───────────────────────────────────────────────────────────────────────────

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    rowsPerPage,
    setRowsPerPage,
  ] = useState(20);

  // ───────────────────────────────────────────────────────────────────────────
  // FETCH PLACEMENT LISTS
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchPlacementLists =
      async () => {
        try {
          setLoading(true);

          const res =
            await apiClient.get(
              "/placementstudentlist"
            );

          const fetched =
            res.data?.data || [];

          setPlacementLists(
            fetched
          );
        } catch (error) {
          showAlert({
            title:
              "Unable to load placement records",

            text:
              error instanceof Error
                ? error.message
                : "Failed to fetch placement records from the server.",

            icon: "error",

            confirmButtonColor:
              "#0891b2",
          });
        } finally {
          setLoading(false);
        }
      };

    fetchPlacementLists();
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // SELECTED PLACEMENT LIST
  // ───────────────────────────────────────────────────────────────────────────

  const currentListData =
    placementLists.find(
      (list) =>
        list._id ===
        selectedListId
    ) || null;

  // ───────────────────────────────────────────────────────────────────────────
  // PLACEMENT STUDENT ROWS
  // ───────────────────────────────────────────────────────────────────────────

  const placementRows =
    currentListData?.data || [];

  // ───────────────────────────────────────────────────────────────────────────
  // SEARCH
  // ───────────────────────────────────────────────────────────────────────────

  const filteredRows =
    useMemo(() => {
      if (!searchTerm.trim()) {
        return placementRows;
      }

      const term =
        searchTerm
          .toLowerCase()
          .trim();

      return placementRows.filter(
        (row) =>
          Object.values(row).some(
            (value) =>
              String(
                value ?? ""
              )
                .toLowerCase()
                .includes(term)
          )
      );
    }, [
      placementRows,
      searchTerm,
    ]);

  // ───────────────────────────────────────────────────────────────────────────
  // TABLE HEADERS
  // ───────────────────────────────────────────────────────────────────────────

  const headers =
    placementRows.length > 0
      ? Object.keys(
          placementRows[0]
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
  // RESET PAGINATION
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
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen space-y-6 sm:space-y-8 px-3 sm:px-5 md:px-8 lg:px-10">

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* PAGE TITLE */}
        {/* ────────────────────────────────────────────────────────────────── */}

        <div className="uppercase text-center text-lg sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-widest p-3 sm:p-4 md:p-5 bg-cyan-500 border-2 border-gray-300 rounded shadow-sm text-white">
          Placement
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* PAGE CONTENT */}
        {/* ────────────────────────────────────────────────────────────────── */}

        <div className="space-y-6 text-gray-700 leading-7">

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* INFORMATION HEADING */}
          {/* ──────────────────────────────────────────────────────────────── */}

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 border-l-4 border-cyan-500 pl-3">
              Information about Placement
            </h2>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* INFORMATION CONTENT */}
          {/* ──────────────────────────────────────────────────────────────── */}

          <p className="text-sm sm:text-base md:text-[17px] leading-7 sm:leading-8 text-justify">
            The Institute provides Placement Assistance to all students. The
            Placement Officer acts as a Catalyst in facilitating the process
            of interaction between the students and prospective representatives
            of the Corporate Houses and Industries, Reputed firms and Govt.
            Organisations for recruiting prospective students from time to
            time.
          </p>
          </section>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PLACEMENT RECORD HEADING */}
          {/* ──────────────────────────────────────────────────────────────── */}

          <section className="space-y-4">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 border-l-4 border-cyan-400 pl-3">
              PLACEMENT RECORD FOR THE FINAL YEAR STUDENTS
            </h2>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PLACEMENT RECORDS */}
          {/* ──────────────────────────────────────────────────────────────── */}

          <div className="text-sm sm:text-base md:text-[17px] leading-7 sm:leading-8 text-justify">

            {/* LOADING */}

            {loading ? (

              <div className="py-8 text-center">

                <div className="w-8 h-8 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-3" />

                <p className="text-sm font-semibold text-gray-500">
                  Loading placement records...
                </p>

              </div>

            ) : placementLists.length === 0 ? (

              /* NO PLACEMENT RECORDS */

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">

                <FileSpreadsheet className="w-10 h-10 text-gray-300 mx-auto mb-3" />

                <p className="text-sm font-semibold text-gray-500">
                  No placement records available.
                </p>

              </div>

            ) : !currentListData ? (

              /* ──────────────────────────────────────────────────────────── */
              /* PLACEMENT RECORD LIST */
              /* ──────────────────────────────────────────────────────────── */

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6">

                <div className="flex items-center gap-3 mb-5">

                  <div className="p-2.5 bg-cyan-100 text-cyan-700 rounded-lg">

                    <GraduationCap className="w-5 h-5" />

                  </div>

                  <div>

                    <h2 className="font-bold text-gray-900">
                      Placement Records
                    </h2>

                    <p className="text-sm text-gray-500">
                      Select a placement record to view the student details.
                    </p>

                  </div>

                </div>

                {/* ORDERED LIST */}

                <ol className="list-decimal list-inside space-y-3">

                  {placementLists.map(
                    (item) => (

                      <li
                        key={
                          item._id
                        }
                        className="text-gray-800"
                      >

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedListId(
                              item._id ||
                                null
                            );

                            setSearchTerm(
                              ""
                            );

                            setCurrentPage(
                              1
                            );
                          }}
                          className="ml-2 text-cyan-700 font-semibold hover:text-cyan-900 hover:underline text-left transition-colors"
                        >
                          {item.name}
                        </button>

                      </li>

                    )
                  )}

                </ol>

              </div>

            ) : (

              /* ──────────────────────────────────────────────────────────── */
              /* SELECTED PLACEMENT RECORD */
              /* ──────────────────────────────────────────────────────────── */

              <div className="space-y-6">

                {/* ───────────────────────────────────────────────────────── */}
                {/* BACK + SELECT OTHER FILE */}
                {/* ───────────────────────────────────────────────────────── */}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                  {/* BACK */}

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedListId(
                        null
                      );

                      setSearchTerm(
                        ""
                      );

                      setCurrentPage(
                        1
                      );
                    }}
                    className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-cyan-700 transition-colors"
                  >

                    <ArrowLeft className="w-4 h-4" />

                    Back to Placement Records

                  </button>

                  {/* SELECT OTHER FILE */}

                  <select
                    value={
                      currentListData._id ||
                      ""
                    }
                    onChange={(e) => {
                      setSelectedListId(
                        e.target.value
                      );

                      setSearchTerm(
                        ""
                      );

                      setCurrentPage(
                        1
                      );
                    }}
                    className="w-full sm:w-auto min-w-60 bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >

                    {placementLists.map(
                      (item) => (

                        <option
                          key={
                            item._id
                          }
                          value={
                            item._id
                          }
                        >
                          {item.name}
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* ───────────────────────────────────────────────────────── */}
                {/* FILE INFORMATION */}
                {/* ───────────────────────────────────────────────────────── */}

                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm">

                  <div className="flex items-center gap-3">

                    <div className="p-3 bg-cyan-100 text-cyan-700 rounded-xl">

                      <GraduationCap className="w-6 h-6" />

                    </div>

                    <div>

                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">

                        {
                          currentListData.name
                        }

                      </h2>

                      <p className="text-sm text-gray-500 mt-1">

                        {
                          currentListData.data
                            ?.length || 0
                        }{" "}
                        student records

                      </p>

                    </div>

                  </div>

                </div>

                {/* ───────────────────────────────────────────────────────── */}
                {/* SEARCH + SETTINGS */}
                {/* ───────────────────────────────────────────────────────── */}

                <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">

                  {/* SEARCH */}

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
                      placeholder="Search student records..."
                      className="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-cyan-500 focus:outline-none shadow-sm"
                    />

                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">

                    {/* ROWS PER PAGE */}

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

                {/* ───────────────────────────────────────────────────────── */}
                {/* TABLE */}
                {/* ───────────────────────────────────────────────────────── */}

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
                          ? `No placement records found matching "${searchTerm}".`
                          : "No placement records available."}

                      </p>

                      {searchTerm && (

                        <button
                          type="button"
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

                {/* ───────────────────────────────────────────────────────── */}
                {/* TABLE PAGINATION */}
                {/* ───────────────────────────────────────────────────────── */}

                {totalRows >
                  0 &&
                  totalPages >
                    1 && (

                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-4">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                      {/* PAGE INFORMATION */}

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

                        {/* PREVIOUS */}

                        <button
                          type="button"
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
                          className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                        >

                          <ChevronLeft className="w-4 h-4" />

                          <span className="hidden sm:inline">
                            Previous
                          </span>

                        </button>

                        {/* PAGE NUMBERS */}

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
                                  type="button"
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

                        {/* NEXT */}

                        <button
                          type="button"
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
                          className="flex items-center gap-1 px-3 py-2 text-xs font-bold rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
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
          </section>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* ORGANISATIONS HEADING */}
          {/* ──────────────────────────────────────────────────────────────── */}

          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 border-l-4 border-cyan-400 pl-3">
              SOME OF THE REPUTED ORGANISATIONS/DEPARTMENTS/INSTITUTES WHERE
              OUR STUDENTS GOT PLACED
          </h2>

          {/* ──────────────────────────────────────────────────────────────── */}
          {/* PLACEMENT LOGOS */}
          {/* ──────────────────────────────────────────────────────────────── */}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6 items-center">

            {Placement_data.map(
              (item) => (

                <div
                  key={
                    item.id
                  }
                  className="flex items-center justify-center min-h-24 sm:min-h-28 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >

                  <a
                    href={
                      item.url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full h-full"
                  >

                    <img
                      src={
                        item.image
                      }
                      alt="Placement organisation"
                      style={{
                        width: `${item.width}px`,
                      }}
                      className="max-w-full h-auto object-contain"
                    />

                  </a>

                </div>

              )
            )}

          </div>

        </div>

        <Informations />

      </div>
    </>
  );
}
