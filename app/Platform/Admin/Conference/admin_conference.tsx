import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import {
  Globe,
  MapPin,
  Plus,
  Trash2,
  RefreshCw,
  Calendar,
  Link as LinkIcon,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import apiClient from "~/utils/apiClient";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConferenceCategory = "International" | "National";
type ConferenceStatus = "Active" | "Inactive";

type Conference = {
  _id: string;
  category: ConferenceCategory;
  title: string;
  startDate: string;
  endDate: string;
  link: string;
  status: ConferenceStatus;
  createdAt?: string;
};


// ─── Component ────────────────────────────────────────────────────────────────

export default function Admin_Conference() {
  const { token, role } = useAuth();

  const [conferences, setConferences] = useState<Conference[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Add modal state
  const [showModal, setShowModal] = useState(false);
  const [formCategory, setFormCategory] = useState<ConferenceCategory>("International");
  const [formTitle, setFormTitle] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formLink, setFormLink] = useState("");
  const [formStatus, setFormStatus] = useState<ConferenceStatus>("Active");
  const [submitting, setSubmitting] = useState(false);


  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchConferences = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get("/conference");
      const data: Conference[] = res.data?.data ?? (Array.isArray(res.data) ? res.data : []);
      if (data.length > 0) setConferences(data);
    } catch (error) {
      toast.error("Failed to load conferences");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchConferences();
  }, [token]);

  // ── Reset & open modal ──────────────────────────────────────────────────────
  const openAddModal = () => {
    setFormCategory("International");
    setFormTitle("");
    setFormStartDate("");
    setFormEndDate("");
    setFormLink("");
    setFormStatus("Active");
    setShowModal(true);
  };

  // Only show the warning when the entered URL points outside the MIT site.
  const isExternalLink = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return false;

    try {
      const url = new URL(trimmed, window.location.origin);
      const hostname = url.hostname.toLowerCase().replace(/^www\\./, "");
      const currentHostname = window.location.hostname.toLowerCase().replace(/^www\\./, "");

      // Treat the current frontend host and the MIT Imphal public host as internal.
      const internalHosts = new Set([
        currentHostname,
        "mitimphal.manipuruniv.ac.in",
      ]);

      return url.protocol === "http:" || url.protocol === "https:"
        ? !internalHosts.has(hostname)
        : false;
    } catch {
      return false;
    }
  };

  // ── Add ─────────────────────────────────────────────────────────────────────
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error("Please enter a conference title.");
      return;
    }
    if (!formStartDate) {
      toast.error("Please select the conference start date.");
      return;
    }
    if (!formEndDate) {
      toast.error("Please select the conference end date.");
      return;
    }
    if (formEndDate < formStartDate) {
      toast.error("End date cannot be earlier than start date.");
      return;
    }
    if (!formLink.trim()) {
      toast.error("Please enter the conference website/link.");
      return;
    }

    setSubmitting(true);

    const payload = {
      category: formCategory,
      title: formTitle.trim(),
      startDate: formStartDate,
      endDate: formEndDate,
      link: formLink.trim(),
      status: formStatus,
    };

    try {
      const res = await apiClient.post("/conference/add", payload);
      const created: Conference = res.data?.data ?? res.data;
      setConferences((prev) => [created, ...prev]);
      toast.success("Conference added successfully.");
    } catch (error) {
      toast.error("Failed to add conference. Please try again.");
    } finally {
      setShowModal(false);
      setSubmitting(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async (conf: Conference) => {
    try {
      await apiClient.delete(`/conference/delete/${conf._id}`);
      setConferences((prev) => prev.filter((c) => c._id !== conf._id));
      toast.success(`Deleted: "${conf.title}"`);
    } catch {
      toast.error("Failed to delete conference. Please try again.");
    }
  };

  // ── Guard ───────────────────────────────────────────────────────────────────
  if (!token || role !== "admin") {
    return (
      <div className="p-4">
        <SignIn_SignUP role="admin" />
      </div>
    );
  }

  const international = conferences.filter((c) => c.category === "International");
  const national = conferences.filter((c) => c.category === "National");

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Globe className="w-8 h-8 text-rose-700" /> Conference Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Add and manage International and National conferences displayed on the public page.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchConferences}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} /> Refresh
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Conference
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <div className="text-3xl font-bold text-rose-700">{conferences.length}</div>
          <div className="text-sm text-gray-500 font-medium mt-1">Total Conferences</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <div className="text-3xl font-bold text-blue-600">{international.length}</div>
          <div className="text-sm text-gray-500 font-medium mt-1">International</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-center">
          <div className="text-3xl font-bold text-green-600">{national.length}</div>
          <div className="text-sm text-gray-500 font-medium mt-1">National</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-lg">All Conferences</h2>
          <span className="text-xs text-gray-500 font-medium">
            {conferences.length} total
          </span>
        </div>

        {conferences.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <p className="font-medium">No conferences yet.</p>
            <p className="text-xs text-gray-400">Click "Add Conference" to create the first entry.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700 min-w-[640px]">
              <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 font-semibold">Category</th>
                  <th className="px-6 py-3 font-semibold">Title</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                  <th className="px-6 py-3 font-semibold">Link</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {conferences.map((conf) => (
                  <tr key={conf._id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border ${
                          conf.category === "International"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : "bg-green-50 text-green-800 border-green-200"
                        }`}
                      >
                        {conf.category === "International" ? (
                          <Globe className="w-3 h-3" />
                        ) : (
                          <MapPin className="w-3 h-3" />
                        )}
                        {conf.category}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 line-clamp-2 max-w-xs">
                        {conf.title}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-xs text-gray-600 font-mono whitespace-nowrap">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {conf.startDate === conf.endDate
                          ? conf.startDate
                          : `${conf.startDate} – ${conf.endDate}`}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href={conf.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-700 hover:text-rose-900 text-xs font-semibold flex items-center gap-1 underline max-w-[160px] truncate"
                        title={conf.link}
                      >
                        <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        {conf.link}
                      </a>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                          conf.status === "Active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {conf.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(conf)}
                        className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 rounded-lg border border-gray-200 transition-colors"
                        title="Delete conference"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg space-y-5 border border-gray-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-xl font-bold text-gray-800">Add New Conference</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Category
                </label>
                <div className="flex gap-3">
                  {(["International", "National"] as ConferenceCategory[]).map((cat) => (
                    <label
                      key={cat}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors text-sm font-semibold ${
                        formCategory === cat
                          ? "border-rose-700 bg-rose-50 text-rose-800"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={formCategory === cat}
                        onChange={() => setFormCategory(cat)}
                        className="hidden"
                      />
                      {cat === "International" ? (
                        <Globe className="w-4 h-4" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      {cat}
                    </label>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Conference Title
                </label>
                <textarea
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. NORTH EAST INTERNATIONAL CONFERENCE ON Innovation in Science and Technology (NE-ICIST 2025)"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none h-24 resize-none"
                  required
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    min={formStartDate || undefined}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <LinkIcon className="w-3.5 h-3.5" /> Conference Website / Link
                </label>
                <input
                  type="url"
                  value={formLink}
                  onChange={(e) => setFormLink(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="https://mitimphal.manipuruniv.ac.in/"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none font-mono"
                  required
                />
                {isExternalLink(formLink) && (
                  <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    This link points to an external website. Users will see an external site warning before opening it.
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as ConferenceStatus)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="Active">Active — Visible on public page</option>
                  <option value="Inactive">Inactive — Hidden from public page</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold shadow transition-colors"
                >
                  {submitting ? "Saving..." : "Add Conference"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}