import { useState, useEffect } from "react";
import Swal from "sweetalert2";

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

  // ── Add modal state ─────────────────────────────────────────────────────────

  const [showModal, setShowModal] = useState(false);

  const [formCategory, setFormCategory] =
    useState<ConferenceCategory>("International");

  const [formTitle, setFormTitle] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [formLink, setFormLink] = useState("");

  const [formStatus, setFormStatus] =
    useState<ConferenceStatus>("Active");

  const [submitting, setSubmitting] = useState(false);

  // ── Fetch conferences ──────────────────────────────────────────────────────

  const fetchConferences = async () => {
    setIsLoading(true);

    try {
      const res = await apiClient.get("/conference");

      const data: Conference[] =
        res.data?.data ??
        (Array.isArray(res.data) ? res.data : []);

      setConferences(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Failed to Load",
        text: "Unable to load conferences from the server.",
        confirmButtonColor: "#be123c",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Initial load ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (token && role === "admin") {
      fetchConferences();
    }
  }, [token, role]);

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

  // ── Close modal ─────────────────────────────────────────────────────────────

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
  };

  // ── External link detection ────────────────────────────────────────────────

  const isExternalLink = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      return false;
    }

    try {
      const url = new URL(
        trimmed,
        window.location.origin
      );

      const hostname = url.hostname
        .toLowerCase()
        .replace(/^www\./, "");

      const currentHostname =
        window.location.hostname
          .toLowerCase()
          .replace(/^www\./, "");

      const internalHosts = new Set([
        currentHostname,
        "mitimphal.manipuruniv.ac.in",
      ]);

      return (
        (url.protocol === "http:" ||
          url.protocol === "https:") &&
        !internalHosts.has(hostname)
      );
    } catch {
      return false;
    }
  };

  // ── Add conference ─────────────────────────────────────────────────────────

  const handleAdd = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Title validation
    if (!formTitle.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Title Required",
        text: "Please enter a conference title.",
        confirmButtonColor: "#be123c",
      });

      return;
    }

    // Start date validation
    if (!formStartDate) {
      await Swal.fire({
        icon: "warning",
        title: "Start Date Required",
        text: "Please select the conference start date.",
        confirmButtonColor: "#be123c",
      });

      return;
    }

    // End date validation
    if (!formEndDate) {
      await Swal.fire({
        icon: "warning",
        title: "End Date Required",
        text: "Please select the conference end date.",
        confirmButtonColor: "#be123c",
      });

      return;
    }

    // Date validation
    if (formEndDate < formStartDate) {
      await Swal.fire({
        icon: "warning",
        title: "Invalid Date Range",
        text: "End date cannot be earlier than start date.",
        confirmButtonColor: "#be123c",
      });

      return;
    }

    // Link validation
    if (!formLink.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Link Required",
        text: "Please enter the conference website/link.",
        confirmButtonColor: "#be123c",
      });

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
      const res = await apiClient.post(
        "/conference/add",
        payload
      );

      const created: Conference =
        res.data?.data ?? res.data;

      setConferences((prev) => [
        created,
        ...prev,
      ]);

      setShowModal(false);

      // Reset form
      setFormCategory("International");
      setFormTitle("");
      setFormStartDate("");
      setFormEndDate("");
      setFormLink("");
      setFormStatus("Active");

      await Swal.fire({
        icon: "success",
        title: "Conference Added",
        text: "Conference added successfully.",
        confirmButtonColor: "#be123c",
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Failed to Add",
        text:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to add conference. Please try again.",
        confirmButtonColor: "#be123c",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete conference ──────────────────────────────────────────────────────

  const handleDelete = async (
    conf: Conference
  ) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Conference?",
      html: `
        <div style="text-align:center">
          <p style="margin-bottom:8px;">
            Are you sure you want to permanently delete this conference?
          </p>
          <p style="font-weight:600;color:#374151;">
            "${conf.title}"
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      Swal.fire({
        title: "Deleting...",
        text: "Please wait while the conference is being deleted.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await apiClient.delete(
        `/conference/delete/${conf._id}`
      );

      setConferences((prev) =>
        prev.filter(
          (c) => c._id !== conf._id
        )
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: `"${conf.title}" was deleted successfully.`,
        confirmButtonColor: "#be123c",
      });
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to delete conference. Please try again.",
        confirmButtonColor: "#be123c",
      });
    }
  };

  // ── Access control ─────────────────────────────────────────────────────────

  if (!token || role !== "admin") {
    return (
      <div className="p-4">
        <SignIn_SignUP role="admin" />
      </div>
    );
  }

  // ── Category counts ────────────────────────────────────────────────────────

  const international =
    conferences.filter(
      (c) =>
        c.category === "International"
    );

  const national =
    conferences.filter(
      (c) => c.category === "National"
    );

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto space-y-8">

        {/* ====================================================================
            HEADER
        ==================================================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">

                <div className="p-3 rounded-xl bg-rose-100">
                  <Globe className="w-7 h-7 text-rose-700" />
                </div>

                <span>
                  Conference Management
                </span>

              </h1>

              <p className="text-gray-500 text-sm mt-2">
                Add and manage International
                and National conferences
                displayed on the public page.
              </p>

            </div>

            <div className="flex items-center gap-3">

              {/* Refresh */}

              <button
                type="button"
                onClick={
                  fetchConferences
                }
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl border border-gray-300 transition-colors disabled:opacity-50"
              >

                <RefreshCw
                  className={`w-4 h-4 ${
                    isLoading
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Refresh

              </button>

              {/* Add */}

              <button
                type="button"
                onClick={
                  openAddModal
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-xl shadow-md transition-colors"
              >

                <Plus className="w-4 h-4" />

                Add Conference

              </button>

            </div>

          </div>

        </div>

        {/* ====================================================================
            TOTALS
        ==================================================================== */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Total */}

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-3xl font-bold text-rose-700">
                  {conferences.length}
                </div>

                <div className="text-sm text-gray-500 font-medium mt-1">
                  Total Conferences
                </div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50">
                <Calendar className="w-6 h-6 text-rose-700" />
              </div>

            </div>

          </div>

          {/* International */}

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {international.length}
                </div>

                <div className="text-sm text-gray-500 font-medium mt-1">
                  International
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>

            </div>

          </div>

          {/* National */}

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">

            <div className="flex items-center justify-between">

              <div>
                <div className="text-3xl font-bold text-green-600">
                  {national.length}
                </div>

                <div className="text-sm text-gray-500 font-medium mt-1">
                  National
                </div>
              </div>

              <div className="p-3 rounded-xl bg-green-50">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>

            </div>

          </div>

        </div>

        {/* ====================================================================
            TABLE
        ==================================================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">

            <div>

              <h2 className="font-bold text-gray-800 text-lg">
                All Conferences
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                Manage all conference
                announcements.
              </p>

            </div>

            <span className="text-xs text-gray-500 font-medium bg-white border border-gray-200 px-3 py-1.5 rounded-full">
              {conferences.length} total
            </span>

          </div>

          {/* Loading */}

          {isLoading ? (

            <div className="p-14 flex flex-col items-center justify-center gap-3">

              <RefreshCw className="w-7 h-7 text-rose-700 animate-spin" />

              <p className="text-sm text-gray-500">
                Loading conferences...
              </p>

            </div>

          ) : conferences.length === 0 ? (

            /* Empty */

            <div className="p-12 text-center">

              <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">

                <Globe className="w-7 h-7 text-gray-400" />

              </div>

              <p className="font-semibold text-gray-600">
                No conferences yet.
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Click "Add Conference" to
                create the first entry.
              </p>

              <button
                type="button"
                onClick={
                  openAddModal
                }
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-sm font-semibold"
              >

                <Plus className="w-4 h-4" />

                Add Conference

              </button>

            </div>

          ) : (

            /* Table */

            <div className="overflow-x-auto">

              <table className="w-full text-left text-sm text-gray-700 min-w-[850px]">

                <thead className="bg-gray-100 text-gray-600 uppercase text-xs border-b border-gray-200">

                  <tr>

                    <th className="px-6 py-3 font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-3 font-semibold">
                      Title
                    </th>

                    <th className="px-6 py-3 font-semibold">
                      Date
                    </th>

                    <th className="px-6 py-3 font-semibold">
                      Link
                    </th>

                    <th className="px-6 py-3 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-3 font-semibold text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200">

                  {conferences.map(
                    (conf) => (

                      <tr
                        key={
                          conf._id
                        }
                        className="hover:bg-gray-50/80 transition-colors"
                      >

                        {/* Category */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold border ${
                              conf.category ===
                              "International"
                                ? "bg-blue-50 text-blue-800 border-blue-200"
                                : "bg-green-50 text-green-800 border-green-200"
                            }`}
                          >

                            {conf.category ===
                            "International" ? (
                              <Globe className="w-3 h-3" />
                            ) : (
                              <MapPin className="w-3 h-3" />
                            )}

                            {conf.category}

                          </span>

                        </td>

                        {/* Title */}

                        <td className="px-6 py-4">

                          <p className="font-semibold text-gray-900 line-clamp-2 max-w-sm">
                            {conf.title}
                          </p>

                        </td>

                        {/* Date */}

                        <td className="px-6 py-4">

                          <div className="flex items-start gap-1.5 text-xs text-gray-600 font-mono">

                            <Calendar className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />

                            <span>
                              {conf.startDate ===
                              conf.endDate
                                ? conf.startDate
                                : `${conf.startDate} – ${conf.endDate}`}
                            </span>

                          </div>

                        </td>

                        {/* Link */}

                        <td className="px-6 py-4">

                          <a
                            href={
                              conf.link
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-rose-700 hover:text-rose-900 text-xs font-semibold flex items-center gap-1 underline max-w-[180px] truncate"
                            title={
                              conf.link
                            }
                          >

                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />

                            <span className="truncate">
                              {conf.link}
                            </span>

                          </a>

                        </td>

                        {/* Status */}

                        <td className="px-6 py-4">

                          <span
                            className={`inline-flex text-xs px-2.5 py-1 rounded-full font-bold border ${
                              conf.status ===
                              "Active"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-gray-100 text-gray-500 border-gray-200"
                            }`}
                          >
                            {conf.status}
                          </span>

                        </td>

                        {/* Actions */}

                        <td className="px-6 py-4 text-right">

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                conf
                              )
                            }
                            className="inline-flex items-center justify-center p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 rounded-lg border border-gray-200 transition-colors"
                            title="Delete conference"
                          >

                            <Trash2 className="w-4 h-4" />

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ====================================================================
          ADD MODAL
      ==================================================================== */}

      {showModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={
            closeModal
          }
        >

          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg space-y-5 border border-gray-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal Header */}

            <div className="flex justify-between items-center border-b border-gray-200 pb-3">

              <div>

                <h3 className="text-xl font-bold text-gray-800">
                  Add New Conference
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Enter the conference
                  information below.
                </p>

              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
                disabled={
                  submitting
                }
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50"
              >

                <span className="text-xl font-bold">
                  &times;
                </span>

              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={
                handleAdd
              }
              className="space-y-4"
            >

              {/* ============================================================
                  CATEGORY
              ============================================================ */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Category
                </label>

                <div className="flex gap-3">

                  {(
                    [
                      "International",
                      "National",
                    ] as ConferenceCategory[]
                  ).map(
                    (cat) => (

                      <label
                        key={cat}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-colors text-sm font-semibold ${
                          formCategory ===
                          cat
                            ? "border-rose-700 bg-rose-50 text-rose-800"
                            : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >

                        <input
                          type="radio"
                          name="category"
                          value={cat}
                          checked={
                            formCategory ===
                            cat
                          }
                          onChange={() =>
                            setFormCategory(
                              cat
                            )
                          }
                          className="hidden"
                        />

                        {cat ===
                        "International" ? (
                          <Globe className="w-4 h-4" />
                        ) : (
                          <MapPin className="w-4 h-4" />
                        )}

                        {cat}

                      </label>

                    )
                  )}

                </div>

              </div>

              {/* ============================================================
                  TITLE
              ============================================================ */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Conference Title
                </label>

                <textarea
                  value={
                    formTitle
                  }
                  onChange={(e) =>
                    setFormTitle(
                      e.target.value
                    )
                  }
                  placeholder="e.g. NORTH EAST INTERNATIONAL CONFERENCE ON Innovation in Science and Technology (NE-ICIST 2025)"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none h-24 resize-none"
                  required
                />

                <div className="text-[11px] text-gray-400 text-right mt-1">
                  {formTitle.length}
                </div>

              </div>

              {/* ============================================================
                  DATES
              ============================================================ */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Start */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Start Date
                  </label>

                  <div className="relative">

                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                    <input
                      type="date"
                      value={
                        formStartDate
                      }
                      onChange={(e) =>
                        setFormStartDate(
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none"
                      required
                    />

                  </div>

                </div>

                {/* End */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    End Date
                  </label>

                  <div className="relative">

                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                    <input
                      type="date"
                      value={
                        formEndDate
                      }
                      min={
                        formStartDate ||
                        undefined
                      }
                      onChange={(e) =>
                        setFormEndDate(
                          e.target.value
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none"
                      required
                    />

                  </div>

                </div>

              </div>

              {/* ============================================================
                  LINK
              ============================================================ */}

              <div>

                <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1">

                  <LinkIcon className="w-3.5 h-3.5" />

                  Conference Website / Link

                </label>

                <input
                  type="url"
                  value={
                    formLink
                  }
                  onChange={(e) =>
                    setFormLink(
                      e.target.value
                    )
                  }
                  onClick={(e) =>
                    e.stopPropagation()
                  }
                  placeholder="https://mitimphal.manipuruniv.ac.in/"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none font-mono"
                  required
                />

                {isExternalLink(
                  formLink
                ) && (

                  <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">

                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />

                    <p className="text-xs text-amber-700">
                      This link points to
                      an external website.
                      Users will see an
                      external site warning
                      before opening it.
                    </p>

                  </div>

                )}

              </div>

              {/* ============================================================
                  STATUS
              ============================================================ */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Status
                </label>

                <select
                  value={
                    formStatus
                  }
                  onChange={(e) =>
                    setFormStatus(
                      e.target
                        .value as ConferenceStatus
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-white"
                >

                  <option value="Active">
                    Active — Visible on
                    public page
                  </option>

                  <option value="Inactive">
                    Inactive — Hidden
                    from public page
                  </option>

                </select>

              </div>

              {/* ============================================================
                  BUTTONS
              ============================================================ */}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    submitting
                  }
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-xl text-sm font-semibold shadow transition-colors"
                >

                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />

                      Add Conference
                    </>
                  )}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}