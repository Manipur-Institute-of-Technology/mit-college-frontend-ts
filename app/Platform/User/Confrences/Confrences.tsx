import { useEffect, useState } from "react";
import apiClient from "~/utils/apiClient";
import Informations from "~/Common/Informations/Informations";
import {
  ExternalLink,
  Globe,
  MapPin,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Swal from "sweetalert2";

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
  onLinkClick: (href: string) => void;
}) {
  return (
    <div className="group relative flex items-start justify-between gap-4 bg-white border border-gray-200 hover:border-cyan-400 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Left accent */}
      <div className="absolute left-0 top-4 bottom-4 w-1 bg-cyan-500 rounded-r-full" />

      <div className="flex-1 pl-3">
        {/* Category */}
        <div className="mb-2">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              conf.category === "International"
                ? "bg-cyan-100 text-cyan-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {conf.category}
          </span>
        </div>

        {/* Title */}
        <p className="font-bold text-gray-900 text-base md:text-lg leading-snug group-hover:text-cyan-700 transition-colors">
          {conf.title}
        </p>

        {/* Date */}
        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
          <Calendar className="w-4 h-4 flex-shrink-0 text-cyan-500" />
          <span>{conf.date}</span>
        </div>
      </div>

      {/* Visit button */}
      <button
        type="button"
        onClick={() => onLinkClick(conf.link)}
        className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap"
        aria-label={`Visit conference: ${conf.title}`}
      >
        <span className="hidden sm:inline">Visit</span>

        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Confrence() {
  const [conferences, setConferences] =
    useState<Conference[]>([]);

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

  // ─── Handle external link confirmation ─────────────────────────────────────

  useEffect(() => {
    if (!pendingHref) return;

    if (!isExternalLink(pendingHref)) {
      window.location.href = pendingHref;
      setPendingHref(null);
      return;
    }

    Swal.fire({
      title: "Leave this site?",
      text: "You are being redirected to an external website.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Continue",
      cancelButtonText: "Stay here",
      confirmButtonColor: "#06b6d4",
      cancelButtonColor: "#ef4444",
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    }).then((result) => {
      if (result.isConfirmed) {
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

        // Only display active conferences
        const active = data.filter(
          (conference) => conference.status !== "Inactive"
        );

        /*
         * If backend has data, use backend data.
         * If backend returns no active data, show empty state
         * instead of showing sample data.
         */
        setConferences(active);
      } catch (error) {
        console.error("CONFERENCE FETCH ERROR:", error);

        setConferences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchConferences();
  }, []);

  // ─── Category filtering ────────────────────────────────────────────────────

  const international = conferences.filter(
    (conference) => conference.category === "International"
  );

  const national = conferences.filter(
    (conference) => conference.category === "National"
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Page banner */}
        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-b-2 border-cyan-600 text-white text-center shadow-sm">
          Conference
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
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
                      <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
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
                        onLinkClick={setPendingHref}
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
                      <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
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
                        onLinkClick={setPendingHref}
                      />
                    ))}
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