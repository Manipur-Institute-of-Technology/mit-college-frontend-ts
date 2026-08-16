import { useState, useEffect } from "react";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";
import Informations from "~/Common/Informations/Informations";
import {
  FileText,
  Calendar,
  ExternalLink,
  Award,
  Link as LinkIcon,
} from "lucide-react";
import { confirmExternalLink, showAlert } from "~/utils/alert_utils";

// ============================================================
// TYPES
// ============================================================

type ResourceType = "link" | "file";

type NirfResource = {
  type?: ResourceType;
  url?: string;
  file?: string;
};

export type NirfItem = {
  _id: string;

  header?: string;
  description?: string;

  // New structure
  resource?: NirfResource;

  year?: string;

  status?: "Active" | "Inactive";

  createdAt?: string;
  updatedAt?: string;
};

// ============================================================
// URL HELPERS
// ============================================================

const isHttpUrl = (value: string) => {
  if (!value) return false;

  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
};

// ============================================================
// FILE DETECTION
// ============================================================

const isFile = (value: string) => {
  if (!value) return false;

  const cleanValue = value
    .split("?")[0]
    .split("#")[0]
    .toLowerCase();

  const fileExtensions = [
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".csv",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".zip",
    ".rar",
  ];

  return fileExtensions.some((extension) =>
    cleanValue.endsWith(extension)
  );
};

// ============================================================
// GET RESOURCE VALUE
// ============================================================

const getResourceValue = (
  item: NirfItem
): string => {
  const resource = item.resource;

  if (!resource) {
    return "";
  }

  if (resource.type === "file") {
    return resource.file?.trim() || "";
  }

  if (resource.type === "link") {
    return resource.url?.trim() || "";
  }

  // Fallback if backend doesn't send type correctly
  return (
    resource.file?.trim() ||
    resource.url?.trim() ||
    ""
  );
};

// ============================================================
// GET RESOURCE TYPE
// ============================================================

const getResourceType = (
  item: NirfItem
): "link" | "document" => {
  const resource = item.resource;

  if (!resource) {
    return "document";
  }

  if (resource.type === "link") {
    return "link";
  }

  if (resource.type === "file") {
    return "document";
  }

  const value =
    resource.url?.trim() ||
    resource.file?.trim() ||
    "";

  if (
    isHttpUrl(value) &&
    !isFile(value)
  ) {
    return "link";
  }

  return "document";
};

// ============================================================
// CONVERT FILE PATH TO BACKEND URL
// ============================================================

const getFileUrl = (
  value: string
) => {
  if (!value) {
    return "";
  }

  const cleanValue = value.trim();

  // Already complete URL
  if (isHttpUrl(cleanValue)) {
    return cleanValue;
  }

  // /uploads/nirf/file.pdf
  if (cleanValue.startsWith("/")) {
    return `${API_BASE_URL}${cleanValue}`;
  }

  // uploads/nirf/file.pdf
  if (
    cleanValue.startsWith("uploads/")
  ) {
    return `${API_BASE_URL}/${cleanValue}`;
  }

  // nirf/file.pdf
  if (
    cleanValue.startsWith("nirf/")
  ) {
    return `${API_BASE_URL}/uploads/${cleanValue}`;
  }

  // Generic relative path
  return `${API_BASE_URL}/${cleanValue}`;
};

// ============================================================
// OPEN NIRF RESOURCE
// ============================================================

const handleNirfClick = (
  item: NirfItem
) => {
  const value = getResourceValue(item);

  if (!value || value === "#") {
    showAlert({
      title: "Resource unavailable",
      text: "The NIRF resource is not available.",
      icon: "warning",
      confirmButtonColor: "#0891b2",
    });

    return;
  }

  const resourceType =
    getResourceType(item);

  // ==========================================================
  // LINK
  // ==========================================================

  if (resourceType === "link") {
    if (!isHttpUrl(value)) {
      showAlert({
        title: "Invalid Link",
        text: "The NIRF link is not a valid HTTP/HTTPS URL.",
        icon: "error",
        confirmButtonColor: "#0891b2",
      });

      return;
    }

    try {
      const url = new URL(value);

      // External website
      if (
        url.origin !==
        window.location.origin
      ) {
        confirmExternalLink({
          title: "Open Link?",
          text: "You are being redirected to an external website.",
          confirmButtonText: "Continue",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#0891b2",
          cancelButtonColor: "#ef4444",
          customClass: {
            popup: "rounded-xl",
            confirmButton: "rounded-lg",
            cancelButton: "rounded-lg",
          },
        }).then((confirmed) => {
          if (confirmed) {
            window.open(
              url.href,
              "_blank",
              "noopener,noreferrer"
            );
          }
        });

        return;
      }

      // Same-origin website
      window.open(
        url.href,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      showAlert({
        title: "Invalid Link",
        text: "Unable to open this NIRF link.",
        icon: "error",
        confirmButtonColor: "#0891b2",
      });
    }

    return;
  }

  // ==========================================================
  // DOCUMENT
  // ==========================================================

  const fileUrl =
    getFileUrl(value);

  if (!fileUrl) {
    showAlert({
      title: "Document unavailable",
      text: "The NIRF document could not be located.",
      icon: "warning",
      confirmButtonColor: "#0891b2",
    });

    return;
  }

  window.open(
    fileUrl,
    "_blank",
    "noopener,noreferrer"
  );
};

// ============================================================
// NIRF
// ============================================================

export default function Nirf() {
  const [nirfItems, setNirfItems] =
    useState<NirfItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================================
  // FETCH NIRF
  // ==========================================================

  useEffect(() => {
    const fetchNirfData = async () => {
      try {
        setLoading(true);

        const response =
          await apiClient.get("/nirf");

        // ------------------------------------------------------
        // Backend can return:
        //
        // { data: [...] }
        //
        // OR
        //
        // [...]
        // ------------------------------------------------------

        const data =
          response.data?.data ??
          (Array.isArray(response.data)
            ? response.data
            : []);

        // ------------------------------------------------------
        // Only active records
        // ------------------------------------------------------

        const activeItems =
          data.filter(
            (item: NirfItem) =>
              item.status !== "Inactive"
          );

        setNirfItems(activeItems);
      } catch (error) {
        setNirfItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNirfData();
  }, []);

  // ==========================================================
  // GROUP BY YEAR
  // ==========================================================

  const groupedByYear =
    nirfItems.reduce<
      Record<string, NirfItem[]>
    >((acc, item) => {
      const year =
        item.year || "Other";

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(item);

      return acc;
    }, {});

  // ==========================================================
  // SORT YEARS
  // ==========================================================

  const sortedYears =
    Object.keys(
      groupedByYear
    ).sort((a, b) => {
      const yearA = Number(a);
      const yearB = Number(b);

      if (
        !Number.isNaN(yearA) &&
        !Number.isNaN(yearB)
      ) {
        return yearB - yearA;
      }

      return b.localeCompare(a);
    });

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-12">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="
          uppercase
          text-2xl
          font-bold
          tracking-widest
          p-4
          bg-cyan-500
          border-b-2
          border-cyan-600
          text-white
          text-center
          shadow-sm
        ">
          NIRF
        </div>

        <div className="
          max-w-4xl
          mx-auto
          px-4
          py-10
          space-y-10
        ">

          {/* =================================================
              OVERVIEW
          ================================================= */}

          <div className="
            bg-white
            rounded-2xl
            border
            border-gray-200
            p-6
            shadow-sm
          ">

            <div className="
              flex
              flex-col
              md:flex-row
              items-start
              md:items-center
              gap-6
            ">

              <div className="flex-1">

                <div className="
                  inline-flex
                  items-center
                  gap-2
                  px-3
                  py-1
                  bg-cyan-50
                  text-cyan-700
                  rounded-full
                  text-xs
                  font-semibold
                  border
                  border-cyan-200
                ">

                  <Award className="w-4 h-4" />

                  National Institutional
                  Ranking Framework

                </div>

                <h1 className="
                  text-2xl
                  font-bold
                  text-gray-800
                  mt-3
                ">
                  NIRF Data Submissions & Reports
                </h1>

                <p className="
                  text-gray-600
                  text-sm
                  leading-relaxed
                  max-w-2xl
                  mt-2
                ">
                  Access official National
                  Institutional Ranking Framework
                  (NIRF) data reports, submitted
                  documents, and rankings for
                  Manipur Institute of Technology.
                </p>

              </div>

            </div>

          </div>

          {/* =================================================
              LOADING
          ================================================== */}

          {loading ? (

            <div className="
              flex
              flex-col
              items-center
              justify-center
              py-16
            ">

              <div className="
                w-10
                h-10
                border-4
                border-cyan-200
                border-t-cyan-500
                rounded-full
                animate-spin
              " />

              <p className="
                mt-4
                text-gray-500
                font-medium
              ">
                Loading NIRF information...
              </p>

            </div>

          ) : sortedYears.length === 0 ? (

            /* =================================================
               EMPTY
            ================================================== */

            <div className="
              bg-white
              rounded-2xl
              border
              border-gray-200
              p-12
              text-center
              shadow-sm
            ">

              <div className="
                mx-auto
                w-16
                h-16
                flex
                items-center
                justify-center
                bg-gray-100
                rounded-full
              ">

                <FileText className="
                  w-7
                  h-7
                  text-gray-400
                " />

              </div>

              <h3 className="
                mt-5
                text-lg
                font-semibold
                text-gray-700
              ">
                No NIRF information available
              </h3>

              <p className="
                mt-1
                text-sm
                text-gray-500
              ">
                There are currently no NIRF
                documents or links available.
              </p>

            </div>

          ) : (

            /* =================================================
               YEARS
            ================================================== */

            sortedYears.map((year) => (

              <section
                key={year}
                className="space-y-4"
              >

                {/* =================================================
                    YEAR HEADER
                ================================================== */}

                <div className="
                  flex
                  items-center
                  gap-3
                  border-b
                  border-gray-200
                  pb-3
                ">

                  <div className="
                    flex
                    items-center
                    justify-center
                    w-10
                    h-10
                    bg-cyan-100
                    rounded-xl
                  ">

                    <Calendar className="
                      w-5
                      h-5
                      text-cyan-600
                    " />

                  </div>

                  <h2 className="
                    text-xl
                    font-bold
                    text-gray-800
                  ">
                    Year {year}
                  </h2>

                  <span className="
                    ml-auto
                    text-xs
                    bg-cyan-100
                    text-cyan-800
                    font-semibold
                    px-3
                    py-1
                    rounded-full
                    border
                    border-cyan-200
                  ">

                    {groupedByYear[year].length}{" "}

                    {groupedByYear[year].length === 1
                      ? "entry"
                      : "entries"}

                  </span>

                </div>

                {/* =================================================
                    ITEMS
                ================================================== */}

                <div className="grid gap-4">

                  {groupedByYear[year].map(
                    (item) => {

                      const resourceType =
                        getResourceType(item);

                      const isLink =
                        resourceType ===
                        "link";

                      const resourceValue =
                        getResourceValue(item);

                      return (

                        <div
                          key={item._id}
                          className="
                            group
                            relative
                            flex
                            flex-col
                            sm:flex-row
                            items-start
                            sm:items-center
                            justify-between
                            gap-4
                            bg-white
                            border
                            border-gray-200
                            hover:border-cyan-400
                            rounded-2xl
                            p-5
                            shadow-sm
                            hover:shadow-lg
                            transition-all
                            duration-300
                          "
                        >

                          {/* LEFT ACCENT */}

                          <div className="
                            absolute
                            left-0
                            top-4
                            bottom-4
                            w-1
                            bg-cyan-500
                            rounded-r-full
                          " />

                          {/* =================================================
                              INFORMATION
                          ================================================== */}

                          <div className="
                            flex
                            items-start
                            gap-3.5
                            flex-1
                            pl-2
                          ">

                            <div className="
                              p-3
                              bg-cyan-50
                              text-cyan-600
                              rounded-xl
                              group-hover:bg-cyan-100
                              transition-colors
                              flex-shrink-0
                            ">

                              {isLink ? (
                                <LinkIcon className="
                                  w-5
                                  h-5
                                " />
                              ) : (
                                <FileText className="
                                  w-5
                                  h-5
                                " />
                              )}

                            </div>

                            <div className="space-y-2">

                              <h3 className="
                                font-bold
                                text-gray-900
                                text-base
                                leading-snug
                                group-hover:text-cyan-700
                                transition-colors
                              ">
                                {item.header ||
                                  "NIRF Resource"}
                              </h3>

                              {item.description && (

                                <p className="
                                  text-sm
                                  text-gray-600
                                  leading-relaxed
                                ">
                                  {item.description}
                                </p>

                              )}

                              <div className="
                                flex
                                items-center
                                gap-1.5
                                text-xs
                                text-gray-500
                              ">

                                <Calendar className="
                                  w-3.5
                                  h-3.5
                                  text-cyan-500
                                " />

                                <span>
                                  {item.year ||
                                    "-"}
                                </span>

                              </div>

                            </div>

                          </div>

                          {/* =================================================
                              BUTTON
                          ================================================== */}

                          <button
                            type="button"
                            disabled={!resourceValue}
                            onClick={() =>
                              handleNirfClick(
                                item
                              )}
                            className="
                              flex-shrink-0
                              w-full
                              sm:w-auto
                              flex
                              items-center
                              justify-center
                              gap-2
                              px-4
                              py-2.5
                              bg-cyan-500
                              hover:bg-cyan-600
                              disabled:bg-gray-300
                              disabled:cursor-not-allowed
                              text-white
                              text-sm
                              font-semibold
                              rounded-xl
                              shadow-sm
                              hover:shadow-md
                              transition-all
                            "
                          >

                            {isLink ? (
                              <>
                                <span>
                                  Visit Link
                                </span>

                                <ExternalLink className="
                                  w-4
                                  h-4
                                " />
                              </>
                            ) : (
                              <>
                                <span>
                                  View Document
                                </span>

                                <FileText className="
                                  w-4
                                  h-4
                                " />
                              </>
                            )}

                          </button>

                        </div>

                      );
                    }
                  )}

                </div>

              </section>

            ))

          )}

        </div>

      </div>

      <Informations />
    </>
  );
}
