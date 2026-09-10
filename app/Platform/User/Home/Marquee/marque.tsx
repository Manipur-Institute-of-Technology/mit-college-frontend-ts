import {
  useEffect,
  useState,
  type MouseEvent,
} from "react";

import "./marque.css"

import apiClient from "~/utils/apiClient";
import { confirmExternalLink } from "~/utils/alert_utils";

interface InfoItem {
  _id: string;
  fileName: string;
  title: string;
  type:
    | "exam"
    | "admission"
    | "form fillup"
    | "miscellaneous";
  submittedBy: string;
  active_date: string;
  createdAt: string;
  updatedAt: string;
}

const TEN_DAYS =
  10 * 24 * 60 * 60 * 1000;

export default function NewNotificationMarquee() {
  const [notifications, setNotifications] =
    useState<InfoItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchNotifications =
      async () => {
        try {
          setLoading(true);

          const response =
            await apiClient.get(
              "/notification"
            );

          const data =
            response.data?.data ??
            response.data ??
            [];

          if (!Array.isArray(data)) {
            setNotifications([]);
            return;
          }

          const now = Date.now();

          const newNotifications =
            data.filter(
              (item: InfoItem) => {
                if (!item.createdAt) {
                  return false;
                }

                const createdTime =
                  new Date(
                    item.createdAt
                  ).getTime();

                if (
                  Number.isNaN(
                    createdTime
                  )
                ) {
                  return false;
                }

                // Ignore future dates
                if (
                  createdTime > now
                ) {
                  return false;
                }

                const age =
                  now - createdTime;

                // Only notifications
                // created within 10 days
                return (
                  age < TEN_DAYS
                );
              }
            );

          setNotifications(
            newNotifications
          );
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
    url: string
    ) => {
    if (!url || url === "#") {
        return;
    }

    try {
        const parsedUrl = new URL(
        url,
        window.location.origin
        );

        const isExternal =
        parsedUrl.origin !== window.location.origin;

        if (!isExternal) {
        return;
        }

        event.preventDefault();

        const confirmed = await confirmExternalLink({
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        customClass: {
            popup: "rounded-xl",
        },
        });

        if (!confirmed) {
        return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
    } catch {
        // Invalid URL
    }
    };

    return (
    <div className="w-full overflow-hidden bg-red-600 px-2 py-2 rounded-lg">
    {loading ? (
        <div className="text-sm text-white">
        Loading...
        </div>
    ) : notifications.length === 0 ? (
        <div className="text-sm text-white">
        No new notifications.
        </div>
    ) : (
        <div className="notification-horizontal-wrapper">
        <div className="notification-horizontal-marquee">
            {notifications.map((item) => {
            const link = item.fileName;

            return (
                <div>
                    <a
                    key={item._id}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) =>
                        handleExternalClick(event, link)
                    }
                    className="inline-flex items-center whitespace-nowrap text-white"
                    >
                    <span className="font-medium">
                        {item.title}
                    </span>
                    </a>
                    <span className="mx-8 text-white">
                        |
                    </span>
                </div>
            );
            })}
        </div>
        </div>
    )}
    </div>
    );
}
