import { useEffect, useState } from "react";
import apiClient from "~/utils/apiClient";
import Informations from "~/Common/Informations/Informations";
import Swal from "sweetalert2";
import {
  ExternalLink,
  Globe,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { confirmExternalLink } from "~/utils/alert_utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConferenceCategory = "International" | "National";

type Conference = {
  _id: string;
  category: ConferenceCategory;
  title: string;
  date: string;
  link: string;
  status: "Active" | "Inactive";
};

// ─── Conference Card ──────────────────────────────────────────────────────────

function ConferenceCard({
  conf,
  onLinkClick,
}: {
  conf: Conference;
  onLinkClick: (conf: Conference) => void;
}) {
  const isInactive = conf.status === "Inactive";

  return (
    <div
      className={`group relative flex items-start justify-between gap-4 bg-white border rounded-2xl p-5 shadow-sm transition-all duration-300 ${
        isInactive
          ? "border-gray-200 opacity-90"
          : "border-gray-200 hover:border-cyan-400 hover:shadow-lg"
      }`}
    >
      {/* Left accent */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${
          isInactive ? "bg-gray-400" : "bg-cyan-500"
        }`}
      />

      <div className="flex-1 pl-3">
        {/* Category + Status */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              isInactive
                ? "bg-gray-100 text-gray-600"
                : "bg-cyan-100 text-cyan-700"
            }`}
          >
            {conf.category}
          </span>

          {isInactive && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              Inactive
            </span>
          )}
        </div>

        {/* Title */}
        <p
          className={`font-bold text-base md:text-lg leading-snug transition-colors ${
            isInactive
              ? "text-gray-600"
              : "text-gray-900 group-hover:text-cyan-700"
          }`}
        >
          {conf.title}
        </p>

        {/* Date */}
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
          <Calendar
            className={`w-4 h-4 flex-shrink-0 ${
              isInactive ? "text-gray-400" : "text-cyan-500"
            }`}
          />
          <span>{conf.date}</span>
        </div>
      </div>

      {/* Visit button */}
      <button
        type="button"
        onClick={() => onLinkClick(conf)}
        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 text-white text-sm font-semibold rounded-xl shadow-sm transition-all whitespace-nowrap ${
          isInactive
            ? "bg-gray-400 hover:bg-gray-500"
            : "bg-cyan-500 hover:bg-cyan-600 hover:shadow-md"
        }`}
        aria-label={
          isInactive
            ? `Conference ended: ${conf.title}`
            : `Visit conference: ${conf.title}`
        }
      >
        <span className="hidden sm:inline">
          {isInactive ? "Ended" : "Visit"}
        </span>

        {isInactive ? (
          <ExternalLink className="w-4 h-4" />
        ) : (
          <ArrowRight className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Confrence() {
  const [conferences, setConferences] = useState<Conference[]>([]);

  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // ─── Check external URL ────────────────────────────────────────────────────

  const isExternalLink = (url: string) => {
    try {
      const linkUrl = new URL(url, window.location.origin);

      return linkUrl.origin !== window.location.origin;
    } catch {
      return false;
    }
  };

  // ─── Handle conference link click ──────────────────────────────────────────

  const handleConferenceLink = (conference: Conference) => {
    // Inactive conference
    if (conference.status === "Inactive") {
      Swal.fire({
        icon: "info",
        title: "Conference Ended",
        text: "This conference is no longer active. The event period has ended, so the conference link is unavailable.",
        confirmButtonText: "Okay",
        confirmButtonColor: "#06b6d4",
        customClass: {
          popup: "rounded-xl",
          confirmButton: "rounded-lg",
        },
      });

      return;
    }

    // Active conference
    setPendingHref(conference.link);
  };

  // ─── Handle external link confirmation ─────────────────────────────────────

  useEffect(() => {
    if (!pendingHref) return;

    if (!isExternalLink(pendingHref)) {
      window.location.href = pendingHref;
      setPendingHref(null);
      return;
    }

    confirmExternalLink({
      title: "Leave this site?",
      text: "You are being redirected to an external website.",
      confirmButtonText: "Continue",
      cancelButtonText: "Stay here",
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    }).then((confirmed) => {
      if (confirmed) {
        window.open(pendingHref, "_blank", "noopener,noreferrer");
      }

      setPendingHref(null);
    });
  }, [pendingHref]);

  // ─── Fetch conference data ─────────────────────────────────────────────────

  useEffect(() => {
    const fetchConferences = async () => {
      try {
        setLoading(true);

        const response = await apiClient.get("/conference");

        const data: Conference[] =
          response.data?.data ??
          (Array.isArray(response.data) ? response.data : []);

        // Keep BOTH active and inactive conferences
        setConferences(data);
      } catch (error) {
        setConferences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  // ─── Category filtering ────────────────────────────────────────────────────

  const international = conferences.filter(
    (conference) =>
      conference.category === "International" &&
      conference.status !== "Inactive"
  );

  const national = conferences.filter(
    (conference) =>
      conference.category === "National" &&
      conference.status !== "Inactive"
  );

  // All inactive conferences
  const inactiveConferences = conferences.filter(
    (conference) => conference.status === "Inactive"
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen space-y-6 sm:space-y-8 px-3 sm:px-5 md:px-8 lg:px-10">
        {/* Page banner */}
        <div className="uppercase text-center text-lg sm:text-xl md:text-2xl font-bold tracking-[0.12em] sm:tracking-widest p-3 sm:p-4 md:p-5 bg-cyan-500 border-2 border-gray-300 rounded shadow-sm text-white">
          Conference
        </div>

        <div className="max-w-5xl w-full mx-auto space-y-6 sm:space-y-8">
          {/* Loading */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin" />

              <p className="mt-4 text-gray-500 font-medium">
                Loading conferences...
              </p>
            </div>
          ) : (
            <>
              {/* International */}
              {international.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center justify-center w-10 h-10 bg-cyan-100 rounded-xl">
                      <Globe className="w-5 h-5 text-cyan-600" />
                    </div>

                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 uppercase border-l-4 border-cyan-400 pl-3">
                        International
                      </h2>

                      <p className="text-sm text-gray-500">
                        International conferences and events
                      </p>
                    </div>

                    <span className="ml-auto text-xs bg-cyan-100 text-cyan-800 font-semibold px-3 py-1 rounded-full border border-cyan-200">
                      {international.length}{" "}
                      {international.length === 1 ? "entry" : "entries"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {international.map((conference) => (
                      <ConferenceCard
                        key={conference._id}
                        conf={conference}
                        onLinkClick={handleConferenceLink}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* National */}
              {national.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="flex items-center justify-center w-10 h-10 bg-cyan-100 rounded-xl">
                      <MapPin className="w-5 h-5 text-cyan-600" />
                    </div>

                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 uppercase border-l-4 border-cyan-400 pl-3">
                        National
                      </h2>

                      <p className="text-sm text-gray-500">
                        National conferences and events
                      </p>
                    </div>

                    <span className="ml-auto text-xs bg-cyan-100 text-cyan-800 font-semibold px-3 py-1 rounded-full border border-cyan-200">
                      {national.length}{" "}
                      {national.length === 1 ? "entry" : "entries"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {national.map((conference) => (
                      <ConferenceCard
                        key={conference._id}
                        conf={conference}
                        onLinkClick={handleConferenceLink}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Inactive Conferences */}
              {inactiveConferences.length > 0 && (
                <section className="pt-4">
                  <div className="border-t border-gray-200 pt-8">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-xl">
                        <Calendar className="w-5 h-5 text-gray-500" />
                      </div>

                      <div>
                        <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 uppercase border-l-4 border-gray-400 pl-3">
                          Inactive Conferences
                        </h2>

                        <p className="text-sm text-gray-500">
                          Previous conferences and completed events
                        </p>
                      </div>

                      <span className="ml-auto text-xs bg-gray-100 text-gray-600 font-semibold px-3 py-1 rounded-full border border-gray-200">
                        {inactiveConferences.length}{" "}
                        {inactiveConferences.length === 1
                          ? "entry"
                          : "entries"}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {inactiveConferences.map((conference) => (
                        <ConferenceCard
                          key={conference._id}
                          conf={conference}
                          onLinkClick={handleConferenceLink}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {/* No data */}
              {conferences.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center py-20">
                  <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mb-4">
                    <Calendar className="w-7 h-7 text-gray-400" />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-700">
                    No conferences available
                  </h3>

                  <p className="text-gray-500 mt-1">
                    There are currently no conferences listed.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Informations />
    </>
  );
}