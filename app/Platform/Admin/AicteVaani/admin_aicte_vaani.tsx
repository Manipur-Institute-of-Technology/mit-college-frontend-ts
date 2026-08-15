import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Sparkles,
  Plus,
  Trash2,
  RefreshCw,
  Calendar,
  Clock,
  MapPin,
  FileText,
  Edit2,
  X,
  User,
  Building,
  Globe,
  Mail,
  Phone,
  Paperclip,
  Link as LinkIcon,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import apiClient from "~/utils/apiClient";

// ============================================================
// TYPES
// ============================================================

export type AttachmentOrLink = {
  id?: number;
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
};

// ============================================================
// COMPONENT
// ============================================================

export default function Admin_AICTE_VAANI() {
  const { token, role } = useAuth();

  // ----------------------------------------------------------
  // DATA
  // ----------------------------------------------------------

  const [items, setItems] = useState<AicteVaaniItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ----------------------------------------------------------
  // MODAL
  // ----------------------------------------------------------

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // ----------------------------------------------------------
  // EVENT FIELDS
  // ----------------------------------------------------------

  const [header, setHeader] = useState(
    "AICTE-VAANI WORKSHOP (2 Days)"
  );

  const [topic, setTopic] = useState("");
  const [dates, setDates] = useState("");
  const [time, setTime] = useState("9:00 AM – 5:00 PM");
  const [venue, setVenue] = useState("MIT, MU Campus");
  const [information, setInformation] = useState("");

  // ----------------------------------------------------------
  // CONTACT
  // ----------------------------------------------------------

  const [coordinator, setCoordinator] = useState("");
  const [coCoordinator, setCoCoordinator] = useState("");
  const [department, setDepartment] = useState("");
  const [website, setWebsite] = useState(
    "https://mitimphal.manipuruniv.ac.in/"
  );
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // ----------------------------------------------------------
  // ATTACHMENTS
  // ----------------------------------------------------------

  const [attachments, setAttachments] = useState<
    AttachmentOrLink[]
  >([]);

  // ----------------------------------------------------------
  // EXTRA LINKS
  // ----------------------------------------------------------

  const [extraLinks, setExtraLinks] = useState<
    AttachmentOrLink[]
  >([]);

  // ----------------------------------------------------------
  // STATUS
  // ----------------------------------------------------------

  const [status, setStatus] = useState<
    "Active" | "Inactive"
  >("Active");

  // ----------------------------------------------------------
  // SUBMIT
  // ----------------------------------------------------------

  const [submitting, setSubmitting] = useState(false);

  // ==========================================================
  // FETCH
  // ==========================================================

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response = await apiClient.get("/aicte-vaani");

      const data: AicteVaaniItem[] =
        response.data?.data ??
        (Array.isArray(response.data)
          ? response.data
          : []);

      setItems(data);
    } catch (error: any) {
      console.error("Fetch AICTE-VAANI error:", error);

      toast.error(
        error?.response?.data?.error ||
          "Failed to load AICTE-VAANI events."
      );

      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    if (token && role === "admin") {
      fetchData();
    }
  }, [token, role]);

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setEditingId(null);

    setHeader("AICTE-VAANI WORKSHOP (2 Days)");
    setTopic("");
    setDates("");
    setTime("9:00 AM – 5:00 PM");
    setVenue("MIT, MU Campus");
    setInformation("");

    setCoordinator("");
    setCoCoordinator("");
    setDepartment("");
    setWebsite(
      "https://mitimphal.manipuruniv.ac.in/"
    );
    setEmail("");
    setPhone("");

    setAttachments([]);
    setExtraLinks([]);

    setStatus("Active");
  };

  // ==========================================================
  // OPEN ADD MODAL
  // ==========================================================

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  // ==========================================================
  // OPEN EDIT MODAL
  // ==========================================================

  const openEditModal = (item: AicteVaaniItem) => {
    setEditingId(item._id);

    setHeader(
      item.header ||
        "AICTE-VAANI WORKSHOP (2 Days)"
    );

    setTopic(item.topic || "");
    setDates(item.dates || "");
    setTime(item.time || "9:00 AM – 5:00 PM");
    setVenue(item.venue || "MIT, MU Campus");
    setInformation(item.information || "");

    setCoordinator(
      item.contact?.coordinator || ""
    );

    setCoCoordinator(
      item.contact?.coCoordinator || ""
    );

    setDepartment(
      item.contact?.department || ""
    );

    setWebsite(
      item.contact?.website ||
        "https://mitimphal.manipuruniv.ac.in/"
    );

    setEmail(item.contact?.email || "");
    setPhone(item.contact?.phone || "");

    setAttachments(
      Array.isArray(item.attachments)
        ? item.attachments
        : []
    );

    setExtraLinks(
      Array.isArray(item.extraLinks)
        ? item.extraLinks
        : []
    );

    setStatus(item.status || "Active");

    setShowModal(true);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);
    resetForm();
  };

  // ==========================================================
  // ATTACHMENT FUNCTIONS
  // ==========================================================

  const addAttachment = () => {
    setAttachments((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        url: "",
      },
    ]);
  };

  const updateAttachment = (
    index: number,
    field: "title" | "url",
    value: string
  ) => {
    setAttachments((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================================
  // EXTRA LINK FUNCTIONS
  // ==========================================================

  const addExtraLink = () => {
    setExtraLinks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        url: "",
      },
    ]);
  };

  const updateExtraLink = (
    index: number,
    field: "title" | "url",
    value: string
  ) => {
    setExtraLinks((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const removeExtraLink = (index: number) => {
    setExtraLinks((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.error("Please enter the workshop topic.");
      return;
    }

    if (!dates.trim()) {
      toast.error("Please enter the event dates.");
      return;
    }

    setSubmitting(true);

    const payload = {
      header:
        header.trim() ||
        "AICTE-VAANI WORKSHOP (2 Days)",

      topic: topic.trim(),

      dates: dates.trim(),

      time:
        time.trim() ||
        "9:00 AM – 5:00 PM",

      venue:
        venue.trim() ||
        "MIT, MU Campus",

      information: information.trim(),

      contact: {
        coordinator: coordinator.trim(),
        coCoordinator: coCoordinator.trim(),
        department: department.trim(),
        website: website.trim(),
        email: email.trim(),
        phone: phone.trim(),
      },

      attachments: attachments.filter(
        (item) =>
          item.title.trim() ||
          item.url.trim()
      ),

      extraLinks: extraLinks.filter(
        (item) =>
          item.title.trim() ||
          item.url.trim()
      ),

      status,
    };

    try {
      // ======================================================
      // EDIT
      // ======================================================

      if (editingId) {
        const response = await apiClient.put(
          `/aicte-vaani/edit/${editingId}`,
          payload
        );

        const updatedItem =
          response.data?.data;

        if (!updatedItem) {
          throw new Error(
            "Invalid update response from server."
          );
        }

        setItems((prev) =>
          prev.map((item) =>
            item._id === editingId
              ? updatedItem
              : item
          )
        );

        toast.success(
          "AICTE-VAANI event updated successfully."
        );
      }

      // ======================================================
      // ADD
      // ======================================================

      else {
        const response = await apiClient.post(
          "/aicte-vaani/add",
          payload
        );

        const createdItem =
          response.data?.data;

        if (!createdItem) {
          throw new Error(
            "Invalid create response from server."
          );
        }

        setItems((prev) => [
          createdItem,
          ...prev,
        ]);

        toast.success(
          "AICTE-VAANI event created successfully."
        );
      }

      setShowModal(false);
      resetForm();
    } catch (error: any) {
      console.error(
        "Save AICTE-VAANI error:",
        error
      );

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.details ||
          "Failed to save AICTE-VAANI event."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const handleDelete = async (
    id: string,
    topicName: string
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${topicName}"?`
    );

    if (!confirmed) return;

    try {
      await apiClient.delete(
        `/aicte-vaani/delete/${id}`
      );

      setItems((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      toast.success(
        "AICTE-VAANI event deleted successfully."
      );
    } catch (error: any) {
      console.error(
        "Delete AICTE-VAANI error:",
        error
      );

      toast.error(
        error?.response?.data?.error ||
          "Failed to delete AICTE-VAANI event."
      );
    }
  };

  // ==========================================================
  // AUTH
  // ==========================================================

  if (!token || role !== "admin") {
    return (
      <div className="p-4">
        <SignIn_SignUP role="admin" />
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-200">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-rose-700" />

            AICTE-VAANI Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Create, edit and manage AICTE-VAANI
            workshops, contacts, attachments and links.
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={fetchData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 transition"
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

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg shadow-md transition"
          >
            <Plus className="w-4 h-4" />

            Add Event
          </button>

        </div>
      </div>

      {/* ====================================================
          NOTICE
      ==================================================== */}

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">

        <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" />

        <div>
          <strong>AICTE-VAANI Management:</strong>{" "}
          Only events stored in the backend are shown.
          Add, edit and delete operations are saved
          directly to MongoDB.
        </div>

      </div>

      {/* ====================================================
          EVENT LIST
      ==================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">

          <h2 className="font-bold text-gray-800 text-lg">
            AICTE-VAANI Events
          </h2>

          <span className="text-xs text-gray-500 font-medium">
            {items.length} total
          </span>

        </div>

        {/* Loading */}

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-500">

            <RefreshCw className="w-8 h-8 animate-spin mb-3" />

            <p className="font-medium">
              Loading AICTE-VAANI events...
            </p>

          </div>
        ) : items.length === 0 ? (

          /* Empty */

          <div className="p-16 text-center">

            <Sparkles className="w-12 h-12 mx-auto text-gray-300 mb-4" />

            <p className="font-semibold text-gray-600">
              No AICTE-VAANI events found.
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Click "Add Event" to create the first
              workshop.
            </p>

          </div>
        ) : (

          /* List */

          <div className="divide-y divide-gray-200">

            {items.map((event) => (

              <div
                key={event._id}
                className="p-6 hover:bg-gray-50 transition"
              >

                <div className="flex flex-col md:flex-row justify-between gap-5">

                  <div className="flex-1 min-w-0">

                    <div className="flex flex-wrap items-center gap-2 mb-2">

                      <span className="px-2.5 py-1 bg-cyan-100 text-cyan-800 text-xs font-bold rounded-full">
                        {event.header}
                      </span>

                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
                          event.status ===
                          "Active"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {event.status}
                      </span>

                    </div>

                    <h3 className="text-xl font-bold text-gray-900 break-words">
                      {event.topic}
                    </h3>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 mt-3 text-xs text-gray-600">

                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-cyan-600" />
                        {event.dates}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-cyan-600" />
                        {event.time}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-cyan-600" />
                        {event.venue}
                      </span>

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex items-start gap-2">

                    <button
                      onClick={() =>
                        openEditModal(event)
                      }
                      className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-700 rounded-lg border border-gray-200 transition"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          event._id,
                          event.topic
                        )
                      }
                      className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 rounded-lg border border-gray-200 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>

                {/* DETAILS */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">

                  {/* Contact */}

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                      Contact Details
                    </h4>

                    <div className="space-y-2 text-xs text-gray-600">

                      {event.contact?.coordinator && (
                        <div className="flex gap-2">
                          <User className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                          <span>
                            {event.contact.coordinator}
                          </span>
                        </div>
                      )}

                      {event.contact?.department && (
                        <div className="flex gap-2">
                          <Building className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                          <span>
                            {event.contact.department}
                          </span>
                        </div>
                      )}

                      {event.contact?.email && (
                        <div className="flex gap-2">
                          <Mail className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                          <span>
                            {event.contact.email}
                          </span>
                        </div>
                      )}

                      {event.contact?.phone && (
                        <div className="flex gap-2">
                          <Phone className="w-4 h-4 text-cyan-600 flex-shrink-0" />
                          <span>
                            {event.contact.phone}
                          </span>
                        </div>
                      )}

                      {event.contact?.website && (
                        <a
                          href={
                            event.contact.website
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex gap-2 text-cyan-700 hover:underline"
                        >
                          <Globe className="w-4 h-4 flex-shrink-0" />

                          <span className="truncate">
                            {
                              event.contact
                                .website
                            }
                          </span>

                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}

                    </div>

                  </div>

                  {/* Attachments */}

                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">

                    <h4 className="font-bold text-sm text-gray-700 mb-3">
                      Resources
                    </h4>

                    <div className="space-y-2">

                      {event.attachments
                        ?.length > 0 && (
                        <div>

                          <p className="text-xs font-semibold text-gray-500 mb-1">
                            Attachments
                          </p>

                          {event.attachments.map(
                            (attachment, index) => (
                              <a
                                key={
                                  attachment.id ??
                                  index
                                }
                                href={
                                  attachment.url
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-cyan-700 hover:underline mb-1"
                              >
                                <Paperclip className="w-3.5 h-3.5 flex-shrink-0" />

                                <span className="truncate">
                                  {attachment.title ||
                                    attachment.url}
                                </span>
                              </a>
                            )
                          )}

                        </div>
                      )}

                      {event.extraLinks
                        ?.length > 0 && (
                        <div>

                          <p className="text-xs font-semibold text-gray-500 mb-1">
                            Extra Links
                          </p>

                          {event.extraLinks.map(
                            (link, index) => (
                              <a
                                key={
                                  link.id ??
                                  index
                                }
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs text-cyan-700 hover:underline mb-1"
                              >
                                <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />

                                <span className="truncate">
                                  {link.title ||
                                    link.url}
                                </span>
                              </a>
                            )
                          )}

                        </div>
                      )}

                      {!event.attachments
                        ?.length &&
                        !event.extraLinks
                          ?.length && (
                          <p className="text-xs text-gray-400">
                            No resources added.
                          </p>
                        )}

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>

      {/* ====================================================
          MODAL
      ==================================================== */}

      {showModal && (

        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >

          <div
            className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold text-gray-800">
                  {editingId
                    ? "Edit AICTE-VAANI Event"
                    : "Add AICTE-VAANI Event"}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Enter the workshop information
                  below.
                </p>

              </div>

              <button
                onClick={closeModal}
                disabled={submitting}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-7"
            >

              {/* ==================================================
                  EVENT OVERVIEW
              ================================================== */}

              <section>

                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">
                  1. Event Overview
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="label">
                      Header / Tagline
                    </label>

                    <input
                      value={header}
                      onChange={(e) =>
                        setHeader(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="AICTE-VAANI WORKSHOP (2 Days)"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Topic / Title *
                    </label>

                    <input
                      value={topic}
                      onChange={(e) =>
                        setTopic(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="Emerging Trends in Semiconductor Technology"
                      required
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                  <div>
                    <label className="label">
                      Dates *
                    </label>

                    <input
                      value={dates}
                      onChange={(e) =>
                        setDates(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="09 October 2025 – 10 October 2025"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      Time
                    </label>

                    <input
                      value={time}
                      onChange={(e) =>
                        setTime(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="9:00 AM – 5:00 PM"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Venue
                    </label>

                    <input
                      value={venue}
                      onChange={(e) =>
                        setVenue(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="MIT, MU Campus"
                    />
                  </div>

                </div>

                <div className="mt-4">

                  <label className="label">
                    Event Information
                  </label>

                  <textarea
                    value={information}
                    onChange={(e) =>
                      setInformation(
                        e.target.value
                      )
                    }
                    className="input min-h-[140px] resize-y"
                    placeholder="Enter detailed information about the workshop..."
                  />

                </div>

              </section>

              {/* ==================================================
                  CONTACT
              ================================================== */}

              <section>

                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">
                  2. Contact Details
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="label">
                      Coordinator
                    </label>

                    <input
                      value={coordinator}
                      onChange={(e) =>
                        setCoordinator(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="Coordinator name"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Co-Coordinator
                    </label>

                    <input
                      value={coCoordinator}
                      onChange={(e) =>
                        setCoCoordinator(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="Co-coordinator name"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Department
                    </label>

                    <input
                      value={department}
                      onChange={(e) =>
                        setDepartment(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="Department name"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Website
                    </label>

                    <input
                      value={website}
                      onChange={(e) =>
                        setWebsite(
                          e.target.value
                        )
                      }
                      className="input font-mono"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label className="label">
                      Email
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="example@example.com"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Phone
                    </label>

                    <input
                      value={phone}
                      onChange={(e) =>
                        setPhone(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="+91..."
                    />
                  </div>

                </div>

              </section>

              {/* ==================================================
                  ATTACHMENTS
              ================================================== */}

              <section>

                <div className="flex justify-between items-center border-b pb-2 mb-4">

                  <h4 className="font-bold text-gray-800">
                    3. Attachments
                  </h4>

                  <button
                    type="button"
                    onClick={addAttachment}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Attachment
                  </button>

                </div>

                <div className="space-y-3">

                  {attachments.map(
                    (attachment, index) => (

                      <div
                        key={
                          attachment.id ??
                          index
                        }
                        className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_auto] gap-2 bg-gray-50 border border-gray-200 p-3 rounded-lg"
                      >

                        <input
                          value={
                            attachment.title
                          }
                          onChange={(e) =>
                            updateAttachment(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="input"
                          placeholder="Attachment title"
                        />

                        <input
                          value={
                            attachment.url
                          }
                          onChange={(e) =>
                            updateAttachment(
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          className="input font-mono"
                          placeholder="https://..."
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeAttachment(
                              index
                            )
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    )
                  )}

                  {attachments.length ===
                    0 && (
                    <p className="text-xs text-gray-400 text-center py-3">
                      No attachments added.
                    </p>
                  )}

                </div>

              </section>

              {/* ==================================================
                  EXTRA LINKS
              ================================================== */}

              <section>

                <div className="flex justify-between items-center border-b pb-2 mb-4">

                  <h4 className="font-bold text-gray-800">
                    4. Extra Links
                  </h4>

                  <button
                    type="button"
                    onClick={addExtraLink}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-cyan-100 hover:bg-cyan-200 text-cyan-800 rounded-lg"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Link
                  </button>

                </div>

                <div className="space-y-3">

                  {extraLinks.map(
                    (link, index) => (

                      <div
                        key={
                          link.id ??
                          index
                        }
                        className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_auto] gap-2 bg-gray-50 border border-gray-200 p-3 rounded-lg"
                      >

                        <input
                          value={link.title}
                          onChange={(e) =>
                            updateExtraLink(
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          className="input"
                          placeholder="Link title"
                        />

                        <input
                          value={link.url}
                          onChange={(e) =>
                            updateExtraLink(
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          className="input font-mono"
                          placeholder="https://..."
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeExtraLink(
                              index
                            )
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    )
                  )}

                  {extraLinks.length ===
                    0 && (
                    <p className="text-xs text-gray-400 text-center py-3">
                      No extra links added.
                    </p>
                  )}

                </div>

              </section>

              {/* ==================================================
                  STATUS
              ================================================== */}

              <section>

                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">
                  5. Status
                </h4>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as
                        | "Active"
                        | "Inactive"
                    )
                  }
                  className="input"
                >
                  <option value="Active">
                    Active — Visible on public page
                  </option>

                  <option value="Inactive">
                    Inactive — Hidden from public page
                  </option>
                </select>

              </section>

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold shadow"
                >
                  {submitting
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Create Event"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* ====================================================
          INPUT STYLES
      ==================================================== */}

      <style>{`
        .input {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          transition: all 0.15s ease;
          background: white;
        }

        .input:focus {
          border-color: #f43f5e;
          box-shadow: 0 0 0 2px rgba(244, 63, 94, 0.12);
        }

        .input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.35rem;
        }
      `}</style>

    </div>
  );
}