import { useEffect, useState } from "react";
import Informations from "~/Common/Informations/Informations";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  ExternalLink,
  User,
  Building,
  Globe,
  Mail,
  Phone,
  Paperclip,
  Bookmark,
  Sparkles,
  Layers,
} from "lucide-react";
import {
  confirmExternalLink,
  showAlert,
} from "~/utils/alert_utils";

// ============================================================
// TYPES
// ============================================================

export type AttachmentOrLink = {
  id: number | string;
  title: string;
  url: string;
};

export type AicteVaaniContact = {
  coordinator?: string;
  coCoordinator?: string;
  department?: string;
  website?: string;
  email?: string;
  phone?: string;
};

export type AicteVaaniItem = {
  _id: string;
  header: string;
  topic: string;
  dates: string;
  time: string;
  venue: string;
  information: string;
  contact: AicteVaaniContact;
  attachments: AttachmentOrLink[];
  extraLinks: AttachmentOrLink[];
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
};

// ============================================================
// HELPERS
// ============================================================

const isExternalLink = (url: string) => {
  try {
    const target = new URL(url, window.location.origin);
    return target.origin !== window.location.origin;
  } catch {
    return false;
  }
};

const getResourceUrl = (url: string) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  if (url.startsWith("/")) {
    return `${API_BASE_URL}${url}`;
  }

  return `${API_BASE_URL}/${url}`;
};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function AicteVaaniPage() {
  const [items, setItems] = useState<AicteVaaniItem[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // FETCH AICTE-VAANI
  // ============================================================

  useEffect(() => {
    const fetchAicteVaani = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiClient.get("/aicte-vaani");

        const data = response.data?.data;

        const fetchedItems: AicteVaaniItem[] = Array.isArray(data)
          ? data
          : [];

        // --------------------------------------------------------
        // Sort latest event first
        // --------------------------------------------------------

        const sortedItems = [...fetchedItems].sort((a, b) => {
          const dateA = new Date(
            a.updatedAt || a.createdAt || 0
          ).getTime();

          const dateB = new Date(
            b.updatedAt || b.createdAt || 0
          ).getTime();

          return dateB - dateA;
        });

        setItems(sortedItems);

        // --------------------------------------------------------
        // Automatically select the latest event
        // --------------------------------------------------------

        if (sortedItems.length > 0) {
          setSelectedId(sortedItems[0]._id);
        } else {
          setSelectedId("");
        }
      } catch (err) {
        console.error("Failed to fetch AICTE-VAANI:", err);
        setError("Unable to load AICTE-VAANI information.");
      } finally {
        setLoading(false);
      }
    };

    fetchAicteVaani();
  }, []);

  // ============================================================
  // SELECTED EVENT
  // ============================================================

  const currentItem =
    items.find((item) => item._id === selectedId) ||
    items[0] ||
    null;

  const isInactive = currentItem?.status === "Inactive";

  // ============================================================
  // LINK HANDLER
  // ============================================================

  const handleLinkClick = async (
    url: string,
    inactive = false
  ) => {
    if (!url || url === "#") {
      return;
    }

    // ----------------------------------------------------------
    // Inactive event
    // ----------------------------------------------------------

    if (inactive) {
      await showAlert({
        title: "Event Has Ended",
        text: "This AICTE-VAANI event is no longer active. The event period has ended and its resources are currently unavailable.",
        icon: "info",
        confirmButtonColor: "#0891b2",
      });

      return;
    }

    // ----------------------------------------------------------
    // External link
    // ----------------------------------------------------------

    if (isExternalLink(url)) {
      const confirmed = await confirmExternalLink({
        title: "Leave this site?",
        text: "You are being redirected to an external document / website.",
        confirmButtonText: "Continue",
        cancelButtonText: "Stay here",
        confirmButtonColor: "#22c55e",
        cancelButtonColor: "#ef4444",
        customClass: {
          popup: "rounded-xl",
        },
      });

      if (confirmed) {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
      }

      return;
    }

    // ----------------------------------------------------------
    // Same-origin / backend resource
    // ----------------------------------------------------------

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ============================================================
  // EVENT CARD
  // ============================================================

  const EventCard = ({
    event,
    inactive = false,
  }: {
    event: AicteVaaniItem;
    inactive?: boolean;
  }) => {
    return (
      <div
        className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
          inactive
            ? "border-gray-300 bg-gray-100 opacity-75"
            : "border-gray-200 bg-white shadow-sm"
        }`}
      >
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div
          className={`px-6 py-5 border-b ${
            inactive
              ? "bg-gray-200 border-gray-300"
              : "bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-100"
          }`}
        >
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2.5 rounded-xl ${
                    inactive
                      ? "bg-gray-300 text-gray-500"
                      : "bg-cyan-100 text-cyan-700"
                  }`}
                >
                  <Sparkles size={22} />
                </div>

                <div>
                  <h2
                    className={`text-xl md:text-2xl font-bold ${
                      inactive
                        ? "text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {event.header}
                  </h2>

                  {event.topic && (
                    <p
                      className={`mt-1 font-medium ${
                        inactive
                          ? "text-gray-500"
                          : "text-cyan-700"
                      }`}
                    >
                      {event.topic}
                    </p>
                  )}
                </div>
              </div>

              {/* ==================================================
                  STATUS BADGE
              ================================================== */}

              <span
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  inactive
                    ? "bg-gray-400 text-white"
                    : "bg-green-100 text-green-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    inactive
                      ? "bg-white"
                      : "bg-green-500"
                  }`}
                />

                {inactive ? "Inactive" : "Active"}
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================
            EVENT DETAILS
        ====================================================== */}

        <div
          className={`p-6 ${
            inactive
              ? "text-gray-500"
              : "text-gray-700"
          }`}
        >
          {/* ====================================================
              DATE / TIME / VENUE
          ==================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Date */}

            <div
              className={`flex items-start gap-3 p-4 rounded-xl ${
                inactive
                  ? "bg-gray-200"
                  : "bg-gray-50"
              }`}
            >
              <Calendar
                size={20}
                className={
                  inactive
                    ? "text-gray-400"
                    : "text-cyan-600"
                }
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Date
                </p>

                <p
                  className={`mt-1 font-medium ${
                    inactive
                      ? "text-gray-500"
                      : "text-gray-700"
                  }`}
                >
                  {event.dates || "—"}
                </p>
              </div>
            </div>

            {/* Time */}

            <div
              className={`flex items-start gap-3 p-4 rounded-xl ${
                inactive
                  ? "bg-gray-200"
                  : "bg-gray-50"
              }`}
            >
              <Clock
                size={20}
                className={
                  inactive
                    ? "text-gray-400"
                    : "text-cyan-600"
                }
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Time
                </p>

                <p
                  className={`mt-1 font-medium ${
                    inactive
                      ? "text-gray-500"
                      : "text-gray-700"
                  }`}
                >
                  {event.time || "—"}
                </p>
              </div>
            </div>

            {/* Venue */}

            <div
              className={`flex items-start gap-3 p-4 rounded-xl ${
                inactive
                  ? "bg-gray-200"
                  : "bg-gray-50"
              }`}
            >
              <MapPin
                size={20}
                className={
                  inactive
                    ? "text-gray-400"
                    : "text-cyan-600"
                }
              />

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Venue
                </p>

                <p
                  className={`mt-1 font-medium ${
                    inactive
                      ? "text-gray-500"
                      : "text-gray-700"
                  }`}
                >
                  {event.venue || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* ====================================================
              INFORMATION
          ==================================================== */}

          {event.information && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Layers
                  size={20}
                  className={
                    inactive
                      ? "text-gray-400"
                      : "text-cyan-600"
                  }
                />

                <h3
                  className={`text-lg font-bold ${
                    inactive
                      ? "text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  Information
                </h3>
              </div>

              <div
                className={`rounded-xl p-5 leading-relaxed whitespace-pre-line ${
                  inactive
                    ? "bg-gray-200 text-gray-500"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                {event.information}
              </div>
            </div>
          )}

          {/* ====================================================
              ATTACHMENTS
          ==================================================== */}

          {event.attachments?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Paperclip
                  size={20}
                  className={
                    inactive
                      ? "text-gray-400"
                      : "text-cyan-600"
                  }
                />

                <h3
                  className={`text-lg font-bold ${
                    inactive
                      ? "text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  Attachments
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.attachments.map((attachment) => {
                  const url = getResourceUrl(
                    attachment.url
                  );

                  return (
                    <button
                      key={attachment.id}
                      type="button"
                      onClick={() =>
                        handleLinkClick(
                          url,
                          inactive
                        )
                      }
                      className={`group flex items-center justify-between gap-3 p-4 rounded-xl border text-left transition ${
                        inactive
                          ? "bg-gray-200 border-gray-300 text-gray-500 cursor-pointer"
                          : "bg-white border-gray-200 hover:border-cyan-300 hover:bg-cyan-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText
                          size={20}
                          className={
                            inactive
                              ? "text-gray-400"
                              : "text-cyan-600"
                          }
                        />

                        <span className="font-medium truncate">
                          {attachment.title}
                        </span>
                      </div>

                      <ExternalLink
                        size={17}
                        className="shrink-0"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================
              IMPORTANT LINKS
          ==================================================== */}

          {event.extraLinks?.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Bookmark
                  size={20}
                  className={
                    inactive
                      ? "text-gray-400"
                      : "text-cyan-600"
                  }
                />

                <h3
                  className={`text-lg font-bold ${
                    inactive
                      ? "text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  Important Links
                </h3>
              </div>

              <div className="flex flex-wrap gap-3">
                {event.extraLinks.map((link) => {
                  const url = getResourceUrl(link.url);

                  return (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() =>
                        handleLinkClick(
                          url,
                          inactive
                        )
                      }
                      className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition ${
                        inactive
                          ? "bg-gray-300 text-gray-500"
                          : "bg-cyan-50 text-cyan-700 hover:bg-cyan-100"
                      }`}
                    >
                      {link.title}

                      <ExternalLink size={16} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ====================================================
              CONTACT
          ==================================================== */}

          {event.contact && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <User
                  size={20}
                  className={
                    inactive
                      ? "text-gray-400"
                      : "text-cyan-600"
                  }
                />

                <h3
                  className={`text-lg font-bold ${
                    inactive
                      ? "text-gray-500"
                      : "text-gray-800"
                  }`}
                >
                  Contact Information
                </h3>
              </div>

              <div
                className={`rounded-xl p-5 ${
                  inactive
                    ? "bg-gray-200"
                    : "bg-gray-50"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Coordinator */}

                  {event.contact.coordinator && (
                    <div className="flex items-start gap-3">
                      <User
                        size={18}
                        className={
                          inactive
                            ? "text-gray-400"
                            : "text-cyan-600"
                        }
                      />

                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Coordinator
                        </p>

                        <p
                          className={
                            inactive
                              ? "text-gray-500"
                              : "text-gray-700"
                          }
                        >
                          {event.contact.coordinator}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Co-Coordinator */}

                  {event.contact.coCoordinator && (
                    <div className="flex items-start gap-3">
                      <User
                        size={18}
                        className={
                          inactive
                            ? "text-gray-400"
                            : "text-cyan-600"
                        }
                      />

                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Co-Coordinator
                        </p>

                        <p
                          className={
                            inactive
                              ? "text-gray-500"
                              : "text-gray-700"
                          }
                        >
                          {event.contact.coCoordinator}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Department */}

                  {event.contact.department && (
                    <div className="flex items-start gap-3">
                      <Building
                        size={18}
                        className={
                          inactive
                            ? "text-gray-400"
                            : "text-cyan-600"
                        }
                      />

                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Department
                        </p>

                        <p
                          className={
                            inactive
                              ? "text-gray-500"
                              : "text-gray-700"
                          }
                        >
                          {event.contact.department}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Website */}

                  {event.contact.website && (
                    <div className="flex items-start gap-3">
                      <Globe
                        size={18}
                        className={
                          inactive
                            ? "text-gray-400"
                            : "text-cyan-600"
                        }
                      />

                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Website
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            handleLinkClick(
                              getResourceUrl(
                                event.contact
                                  .website || ""
                              ),
                              inactive
                            )
                          }
                          className={`font-medium break-all text-left ${
                            inactive
                              ? "text-gray-500"
                              : "text-cyan-700 hover:underline"
                          }`}
                        >
                          {event.contact.website}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Email */}

                  {event.contact.email && (
                    <div className="flex items-start gap-3">
                      <Mail
                        size={18}
                        className={
                          inactive
                            ? "text-gray-400"
                            : "text-cyan-600"
                        }
                      />

                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Email
                        </p>

                        <a
                          href={`mailto:${event.contact.email}`}
                          className={
                            inactive
                              ? "text-gray-500"
                              : "text-cyan-700 hover:underline"
                          }
                        >
                          {event.contact.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone */}

                  {event.contact.phone && (
                    <div className="flex items-start gap-3">
                      <Phone
                        size={18}
                        className={
                          inactive
                            ? "text-gray-400"
                            : "text-cyan-600"
                        }
                      />

                      <div>
                        <p className="text-xs text-gray-400 font-semibold uppercase">
                          Phone
                        </p>

                        <a
                          href={`tel:${event.contact.phone}`}
                          className={
                            inactive
                              ? "text-gray-500"
                              : "text-cyan-700 hover:underline"
                          }
                        >
                          {event.contact.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-white">
      {/* ========================================================
          PAGE HEADER
      ======================================================== */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* ======================================================
            LOADING
        ====================================================== */}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-cyan-200 border-t-cyan-600" />
          </div>
        )}

        {/* ======================================================
            ERROR
        ====================================================== */}

        {!loading && error && (
          <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 p-5 text-center">
            {error}
          </div>
        )}

        {/* ======================================================
            NO DATA
        ====================================================== */}

        {!loading && !error && items.length === 0 && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-10 text-center">
            <Sparkles
              size={40}
              className="mx-auto text-gray-400 mb-3"
            />

            <h2 className="text-lg font-semibold text-gray-700">
              No AICTE-VAANI events available
            </h2>

            <p className="text-gray-500 mt-1">
              Please check again later.
            </p>
          </div>
        )}

        {/* ======================================================
            EVENT SELECTION
        ====================================================== */}

        {!loading && !error && items.length > 0 && (
          <>
            <div className="mb-6">
              <label
                htmlFor="aicte-vaani-event"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Select AICTE-VAANI Event
              </label>

              <div className="relative">
                <select
                  id="aicte-vaani-event"
                  value={selectedId}
                  onChange={(e) =>
                    setSelectedId(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3.5 pr-10 text-gray-700 font-medium shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                >
                  {items.map((item) => {
                    const inactive =
                      item.status === "Inactive";

                    return (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.topic ||
                          item.header ||
                          "AICTE-VAANI Event"}
                        {inactive
                          ? " (Inactive)"
                          : ""}
                      </option>
                    );
                  })}
                </select>

                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ==================================================
                SELECTED EVENT
            ================================================== */}

            {currentItem && (
              <EventCard
                event={currentItem}
                inactive={isInactive}
              />
            )}
          </>
        )}
      </div>
      <Informations/>
    </div>
  );
}