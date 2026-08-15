import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";

import apiClient, {
  API_BASE_URL,
} from "~/utils/apiClient";

import type { InfoItem } from "~/Common/Informations/Informations";

/* ================================================================
   TYPES
================================================================ */

type NotificationItem = InfoItem & {
  active?: boolean;
  isActive?: boolean;
  status?: string;
};

/* ================================================================
   HELPERS
================================================================ */

/**
 * Resolve notification title.
 */
const resolveNotificationTitle = (
  item: NotificationItem
) => {
  return (
    item.heading ||
    item.title ||
    item.File_name ||
    item.fileName ||
    "Untitled Notification"
  );
};

/**
 * Resolve notification link.
 */
const resolveNotificationLink = (
  item: NotificationItem
) => {
  if (item.pdf_link) {
    return item.pdf_link;
  }

  if (item.Links) {
    return item.Links;
  }

  if (item.url) {
    return item.url;
  }

  if (item.fileName) {
    return `${API_BASE_URL}/uploads/notifications/${item.fileName}`;
  }

  if (item.File_name) {
    return `${API_BASE_URL}/uploads/notifications/${item.File_name}`;
  }

  return "#";
};

/**
 * Resolve upload date.
 *
 * IMPORTANT:
 * createdAt is preferred because the
 * requirement is newest uploaded first.
 */
const resolveCreatedDate = (
  item: NotificationItem
) => {
  return (
    item.createdAt ||
    item.date ||
    item.updatedAt ||
    item.active_date ||
    null
  );
};

/**
 * Format date for UI.
 */
const formatDate = (
  dateString?: string | null
) => {
  if (!dateString) {
    return "Date unavailable";
  }

  const date =
    new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

/**
 * Determine active/inactive state.
 *
 * This supports several possible backend
 * formats without breaking the UI.
 */
const isNotificationActive = (
  item: NotificationItem
) => {
  /*
   * Explicit boolean status.
   */
  if (
    typeof item.active ===
    "boolean"
  ) {
    return item.active;
  }

  if (
    typeof item.isActive ===
    "boolean"
  ) {
    return item.isActive;
  }

  /*
   * String status.
   */
  if (item.status) {
    const status =
      item.status
        .toLowerCase()
        .trim();

    if (
      status === "inactive" ||
      status === "expired" ||
      status === "disabled"
    ) {
      return false;
    }

    if (
      status === "active" ||
      status === "enabled"
    ) {
      return true;
    }
  }

  /*
   * If backend doesn't provide explicit
   * status, determine it from active_date.
   */
  if (item.active_date) {
    const activeDate =
      new Date(
        item.active_date
      ).getTime();

    if (
      !Number.isNaN(
        activeDate
      )
    ) {
      return activeDate >= Date.now();
    }
  }

  /*
   * If there is no status information,
   * consider it active.
   */
  return true;
};

/**
 * External URL detection.
 */
const isExternalLink = (
  url: string
) => {
  try {
    const parsed =
      new URL(
        url,
        window.location.origin
      );

    return (
      parsed.origin !==
      window.location.origin
    );
  } catch {
    return false;
  }
};

/**
 * Open external link.
 */
const openNotification = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (
    !href ||
    href === "#"
  ) {
    e.preventDefault();
    return;
  }

  if (
    !isExternalLink(href)
  ) {
    return;
  }

  e.preventDefault();

  window.open(
    href,
    "_blank",
    "noopener,noreferrer"
  );
};

/* ================================================================
   COMPONENT
================================================================ */

export default function AllNotifications() {
  const location =
    useLocation();

  /*
   * Receive notifications passed from
   * Informations.tsx.
   */
  const passedNotifications =
    (
      location.state as {
        notifications?: NotificationItem[];
      } | null
    )?.notifications ?? [];

  const [
    notifications,
    setNotifications,
  ] = useState<
    NotificationItem[]
  >(
    Array.isArray(
      passedNotifications
    )
      ? passedNotifications
      : []
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    itemsPerPage,
    setItemsPerPage,
  ] = useState(10);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  /* ================================================================
     FETCH NOTIFICATIONS
  ================================================================= */

  useEffect(() => {
    const fetchNotifications =
      async () => {
        setLoading(true);

        try {
          /*
           * Active notifications.
           */
          const activePromise =
            apiClient.get(
              "/notification"
            );

          /*
           * Inactive notifications.
           *
           * If this endpoint doesn't exist,
           * we gracefully continue with the
           * active notifications.
           */
          const inactivePromise =
            apiClient
              .get(
                "/notification/inactive"
              )
              .catch((error) => {
                console.warn(
                  "Inactive notification endpoint unavailable:",
                  error
                );

                return null;
              });

          const [
            activeResponse,
            inactiveResponse,
          ] =
            await Promise.all([
              activePromise,
              inactivePromise,
            ]);

          const activeData =
            activeResponse
              ?.data?.data ??
            activeResponse
              ?.data ??
            [];

          const inactiveData =
            inactiveResponse
              ?.data?.data ??
            inactiveResponse
              ?.data ??
            [];

          const activeList =
            Array.isArray(
              activeData
            )
              ? activeData
              : [];

          const inactiveList =
            Array.isArray(
              inactiveData
            )
              ? inactiveData
              : [];

          /*
           * Combine active + inactive.
           */
          const combined = [
            ...activeList,
            ...inactiveList,
          ];

          /*
           * Remove duplicates.
           *
           * This is important if an endpoint
           * accidentally returns the same
           * notification in both responses.
           */
          const uniqueMap =
            new Map<
              string,
              NotificationItem
            >();

          combined.forEach(
            (item) => {
              const key =
                item._id ||
                `${resolveNotificationTitle(
                  item
                )}-${resolveCreatedDate(
                  item
                )}`;

              if (
                !uniqueMap.has(
                  key
                )
              ) {
                uniqueMap.set(
                  key,
                  item
                );
              }
            }
          );

          /*
           * If inactive endpoint doesn't exist
           * and the page received notifications
           * from Informations, make sure those
           * are still available.
           */
          if (
            combined.length ===
              0 &&
            passedNotifications.length >
              0
          ) {
            passedNotifications.forEach(
              (item) => {
                const key =
                  item._id ||
                  `${resolveNotificationTitle(
                    item
                  )}-${resolveCreatedDate(
                    item
                  )}`;

                uniqueMap.set(
                  key,
                  item
                );
              }
            );
          }

          /*
           * Sort newest uploaded first.
           */
          const sorted =
            Array.from(
              uniqueMap.values()
            ).sort(
              (a, b) => {
                const dateA =
                  resolveCreatedDate(
                    a
                  );

                const dateB =
                  resolveCreatedDate(
                    b
                  );

                const timeA =
                  dateA
                    ? new Date(
                        dateA
                      ).getTime()
                    : 0;

                const timeB =
                  dateB
                    ? new Date(
                        dateB
                      ).getTime()
                    : 0;

                return (
                  timeB - timeA
                );
              }
            );

          setNotifications(
            sorted
          );
        } catch (error) {
          console.error(
            "FETCH ALL NOTIFICATIONS ERROR:",
            error
          );

          /*
           * At least retain data sent
           * from Informations.
           */
          setNotifications(
            passedNotifications
          );
        } finally {
          setLoading(false);
        }
      };

    fetchNotifications();
  }, []);

  /* ================================================================
     SEARCH + SORT
  ================================================================= */

  const filteredNotifications =
    useMemo(() => {
      const searchTerm =
        search
          .trim()
          .toLowerCase();

      const filtered =
        notifications.filter(
          (item) => {
            if (!searchTerm) {
              return true;
            }

            const title =
              resolveNotificationTitle(
                item
              ).toLowerCase();

            return title.includes(
              searchTerm
            );
          }
        );

      /*
       * Always newest first.
       */
      return filtered.sort(
        (a, b) => {
          const dateA =
            resolveCreatedDate(
              a
            );

          const dateB =
            resolveCreatedDate(
              b
            );

          const timeA =
            dateA
              ? new Date(
                  dateA
                ).getTime()
              : 0;

          const timeB =
            dateB
              ? new Date(
                  dateB
                ).getTime()
              : 0;

          return (
            timeB - timeA
          );
        }
      );
    }, [
      notifications,
      search,
    ]);

  /* ================================================================
     PAGINATION
  ================================================================= */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredNotifications.length /
          itemsPerPage
      )
    );

  /*
   * If search/filter reduces the
   * number of pages, reset to page 1.
   */
  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const endIndex =
    startIndex +
    itemsPerPage;

  const currentNotifications =
    filteredNotifications.slice(
      startIndex,
      endIndex
    );

  /* ================================================================
     PAGE CHANGE
  ================================================================= */

  const changePage = (
    page: number
  ) => {
    if (
      page < 1 ||
      page > totalPages
    ) {
      return;
    }

    setCurrentPage(
      page
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* ================================================================
     SEARCH CHANGE
  ================================================================= */

  const handleSearchChange = (
    value: string
  ) => {
    setSearch(value);
    setCurrentPage(1);
  };

  /* ================================================================
     ITEMS PER PAGE
  ================================================================= */

  const handleItemsPerPageChange =
    (
      value: number
    ) => {
      setItemsPerPage(
        value
      );
      setCurrentPage(1);
    };

  /* ================================================================
     PAGE NUMBERS
  ================================================================= */

  const pageNumbers =
    useMemo(() => {
      const pages: number[] =
        [];

      const maxVisiblePages =
        5;

      let start =
        Math.max(
          1,
          currentPage -
            Math.floor(
              maxVisiblePages /
                2
            )
        );

      let end =
        Math.min(
          totalPages,
          start +
            maxVisiblePages -
            1
        );

      if (
        end - start + 1 <
        maxVisiblePages
      ) {
        start =
          Math.max(
            1,
            end -
              maxVisiblePages +
              1
          );
      }

      for (
        let i = start;
        i <= end;
        i++
      ) {
        pages.push(i);
      }

      return pages;
    }, [
      currentPage,
      totalPages,
    ]);

  /* ================================================================
     RENDER
  ================================================================= */

  return (
    <div className="min-h-dvh bg-gray-50">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 text-white text-center shadow-sm">
        All Notifications
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6">

        {/* ============================================================
            TOP BAR
        ============================================================ */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">

          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">

            {/* SEARCH */}

            <div className="relative w-full md:max-w-md">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearchChange(
                    e.target.value
                  )
                }
                placeholder="Search notification..."
                className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
              />

              {search && (
                <button
                  type="button"
                  onClick={() =>
                    handleSearchChange(
                      ""
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  aria-label="Clear search"
                >
                  <X size={18} />
                </button>
              )}

            </div>

            {/* ITEMS PER PAGE */}

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
                onChange={(e) =>
                  handleItemsPerPageChange(
                    Number(
                      e.target.value
                    )
                  )
                }
                className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
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

              <span className="text-gray-600">
                per page
              </span>

            </div>

          </div>

          {/* RESULT COUNT */}

          <div className="mt-3 text-xs text-gray-500">
            {loading
              ? "Loading notifications..."
              : `Showing ${
                  filteredNotifications.length ===
                  0
                    ? 0
                    : startIndex + 1
                }-${
                  Math.min(
                    endIndex,
                    filteredNotifications.length
                  )
                } of ${
                  filteredNotifications.length
                } notifications`}
          </div>

        </div>

        {/* ============================================================
            NOTIFICATIONS
        ============================================================ */}

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 flex justify-center">

            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />

          </div>
        ) : currentNotifications.length ===
          0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">

            <div className="text-gray-400 text-5xl mb-4">
              🔔
            </div>

            <h2 className="font-semibold text-gray-700">
              No notifications found
            </h2>

            {search && (
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term.
              </p>
            )}

          </div>
        ) : (
          <div className="space-y-3">

            {currentNotifications.map(
              (
                item,
                index
              ) => {
                const title =
                  resolveNotificationTitle(
                    item
                  );

                const link =
                  resolveNotificationLink(
                    item
                  );

                const active =
                  isNotificationActive(
                    item
                  );

                const date =
                  resolveCreatedDate(
                    item
                  );

                return (
                  <div
                    key={
                      item._id ||
                      `${title}-${index}`
                    }
                    className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >

                    <div className="p-4 md:p-5">

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">

                        {/* LEFT */}

                        <div className="flex-1 min-w-0">

                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) =>
                              openNotification(
                                e,
                                link
                              )
                            }
                            className="font-semibold text-gray-800 hover:text-cyan-600 transition-colors text-sm md:text-base"
                          >
                            {title}
                          </a>

                          {item.description && (
                            <p className="text-xs md:text-sm text-gray-500 mt-1">
                              {
                                item.description
                              }
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-3 mt-2">

                            <span className="text-xs text-gray-400">
                              Uploaded:{" "}
                              {formatDate(
                                date
                              )}
                            </span>

                            {item.active_date && (
                              <span className="text-xs text-gray-400">
                                Active date:{" "}
                                {formatDate(
                                  item.active_date
                                )}
                              </span>
                            )}

                          </div>

                        </div>

                        {/* STATUS */}

                        <div className="flex-shrink-0">

                          {active ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                              Inactive
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* ============================================================
            PAGINATION
        ============================================================ */}

        {!loading &&
          filteredNotifications.length >
            0 && (
            <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4">

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* PAGE INFO */}

                <div className="text-xs text-gray-500">
                  Page{" "}
                  <span className="font-semibold text-gray-700">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-gray-700">
                    {totalPages}
                  </span>
                </div>

                {/* BUTTONS */}

                <div className="flex items-center gap-1">

                  {/* PREVIOUS */}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      1
                    }
                    onClick={() =>
                      changePage(
                        currentPage -
                          1
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft
                      size={16}
                    />
                    <span className="hidden sm:inline">
                      Previous
                    </span>
                  </button>

                  {/* PAGE NUMBERS */}

                  {pageNumbers.map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          changePage(
                            page
                          )
                        }
                        className={`min-w-9 h-9 px-2 rounded-lg text-sm font-semibold transition-colors ${
                          currentPage ===
                          page
                            ? "bg-cyan-500 text-white"
                            : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}

                  {/* NEXT */}

                  <button
                    type="button"
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    onClick={() =>
                      changePage(
                        currentPage +
                          1
                      )
                    }
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="hidden sm:inline">
                      Next
                    </span>

                    <ChevronRight
                      size={16}
                    />
                  </button>

                </div>

              </div>

            </div>
          )}

        {/* ============================================================
            BACK BUTTON
        ============================================================ */}

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