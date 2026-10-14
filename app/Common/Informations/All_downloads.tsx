import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronLeft, ChevronRight, Search, X, Download as DownloadIcon } from "lucide-react";

import apiClient, { API_BASE_URL } from "~/utils/apiClient";
import type { InfoItem } from "~/Common/Informations/Informations";

/* ================================================================
   HELPERS
================================================================ */

const resolveDownloadTitle = (item: InfoItem) => {
  return (
    item.heading ||
    item.title ||
    item.File_name ||
    item.fileName ||
    "Untitled Download"
  );
};

const resolveDownloadLink = (item: InfoItem) => {
  if (item.pdf_link) return item.pdf_link;
  if (item.Links) return item.Links;
  if (item.url) return item.url;
  if (item.fileName) return `${API_BASE_URL}/uploads/downloads/${item.fileName}`;
  if (item.File_name) return `${API_BASE_URL}/uploads/downloads/${item.File_name}`;
  return "#";
};

const resolveCreatedDate = (item: InfoItem) => {
  return item.createdAt || item.date || item.updatedAt || item.active_date || null;
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Date unavailable";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isExternalLink = (url: string) => {
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.origin !== window.location.origin;
  } catch {
    return false;
  }
};

const openDownload = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (!href || href === "#") {
    e.preventDefault();
    return;
  }

  if (!isExternalLink(href)) return;

  e.preventDefault();
  window.open(href, "_blank", "noopener,noreferrer");
};

/* ================================================================
   COMPONENT
================================================================ */

export default function AllDownloads() {
  const location = useLocation();

  const passedDownloads =
    (location.state as { downloads?: InfoItem[] } | null)?.downloads ?? [];

  const [downloads, setDownloads] = useState<InfoItem[]>(
    Array.isArray(passedDownloads) ? passedDownloads : []
  );
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* ================================================================
     FETCH DOWNLOADS
  ================================================================= */

  useEffect(() => {
    const fetchDownloads = async () => {
      setLoading(true);

      try {
        const response = await apiClient.get("/download");
        const responseData = response?.data?.data ?? response?.data ?? [];
        const fetchedDownloads: InfoItem[] = Array.isArray(responseData)
          ? responseData
          : [];

        // Merge fetched records with route-state records and remove duplicates.
        const uniqueMap = new Map<string, InfoItem>();
        [...fetchedDownloads, ...passedDownloads].forEach((item) => {
          const key =
            item._id ||
            `${resolveDownloadTitle(item)}-${resolveDownloadLink(item)}`;
          if (!uniqueMap.has(key)) uniqueMap.set(key, item);
        });

        setDownloads(
          Array.from(uniqueMap.values()).sort((a, b) =>
            resolveDownloadTitle(a).localeCompare(
              resolveDownloadTitle(b),
              undefined,
              { sensitivity: "base", numeric: true }
            )
          )
        );
      } catch {
        setDownloads(
          [...passedDownloads].sort((a, b) =>
            resolveDownloadTitle(a).localeCompare(
              resolveDownloadTitle(b),
              undefined,
              { sensitivity: "base", numeric: true }
            )
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDownloads();
    // Route-state data is used as a fallback if the API request fails.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================================================================
     SEARCH + ALPHABETICAL SORT
  ================================================================= */

  const filteredDownloads = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return downloads
      .filter((item) =>
        resolveDownloadTitle(item).toLowerCase().includes(searchTerm)
      )
      .sort((a, b) =>
        resolveDownloadTitle(a).localeCompare(
          resolveDownloadTitle(b),
          undefined,
          { sensitivity: "base", numeric: true }
        )
      );
  }, [downloads, search]);

  /* ================================================================
     PAGINATION
  ================================================================= */

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDownloads.length / itemsPerPage)
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDownloads = filteredDownloads.slice(startIndex, endIndex);

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    for (let page = start; page <= end; page++) pages.push(page);
    return pages;
  }, [currentPage, totalPages]);

  /* ================================================================
     RENDER
  ================================================================= */

  return (
    <div className="min-h-dvh bg-gray-50">
      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 text-white text-center shadow-sm">
        All Downloads
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">
        {/* SEARCH + ITEMS PER PAGE */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search downloads..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm">
              <label
                htmlFor="itemsPerPage"
                className="text-gray-600 font-medium whitespace-nowrap"
              >
                Show
              </label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span className="text-gray-600">per page</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            {loading
              ? "Loading downloads..."
              : `Showing ${
                  filteredDownloads.length === 0 ? 0 : startIndex + 1
                }-${Math.min(endIndex, filteredDownloads.length)} of ${
                  filteredDownloads.length
                } downloads`}
          </div>
        </div>

        {/* DOWNLOAD LIST */}
        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex justify-center">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : currentDownloads.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <div className="text-gray-400 text-5xl mb-4">📁</div>
            <h2 className="font-semibold text-gray-700">No downloads found</h2>
            {search && (
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {currentDownloads.map((item, index) => {
              const title = resolveDownloadTitle(item);
              const link = resolveDownloadLink(item);
              const date = resolveCreatedDate(item);

              return (
                <div
                  key={item._id || `${title}-${index}`}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => openDownload(e, link)}
                        className="font-semibold text-gray-800 hover:text-cyan-600 transition-colors text-sm md:text-base break-words"
                      >
                        {title}
                      </a>
                      {item.description && (
                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                          {item.description}
                        </p>
                      )}
                      <div className="mt-2">
                        <span className="text-xs text-gray-400">
                          Uploaded: {formatDate(date)}
                        </span>
                      </div>
                    </div>

                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => openDownload(e, link)}
                      className="inline-flex items-center justify-center gap-2 self-start sm:self-center px-4 py-2 rounded-lg bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-600 transition-colors"
                    >
                      <DownloadIcon size={16} />
                      Open Download
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && filteredDownloads.length > 0 && (
          <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-gray-500">
                Page{" "}
                <span className="font-semibold text-gray-700">{currentPage}</span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">{totalPages}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => changePage(currentPage - 1)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {pageNumbers.map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => changePage(page)}
                    className={`min-w-9 h-9 px-2 rounded-lg text-sm font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-cyan-500 text-white"
                        : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => changePage(currentPage + 1)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="mt-6 flex justify-center">
          <Link
            to="/"
            className="px-5 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
