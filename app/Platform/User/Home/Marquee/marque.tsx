import {
  useEffect,
  useState,
  type MouseEvent,
} from "react";

import "./marque.css";

import apiClient, { API_BASE_URL } from "~/utils/apiClient";
import { confirmExternalLink } from "~/utils/alert_utils";

interface InfoItem {
  _id: string;
  fileName?: string;
  File_name?: string;
  title?: string;
  heading?: string;
  pdf_link?: string;
  Links?: string;
  url?: string;
  link?: string;
  type?:
    | "exam"
    | "admission"
    | "form fillup"
    | "miscellaneous";
  submittedBy?: string;
  active_date?: string;
  createdAt?: string;
  updatedAt?: string;
}

const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;

/**
 * Resolve the notification's PDF/document URL.
 * The optional external advertisement link is stored separately in item.link.
 */
const resolveNotificationPdfLink = (item: InfoItem): string => {
  const pdf = item.pdf_link || item.fileName || item.File_name;

  if (!pdf || pdf === "#") {
    return "#";
  }

  // Keep complete HTTP(S) URLs and root-relative paths unchanged.
  if (/^https?:\/\//i.test(pdf) || pdf.startsWith("/")) {
    return pdf;
  }

  // Build the upload URL when the API returns only a filename.
  return `${API_BASE_URL}/uploads/notifications/${pdf}`;
};

export default function NewNotificationMarquee() {
  const [notifications, setNotifications] = useState<InfoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get("/notification");
        const data = response.data?.data ?? response.data ?? [];

        if (!Array.isArray(data)) {
          setNotifications([]);
          return;
        }

        const now = Date.now();

        const newNotifications = data.filter((item: InfoItem) => {
          if (!item.createdAt) {
            return false;
          }

          const createdTime = new Date(item.createdAt).getTime();

          if (Number.isNaN(createdTime) || createdTime > now) {
            return false;
          }

          return now - createdTime < TEN_DAYS;
        });

        setNotifications(newNotifications);
      } catch {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleExternalClick = async (
    event: MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (!href || href === "#") {
      event.preventDefault();

      await confirmExternalLink({
        title: "Link unavailable",
        text: "This notification does not have a valid download link.",
        confirmButtonText: "OK",
        confirmButtonColor: "#22c55e",
        customClass: {
          popup: "rounded-xl",
        },
      });

      return;
    }

    try {
      const parsedUrl = new URL(href, window.location.origin);

      // Allow only HTTP and HTTPS destinations.
      if (
        parsedUrl.protocol !== "http:" &&
        parsedUrl.protocol !== "https:"
      ) {
        event.preventDefault();

        await confirmExternalLink({
          title: "Invalid link",
          text: "This notification contains an unsupported link.",
          confirmButtonText: "OK",
          confirmButtonColor: "#22c55e",
          customClass: {
            popup: "rounded-xl",
          },
        });

        return;
      }

      const isExternal = parsedUrl.origin !== window.location.origin;

      // Internal links open normally in the new tab.
      if (!isExternal) {
        return;
      }

      // Stop default navigation until the user confirms.
      event.preventDefault();

      const confirmed = await confirmExternalLink({
        title: "Leave this website?",
        text: "This notification links to an external website. Do you want to continue?",
        confirmButtonText: "Continue",
        cancelButtonText: "Stay here",
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-xl",
        },
      });

      if (confirmed) {
        window.open(parsedUrl.href, "_blank", "noopener,noreferrer");
      }
    } catch {
      event.preventDefault();

      await confirmExternalLink({
        title: "Invalid link",
        text: "Unable to open this notification link.",
        confirmButtonText: "OK",
        confirmButtonColor: "#22c55e",
        customClass: {
          popup: "rounded-xl",
        },
      });
    }
  };

  return (
    <div className="w-full overflow-hidden bg-cyan-600 px-2 py-2 rounded-lg">
      {loading ? (
        <div className="text-sm text-white">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-sm text-white">No new notifications.</div>
      ) : (
        <div className="notification-horizontal-wrapper">
          <div className="notification-horizontal-marquee">
            {notifications.map((item) => {
              // The title opens the PDF/document.
              const pdfLink = resolveNotificationPdfLink(item);

              // The optional external link is stored in item.link.
              const externalLink = item.link?.trim() || "";
              const hasExternalLink = Boolean(
                externalLink && externalLink !== "#"
              );

              const title =
                item.title || item.heading || "View notification";

              return (
                <div
                  key={item._id}
                  className="inline-flex items-center"
                >
                  <a
                    href={pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) =>
                      handleExternalClick(event, pdfLink)
                    }
                    className="font-medium text-white whitespace-nowrap hover:underline cursor-pointer"
                  >
                    {title}
                  </a>

                  {hasExternalLink && (
                    <a
                      href={externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) =>
                        handleExternalClick(event, externalLink)
                      }
                      className="inline-flex items-center ml-3 px-3 py-1 rounded-full bg-white text-cyan-700 text-xs font-semibold hover:bg-cyan-50 transition-colors whitespace-nowrap"
                    >
                      View Link
                    </a>
                  )}

                  <span className="mx-8 text-white">|</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
