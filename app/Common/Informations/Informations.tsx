import "./Informations.css";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { confirmExternalLink } from "~/utils/alert_utils";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";

export type InfoItem = {
  _id?: string;
  heading?: string;
  title?: string;

  File_name?: string;
  fileName?: string;

  pdf_link?: string;
  Links?: string;
  url?: string;

  description?: string;

  date?: string;
  active_date?: string;
  createdAt?: string;
  updatedAt?: string;

  type?: string;

  /*
   * Optional status fields.
   * These allow the All Notifications page
   * to identify active/inactive notifications
   * if your backend provides them.
   */
  active?: boolean;
  isActive?: boolean;
  status?: string;
};

/* ================================================================
   MAIN COMPONENT
================================================================ */

export default function Informations() {
  const [downloadData, setDownloadData] = useState<InfoItem[]>([]);
  const [informationData, setInformationData] = useState<InfoItem[]>([]);
  const [newsNotificationData, setNewsNotificationData] = useState<
    InfoItem[]
  >([]);

  const [loading, setLoading] = useState(true);

  /* ================================================================
     FETCH DATA
  ================================================================= */

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const [
          downloadResponse,
          informationResponse,
          notificationResponse,
        ] = await Promise.all([
          apiClient.get("/download"),
          apiClient.get("/information"),
          apiClient.get("/notification"),
        ]);

        const downloads =
          downloadResponse.data?.data ??
          downloadResponse.data ??
          [];

        const informations =
          informationResponse.data?.data ??
          informationResponse.data ??
          [];

        const notifications =
          notificationResponse.data?.data ??
          notificationResponse.data ??
          [];

        setDownloadData(
          Array.isArray(downloads) ? downloads : []
        );

        setInformationData(
          Array.isArray(informations)
            ? informations
            : []
        );

        setNewsNotificationData(
          Array.isArray(notifications)
            ? notifications
            : []
        );
      } catch (error) {
        setDownloadData([]);
        setInformationData([]);
        setNewsNotificationData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ================================================================
     ACTIVE NOTIFICATIONS
  ================================================================= */

  const activeNotifications = useMemo(() => {
    const now = Date.now();

    return newsNotificationData.filter((item) => {
      if (!item.active_date) {
        return true;
      }

      const activeDate = new Date(
        item.active_date
      ).getTime();

      if (Number.isNaN(activeDate)) {
        return true;
      }

      return activeDate >= now;
    });
  }, [newsNotificationData]);

  return (
    <div className="flex flex-wrap justify-around items-start w-full gap-4 m-2 border-t-2 border-y-neutral-500 pt-8">

      {/* ============================================================
          NEWS & NOTIFICATION
      ============================================================ */}

      <div className="flex-[1_1_300px] flex justify-center">
        <News_Notification
          data={activeNotifications}
          loading={loading}
        />
      </div>

      {/* ============================================================
          INFORMATION
      ============================================================ */}

      <div className="flex-[1_1_300px] flex justify-center">
        <Information
          data={informationData}
          loading={loading}
        />
      </div>

      {/* ============================================================
          DOWNLOAD
      ============================================================ */}

      <div className="flex-[1_1_300px] flex justify-center">
        <Download
          data={downloadData}
          loading={loading}
        />
      </div>
    </div>
  );
}

/* ================================================================
   HELPERS
================================================================ */

/**
 * Determine whether a URL is external.
 */
const isExternalLink = (url: string) => {
  try {
    const linkUrl = new URL(
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

/**
 * External link confirmation popup.
 */
const handleExternalClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
) => {
  if (!href || href === "#") {
    return;
  }

  if (!isExternalLink(href)) {
    return;
  }

  e.preventDefault();

  confirmExternalLink({
    title: "Leave this site?",
    text: "You are being redirected to an external website.",
    confirmButtonText: "Continue",
    cancelButtonText: "Stay here",

    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#dc2626",

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

/**
 * Resolve file/link.
 */
const resolveItemLink = (
  item: InfoItem,
  folder: string
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
    return `${API_BASE_URL}/uploads/${folder}/${item.fileName}`;
  }

  if (item.File_name) {
    return `${API_BASE_URL}/uploads/${folder}/${item.File_name}`;
  }

  return "#";
};

/**
 * Resolve title.
 */
const resolveItemTitle = (
  item: InfoItem
) => {
  return (
    item.heading ||
    item.title ||
    item.File_name ||
    item.fileName ||
    "Document Link"
  );
};

/**
 * Get the date used for NEW badge.
 */
const getItemDate = (
  item: InfoItem
) => {
  return (
    item.createdAt ||
    item.date ||
    item.active_date ||
    null
  );
};

/**
 * Notification is NEW when it was created
 * less than 10 days ago.
 */
const isNewNotification = (
  item: InfoItem
) => {
  const uploadDate =
    item.createdAt;

  if (!uploadDate) {
    return false;
  }

  const uploadedTime =
    new Date(uploadDate).getTime();

  if (Number.isNaN(uploadedTime)) {
    return false;
  }

  const now = Date.now();

  if (uploadedTime > now) {
    return false;
  }

  const TEN_DAYS =
    10 * 24 * 60 * 60 * 1000;

  const age =
    now - uploadedTime;

  return age < TEN_DAYS;
};

/* ================================================================
   DOWNLOAD
================================================================ */

function Download({
  data,
  loading,
}: {
  data: InfoItem[];
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-gray-400 rounded-br-2xl rounded-tl-2xl h-96 w-5/6 max-w-3xl bg-white shadow-xs">

      <div className="border-b-2 border-green-700 uppercase font-bold text-lg text-gray-700 pb-1">
        Download
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar">

        {loading ? (
          <p className="text-gray-400 text-xs italic">
            Loading downloads...
          </p>
        ) : data.length === 0 ? (
          <p className="text-gray-400 text-xs italic">
            No downloads available.
          </p>
        ) : (
          data.map((item, index) => {
            const link =
              resolveItemLink(
                item,
                "downloads"
              );

            const title =
              resolveItemTitle(item);

            return (
              <a
                key={
                  item._id ||
                  `${title}-${index}`
                }
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) =>
                  handleExternalClick(
                    e,
                    link
                  )
                }
                className="text-teal-950 font-semibold text-sm cursor-pointer hover:text-teal-700 transition-colors"
              >
                {title}
              </a>
            );
          })
        )}

      </div>
    </div>
  );
}

/* ================================================================
   INFORMATION
================================================================ */

function Information({
  data,
  loading,
}: {
  data: InfoItem[];
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-gray-400 rounded-br-2xl rounded-tl-2xl h-96 w-5/6 max-w-3xl bg-white shadow-xs">

      <div className="border-b-2 border-green-700 uppercase font-bold text-lg text-gray-700 pb-1">
        Information
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto hide-scrollbar">

        {loading ? (
          <p className="text-gray-400 text-xs italic">
            Loading information...
          </p>
        ) : data.length === 0 ? (
          <p className="text-gray-400 text-xs italic">
            No information documents available.
          </p>
        ) : (
          data.map((item, index) => {
            const link =
              resolveItemLink(
                item,
                "informations"
              );

            const title =
              resolveItemTitle(item);

            return (
              <a
                key={
                  item._id ||
                  `${title}-${index}`
                }
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) =>
                  handleExternalClick(
                    e,
                    link
                  )
                }
                className="text-teal-950 font-semibold text-sm cursor-pointer hover:text-teal-700 transition-colors"
              >
                {title}
              </a>
            );
          })
        )}

      </div>
    </div>
  );
}

/* ================================================================
   NEWS & NOTIFICATION
================================================================ */

function News_Notification({
  data,
  loading,
}: {
  data: InfoItem[];
  loading: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 p-4 border-2 border-gray-400 rounded-br-2xl rounded-tl-2xl h-96 w-5/6 max-w-3xl bg-white shadow-xs">

      {/* HEADER */}

      <div className="border-b-2 border-green-700 uppercase font-bold text-lg text-gray-700 pb-1">
        News & Notification
      </div>

      {/* MARQUEE */}

      <div className="h-64 overflow-hidden relative">

        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-xs italic">
              Loading notifications...
            </p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400 text-xs italic">
              No notifications currently posted.
            </p>
          </div>
        ) : (
          <div
            className={`notification-marquee ${
              data.length === 1
                ? "notification-marquee-single"
                : ""
            }`}
          >
            {data.map(
              (item, index) => {
                const link =
                  resolveItemLink(
                    item,
                    "notifications"
                  );

                const title =
                  resolveItemTitle(item);

                const isNew =
                  isNewNotification(
                    item
                  );

                return (
                  <div
                    key={
                      item._id ||
                      `${title}-${index}`
                    }
                    className="notification-item"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) =>
                        handleExternalClick(
                          e,
                          link
                        )
                      }
                      className="notification-link"
                    >
                      <span>
                        {title}
                      </span>

                      {isNew && (
                        <span className="notification-new">
                          NEW
                        </span>
                      )}
                    </a>
                  </div>
                );
              }
            )}
          </div>
        )}

      </div>

      {/* ============================================================
          VIEW ALL BUTTON
      ============================================================ */}

      <div className="mt-auto flex justify-center">

        <Link
          to="/all-notifications"
          state={{
            notifications: data,
          }}
          className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-rose-700 text-white text-sm font-semibold shadow hover:bg-rose-800 hover:shadow-md transition-all duration-200"
        >
          View All Notifications
        </Link>

      </div>
    </div>
  );
}
