import { useEffect, useState } from "react";

import Informations from "~/Common/Informations/Informations";

import apiClient, {
  API_BASE_URL,
} from "~/utils/apiClient";

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

import { confirmExternalLink } from "~/utils/alert_utils";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── External Link Helper ─────────────────────────────────────────────────────

const isExternalLink = (url: string) => {
  try {
    const linkUrl = new URL(url, window.location.origin);

    return (
      linkUrl.origin !==
      window.location.origin
    );
  } catch {
    return false;
  }
};

// ─── Open Link / File ─────────────────────────────────────────────────────────

const handleLinkClick = (url: string) => {
  if (!url || url === "#") {
    return;
  }

  if (isExternalLink(url)) {
    confirmExternalLink({
      title: "Leave this site?",
      text: "You are being redirected to an external document / website.",
      confirmButtonText: "Continue",
      cancelButtonText: "Stay here",
      confirmButtonColor: "#0891b2",
      cancelButtonColor: "#ef4444",
      customClass: {
        popup: "rounded-xl",
      },
    }).then((confirmed) => {
      if (confirmed) {
        window.open(
          url,
          "_blank",
          "noopener,noreferrer"
        );
      }
    });
  } else {
    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }
};

// ─── Resource URL Helper ──────────────────────────────────────────────────────

const getResourceUrl = (
  url: string
): string => {
  if (!url) {
    return "";
  }

  // Already absolute URL
  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  // Protocol-relative URL
  if (url.startsWith("//")) {
    return `https:${url}`;
  }

  // Relative URL
  if (url.startsWith("/")) {
    return `${API_BASE_URL}${url}`;
  }

  return `${API_BASE_URL}/${url}`;
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AicteVaani() {
  const [items, setItems] =
    useState<AicteVaaniItem[]>([]);

  const [selectedId, setSelectedId] =
    useState<string>("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string>("");

  // ────────────────────────────────────────────────────────────────────────────
  // FETCH AICTE-VAANI DATA
  // ────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    const fetchAicteVaani =
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await apiClient.get(
              "/aicte-vaani"
            );

          if (!mounted) {
            return;
          }

          const data =
            response.data?.data;

          const fetchedItems: AicteVaaniItem[] =
            Array.isArray(data)
              ? data
              : [];

          // Only show Active records publicly
          const activeItems =
            fetchedItems.filter(
              (item) =>
                item.status !==
                "Inactive"
            );

          setItems(
            activeItems
          );

          if (
            activeItems.length >
            0
          ) {
            setSelectedId(
              activeItems[0]._id
            );
          } else {
            setSelectedId("");
          }
        } catch (err: any) {
          if (!mounted) {
            return;
          }

          const message =
            err?.response?.data
              ?.error ||
            err?.response?.data
              ?.message ||
            err?.message ||
            "Failed to fetch AICTE-VAANI events.";

          setError(message);
          setItems([]);
          setSelectedId("");
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    fetchAicteVaani();

    return () => {
      mounted = false;
    };
  }, []);

  // ────────────────────────────────────────────────────────────────────────────
  // CURRENT ITEM
  // ────────────────────────────────────────────────────────────────────────────

  const currentItem =
    items.find(
      (item) =>
        item._id === selectedId
    ) ||
    items[0] ||
    null;

  // ────────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-12">

        {/* ================================================================
            PAGE BANNER
        ================================================================ */}

        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-b-2 border-cyan-600 text-white text-center shadow-sm">
          AICTE-VAANI
        </div>

        {/* ================================================================
            EVENT SELECTOR
        ================================================================ */}

        {!loading &&
          items.length > 1 && (
            <div className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm">

              <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">

                  <Layers className="w-4 h-4 text-cyan-600" />

                  <span>
                    Select Workshop / Event:
                  </span>

                </div>

                <select
                  id="vaani-select"
                  value={
                    selectedId
                  }
                  onChange={(e) =>
                    setSelectedId(
                      e.target.value
                    )
                  }
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyan-500 focus:outline-none max-w-full sm:max-w-md truncate cursor-pointer"
                >
                  <option value="all">
                    View All Events (
                    {items.length}
                    )
                  </option>

                  {items.map(
                    (
                      event,
                      index
                    ) => (
                      <option
                        key={
                          event._id
                        }
                        value={
                          event._id
                        }
                      >
                        {index + 1}.{" "}
                        {
                          event.topic
                        }
                      </option>
                    )
                  )}
                </select>

              </div>

            </div>
          )}

        {/* ================================================================
            CONTENT
        ================================================================ */}

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

          {/* LOADING */}

          {loading && (
            <div className="text-center py-16">

              <div className="inline-flex items-center gap-3 text-gray-500 font-medium">

                <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />

                Loading AICTE-VAANI details...

              </div>

            </div>
          )}

          {/* ERROR */}

          {!loading &&
            error && (
              <div className="bg-white rounded-xl border border-red-200 p-8 text-center">

                <FileText className="w-10 h-10 mx-auto text-red-300" />

                <h3 className="font-semibold text-gray-800 mt-4">
                  Unable to load AICTE-VAANI
                </h3>

                <p className="text-sm text-red-500 mt-2">
                  {error}
                </p>

              </div>
            )}

          {/* NO DATA */}

          {!loading &&
            !error &&
            items.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">

                <FileText className="w-10 h-10 mx-auto text-gray-300" />

                <h3 className="font-semibold text-gray-700 mt-4">
                  No AICTE-VAANI events listed currently.
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  Please check back later for upcoming events.
                </p>

              </div>
            )}

          {/* ALL EVENTS */}

          {!loading &&
            !error &&
            items.length > 0 &&
            selectedId ===
              "all" &&
            items.map(
              (event) => (
                <EventCard
                  key={
                    event._id
                  }
                  event={
                    event
                  }
                />
              )
            )}

          {/* SELECTED EVENT */}

          {!loading &&
            !error &&
            items.length > 0 &&
            selectedId !==
              "all" &&
            currentItem && (
              <EventCard
                event={
                  currentItem
                }
              />
            )}

        </div>
      </div>

      <Informations />
    </>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────

function EventCard({
  event,
}: {
  event: AicteVaaniItem;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">

      {/* ================================================================
          HEADER & TOPIC
      ================================================================ */}

      <div className="space-y-3">

        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-bold uppercase tracking-wider">

          <Sparkles className="w-3.5 h-3.5" />

          {event.header ||
            "AICTE-VAANI WORKSHOP"}

        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
          {event.topic}
        </h1>

      </div>

      {/* ================================================================
          EVENT INFORMATION BAR
      ================================================================ */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-cyan-50/70 border border-cyan-100 rounded-xl p-4 text-sm">

        {/* DATE */}

        <div className="flex items-center gap-3">

          <Calendar className="w-5 h-5 text-cyan-600 flex-shrink-0" />

          <div>

            <span className="text-xs text-gray-500 uppercase font-semibold block">
              Dates
            </span>

            <span className="font-semibold text-gray-800">
              {event.dates ||
                "-"}
            </span>

          </div>

        </div>

        {/* TIME */}

        <div className="flex items-center gap-3">

          <Clock className="w-5 h-5 text-cyan-600 flex-shrink-0" />

          <div>

            <span className="text-xs text-gray-500 uppercase font-semibold block">
              Time
            </span>

            <span className="font-semibold text-gray-800">
              {event.time ||
                "-"}
            </span>

          </div>

        </div>

        {/* VENUE */}

        <div className="flex items-center gap-3">

          <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0" />

          <div>

            <span className="text-xs text-gray-500 uppercase font-semibold block">
              Venue
            </span>

            <span className="font-semibold text-gray-800">
              {event.venue ||
                "-"}
            </span>

          </div>

        </div>

      </div>

      {/* ================================================================
          DETAILED INFORMATION
      ================================================================ */}

      {event.information && (
        <div className="space-y-3 pt-2">

          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">

            <FileText className="w-5 h-5 text-cyan-600" />

            About the Event

          </h2>

          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {event.information}
          </div>

        </div>
      )}

      {/* ================================================================
          ATTACHMENTS
      ================================================================ */}

      {Array.isArray(
        event.attachments
      ) &&
        event.attachments
          .length > 0 && (
          <div className="space-y-3 pt-2">

            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">

              <Paperclip className="w-5 h-5 text-cyan-600" />

              Attachments

            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

              {event.attachments.map(
                (
                  attachment,
                  index
                ) => {

                  const url =
                    getResourceUrl(
                      attachment.url
                    );

                  return (
                    <button
                      key={
                        attachment.id ||
                        index
                      }
                      type="button"
                      onClick={() =>
                        handleLinkClick(
                          url
                        )
                      }
                      className="flex items-center justify-between gap-3 p-4 bg-gray-50 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-300 rounded-xl transition-all text-left group"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <FileText className="w-5 h-5 text-cyan-600 group-hover:scale-110 transition-transform flex-shrink-0" />

                        <span className="text-sm font-semibold text-gray-800 group-hover:text-cyan-800 truncate">
                          {
                            attachment.title
                          }
                        </span>

                      </div>

                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-cyan-600 flex-shrink-0" />

                    </button>
                  );
                }
              )}

            </div>

          </div>
        )}

      {/* ================================================================
          IMPORTANT LINKS
      ================================================================ */}

      {Array.isArray(
        event.extraLinks
      ) &&
        event.extraLinks
          .length > 0 && (
          <div className="space-y-3 pt-2">

            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2 border-b pb-2">

              <Bookmark className="w-5 h-5 text-cyan-600" />

              Important Links

            </h2>

            <div className="space-y-2">

              {event.extraLinks.map(
                (
                  link,
                  index
                ) => {

                  const url =
                    getResourceUrl(
                      link.url
                    );

                  return (
                    <button
                      key={
                        link.id ||
                        index
                      }
                      type="button"
                      onClick={() =>
                        handleLinkClick(
                          url
                        )
                      }
                      className="w-full flex items-center justify-between gap-3 p-3 bg-white hover:bg-cyan-50 border border-gray-200 hover:border-cyan-300 rounded-xl transition-all text-left group"
                    >

                      <span className="text-sm font-semibold text-cyan-700 group-hover:underline truncate">
                        {
                          link.title
                        }
                      </span>

                      <ExternalLink className="w-4 h-4 text-cyan-600 flex-shrink-0" />

                    </button>
                  );
                }
              )}

            </div>

          </div>
        )}

      {/* ================================================================
          CONTACT INFORMATION
      ================================================================ */}

      {event.contact && (
        <div className="space-y-3 pt-4 border-t border-gray-200 bg-gray-50/60 rounded-xl p-5">

          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">

            <User className="w-5 h-5 text-cyan-600" />

            Contact Details

          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-700">

            {/* COORDINATOR */}

            {event.contact
              .coordinator && (
              <div>

                <span className="font-bold text-gray-900 block">
                  Coordinator:
                </span>

                <span>
                  {
                    event
                      .contact
                      .coordinator
                  }
                </span>

              </div>
            )}

            {/* CO-COORDINATOR */}

            {event.contact
              .coCoordinator && (
              <div>

                <span className="font-bold text-gray-900 block">
                  Co-Coordinator:
                </span>

                <span>
                  {
                    event
                      .contact
                      .coCoordinator
                  }
                </span>

              </div>
            )}

            {/* DEPARTMENT */}

            {event.contact
              .department && (
              <div className="flex items-center gap-2">

                <Building className="w-4 h-4 text-cyan-600 flex-shrink-0" />

                <span>
                  {
                    event
                      .contact
                      .department
                  }
                </span>

              </div>
            )}

            {/* PHONE */}

            {event.contact
              .phone && (
              <div className="flex items-center gap-2">

                <Phone className="w-4 h-4 text-cyan-600 flex-shrink-0" />

                <a
                  href={`tel:${event.contact.phone}`}
                  className="hover:underline"
                >
                  {
                    event
                      .contact
                      .phone
                  }
                </a>

              </div>
            )}

            {/* EMAIL */}

            {event.contact
              .email && (
              <div className="flex items-center gap-2 min-w-0">

                <Mail className="w-4 h-4 text-cyan-600 flex-shrink-0" />

                <a
                  href={`mailto:${event.contact.email}`}
                  className="hover:underline text-cyan-700 truncate"
                >
                  {
                    event
                      .contact
                      .email
                  }
                </a>

              </div>
            )}

            {/* WEBSITE */}

            {event.contact
              .website && (
              <div className="flex items-center gap-2">

                <Globe className="w-4 h-4 text-cyan-600 flex-shrink-0" />

                <button
                  type="button"
                  onClick={() =>
                    handleLinkClick(
                      getResourceUrl(
                        event
                          .contact
                          .website ||
                          ""
                      )
                    )
                  }
                  className="hover:underline text-cyan-700 font-semibold"
                >
                  Website Link
                </button>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
