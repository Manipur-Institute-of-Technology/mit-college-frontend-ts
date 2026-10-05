import { useEffect, useState, type FormEvent } from "react";
import { toast } from "react-toastify";

import {
  showAlert,
  showLoadingAlert,
} from "~/utils/alert_utils";

import {
  Plus,
  Trash2,
  RefreshCw,
  Calendar,
  Link as LinkIcon,
  FileText,
  ExternalLink,
  Edit2,
  AlertTriangle,
  X,
  Save,
  Clock,
  MapPin,
  UserRound,
  Mail,
  Phone,
  Globe,
  Building2,
} from "lucide-react";

import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import apiClient from "~/utils/apiClient";
import Pagination from "../Pagination";

// ============================================================
// TYPES
// ============================================================

export type AicteVaaniAttachment = {
  id?: number;
  title: string;
  url: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  file?: File;
};

export type AicteVaaniLink = {
  id?: number;
  title: string;
  url: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  file?: File;
};

export type AicteVaaniContact = {
  coordinator: string;
  coCoordinator: string;
  department: string;
  website: string;
  email: string;
  phone: string;
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
  attachments: AicteVaaniAttachment[];
  extraLinks: AicteVaaniLink[];
  status: "Active" | "Inactive";
  createdAt?: string;
  updatedAt?: string;
};

// ============================================================
// HELPERS
// ============================================================

const emptyContact: AicteVaaniContact = {
  coordinator: "",
  coCoordinator: "",
  department: "",
  website: "",
  email: "",
  phone: "",
};

const makeLink = (): AicteVaaniLink => ({
  id: Date.now(),
  title: "",
  url: "",
});

const makeAttachment = (): AicteVaaniAttachment => ({
  id: Date.now(),
  title: "",
  url: "",
});

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

const ALLOWED_FILE_TYPES =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.webp";

// ============================================================
// CREATED TIME HELPER
// ============================================================

// Uses createdAt when available.
// Falls back to MongoDB ObjectId timestamp when createdAt
// is not available.
const getAicteVaaniCreatedTime = (
  item: AicteVaaniItem
): number => {
  if (item.createdAt) {
    const createdTime =
      new Date(item.createdAt).getTime();

    if (!Number.isNaN(createdTime)) {
      return createdTime;
    }
  }

  // MongoDB ObjectId contains the creation timestamp
  if (
    /^[0-9a-fA-F]{24}$/.test(
      item._id
    )
  ) {
    return (
      parseInt(
        item._id.substring(0, 8),
        16
      ) * 1000
    );
  }

  return 0;
};

// ============================================================
// SORT NEWEST FIRST
// ============================================================

const sortAicteVaaniNewestFirst = (
  list: AicteVaaniItem[]
): AicteVaaniItem[] => {
  return [...list].sort(
    (a, b) =>
      getAicteVaaniCreatedTime(b) -
      getAicteVaaniCreatedTime(a)
  );
};

// ============================================================
// COMPONENT
// ============================================================

export default function Admin_AICTE_VAANI() {
  const { token, role } = useAuth();

  // ==========================================================
  // DATA
  // ==========================================================

  const [items, setItems] = useState<
    AicteVaaniItem[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [aicteFilter, setAicteFilter] =
    useState<"Active" | "Inactive">(
      "Active"
    );

  const [
    activeAictePage,
    setActiveAictePage,
  ] = useState(1);

  const [
    inactiveAictePage,
    setInactiveAictePage,
  ] = useState(1);

  const aictePageSize = 10;

  const activeItems = items.filter(
    (item) =>
      item.status !== "Inactive"
  );

  const inactiveItems = items.filter(
    (item) =>
      item.status === "Inactive"
  );

  const selectedItems =
    aicteFilter === "Active"
      ? activeItems
      : inactiveItems;

  const selectedPage =
    aicteFilter === "Active"
      ? activeAictePage
      : inactiveAictePage;

  const safeAictePage = Math.min(
    selectedPage,
    Math.max(
      1,
      Math.ceil(
        selectedItems.length /
          aictePageSize
      )
    )
  );

  const visibleAicteItems =
    selectedItems.slice(
      (safeAictePage - 1) *
        aictePageSize,
      safeAictePage *
        aictePageSize
    );

  // ==========================================================
  // MODAL
  // ==========================================================

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  // ==========================================================
  // FORM
  // ==========================================================

  const [header, setHeader] =
    useState(
      "AICTE-VAANI WORKSHOP (2 Days)"
    );

  const [topic, setTopic] =
    useState("");

  const [dates, setDates] =
    useState("");

  const [time, setTime] =
    useState("9:00 AM – 5:00 PM");

  const [venue, setVenue] =
    useState("MIT, MU Campus");

  const [information, setInformation] =
    useState("");

  const [status, setStatus] =
    useState<
      "Active" | "Inactive"
    >("Active");

  const [contact, setContact] =
    useState<AicteVaaniContact>(
      emptyContact
    );

  const [attachments, setAttachments] =
    useState<
      AicteVaaniAttachment[]
    >([]);

  const [extraLinks, setExtraLinks] =
    useState<AicteVaaniLink[]>(
      []
    );

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const [submitting, setSubmitting] =
    useState(false);

  // ==========================================================
  // FETCH
  // GET /aicte-vaani
  // ==========================================================

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response =
        await apiClient.get(
          "/aicte-vaani"
        );

      const data: AicteVaaniItem[] =
        response.data?.data ??
        (Array.isArray(
          response.data
        )
          ? response.data
          : []);

      // ======================================================
      // NEWEST FIRST
      // ======================================================

      const sortedData =
        sortAicteVaaniNewestFirst(
          Array.isArray(data)
            ? data
            : []
        );

      setItems(sortedData);
    } catch (error: any) {
      toast.error(
        error?.response?.data
          ?.message ||
          error?.response?.data
            ?.error ||
          error?.message ||
          "Failed to load AICTE-VAANI records."
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
    if (
      token &&
      role === "admin"
    ) {
      fetchData();
    }
  }, [token, role]);

  // ==========================================================
  // RESET FORM
  // ==========================================================

  const resetForm = () => {
    setEditingId(null);

    setHeader(
      "AICTE-VAANI WORKSHOP (2 Days)"
    );

    setTopic("");
    setDates("");
    setTime(
      "9:00 AM – 5:00 PM"
    );
    setVenue(
      "MIT, MU Campus"
    );
    setInformation("");
    setStatus("Active");

    setContact({
      ...emptyContact,
    });

    setAttachments([]);
    setExtraLinks([]);
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

  const openEditModal = (
    item: AicteVaaniItem
  ) => {
    setEditingId(item._id);

    setHeader(
      item.header || ""
    );

    setTopic(
      item.topic || ""
    );

    setDates(
      item.dates || ""
    );

    setTime(
      item.time ||
        "9:00 AM – 5:00 PM"
    );

    setVenue(
      item.venue ||
        "MIT, MU Campus"
    );

    setInformation(
      item.information || ""
    );

    setStatus(
      item.status ===
        "Inactive"
        ? "Inactive"
        : "Active"
    );

    setContact({
      coordinator:
        item.contact
          ?.coordinator || "",

      coCoordinator:
        item.contact
          ?.coCoordinator || "",

      department:
        item.contact
          ?.department || "",

      website:
        item.contact
          ?.website || "",

      email:
        item.contact
          ?.email || "",

      phone:
        item.contact
          ?.phone || "",
    });

    setAttachments(
      Array.isArray(
        item.attachments
      )
        ? item.attachments.map(
            (attachment) => ({
              id: attachment.id,
              title:
                attachment.title ||
                "",
              url:
                attachment.url ||
                "",
              originalName:
                attachment.originalName ||
                "",
              mimeType:
                attachment.mimeType ||
                "",
              size:
                attachment.size ||
                0,
            })
          )
        : []
    );

    setExtraLinks(
      Array.isArray(
        item.extraLinks
      )
        ? item.extraLinks.map(
            (link) => ({
              id: link.id,
              title:
                link.title || "",
              url:
                link.url || "",
              originalName:
                link.originalName ||
                "",
              mimeType:
                link.mimeType || "",
              size:
                link.size || 0,
            })
          )
        : []
    );

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
  // CONTACT UPDATE
  // ==========================================================

  const updateContact = (
    field: keyof AicteVaaniContact,
    value: string
  ) => {
    setContact((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================================
  // ATTACHMENTS
  // ==========================================================

  const addAttachment = () => {
    setAttachments((prev) => [
      ...prev,
      makeAttachment(),
    ]);
  };

  const removeAttachment = (
    index: number
  ) => {
    setAttachments((prev) =>
      prev.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const updateAttachmentTitle = (
    index: number,
    value: string
  ) => {
    setAttachments((prev) =>
      prev.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                title: value,
              }
            : item
      )
    );
  };

  const updateAttachmentFile = (
    index: number,
    file: File | undefined
  ) => {
    if (!file) return;

    if (
      file.size >
      MAX_ATTACHMENT_SIZE
    ) {
      toast.error(
        `File exceeds the 10 MB limit: ${file.name}`
      );
      return;
    }

    setAttachments((prev) =>
      prev.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                file,
                title:
                  item.title.trim() ||
                  file.name,
              }
            : item
      )
    );
  };

  // ==========================================================
  // EXTRA LINKS
  // ==========================================================

  const addExtraLink = () => {
    setExtraLinks((prev) => [
      ...prev,
      makeLink(),
    ]);
  };

  const removeExtraLink = (
    index: number
  ) => {
    setExtraLinks((prev) =>
      prev.filter(
        (_, itemIndex) =>
          itemIndex !== index
      )
    );
  };

  const updateExtraLinkTitle = (
    index: number,
    value: string
  ) => {
    setExtraLinks((prev) =>
      prev.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                title: value,
              }
            : item
      )
    );
  };

  const updateExtraLinkFile = (
    index: number,
    file: File | undefined
  ) => {
    if (!file) return;

    if (
      file.size >
      MAX_ATTACHMENT_SIZE
    ) {
      toast.error(
        `File exceeds the 10 MB limit: ${file.name}`
      );
      return;
    }

    setExtraLinks((prev) =>
      prev.map(
        (item, itemIndex) =>
          itemIndex === index
            ? {
                ...item,
                file,
                title:
                  item.title.trim() ||
                  file.name,
              }
            : item
      )
    );
  };

  // ==========================================================
  // BUILD MULTIPART FORM DATA
  // ==========================================================

  const buildFormData = () => {
    const formData =
      new FormData();

    formData.append(
      "header",
      header.trim()
    );

    formData.append(
      "topic",
      topic.trim()
    );

    formData.append(
      "dates",
      dates.trim()
    );

    formData.append(
      "time",
      time.trim()
    );

    formData.append(
      "venue",
      venue.trim()
    );

    formData.append(
      "information",
      information.trim()
    );

    formData.append(
      "status",
      status
    );

    formData.append(
      "contact",
      JSON.stringify({
        coordinator:
          contact.coordinator.trim(),

        coCoordinator:
          contact.coCoordinator.trim(),

        department:
          contact.department.trim(),

        website:
          contact.website.trim(),

        email:
          contact.email.trim(),

        phone:
          contact.phone.trim(),
      })
    );

    // ========================================================
    // ATTACHMENTS
    // ========================================================

    const newAttachments =
      attachments.filter(
        (attachment) =>
          Boolean(
            attachment.file
          )
      );

    const existingAttachments =
      attachments
        .filter(
          (attachment) =>
            !attachment.file &&
            Boolean(
              attachment.url
            )
        )
        .map((attachment) => ({
          id: attachment.id,
          title:
            attachment.title.trim(),
          url: attachment.url,
          originalName:
            attachment.originalName ||
            "",
          mimeType:
            attachment.mimeType ||
            "",
          size:
            attachment.size || 0,
        }));

    formData.append(
      "existingAttachments",
      JSON.stringify(
        existingAttachments
      )
    );

    formData.append(
      "attachmentTitles",
      JSON.stringify(
        newAttachments.map(
          (attachment) =>
            attachment.title.trim()
        )
      )
    );

    newAttachments.forEach(
      (attachment) => {
        if (attachment.file) {
          formData.append(
            "attachments",
            attachment.file
          );
        }
      }
    );

    // ========================================================
    // EXTRA LINKS
    // ========================================================

    const newExtraLinks =
      extraLinks.filter(
        (item) =>
          Boolean(item.file)
      );

    const existingExtraLinks =
      extraLinks
        .filter(
          (item) =>
            !item.file &&
            Boolean(item.url)
        )
        .map((item) => ({
          id: item.id,
          title:
            item.title.trim(),
          url: item.url,
          originalName:
            item.originalName ||
            "",
          mimeType:
            item.mimeType ||
            "",
          size:
            item.size || 0,
        }));

    formData.append(
      "existingExtraLinks",
      JSON.stringify(
        existingExtraLinks
      )
    );

    formData.append(
      "extraLinkTitles",
      JSON.stringify(
        newExtraLinks.map(
          (item) =>
            item.title.trim()
        )
      )
    );

    newExtraLinks.forEach(
      (item) => {
        if (item.file) {
          formData.append(
            "extraLinks",
            item.file
          );
        }
      }
    );

    return formData;
  };

  // ==========================================================
  // HANDLE SUBMIT
  // ==========================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!topic.trim()) {
      toast.error(
        "Please enter the workshop topic."
      );
      return;
    }

    if (!dates.trim()) {
      toast.error(
        "Please enter the event dates."
      );
      return;
    }

    setSubmitting(true);

    try {
      const formData =
        buildFormData();

      if (editingId) {
        showLoadingAlert({
          title:
            "Updating AICTE-VAANI...",
          text:
            "Please wait while the AICTE-VAANI event is being updated.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
        });

        const response =
          await apiClient.put(
            `/aicte-vaani/edit/${editingId}`,
            formData,
            {
              timeout: 60000,
            }
          );

        const updatedItem =
          response.data?.data;

        if (!updatedItem) {
          throw new Error(
            response.data?.message ||
              "Failed to update AICTE-VAANI event."
          );
        }

        setItems((prev) =>
          sortAicteVaaniNewestFirst(
            prev.map((item) =>
              item._id ===
              editingId
                ? updatedItem
                : item
            )
          )
        );

        await showAlert({
          title: "Updated!",
          text:
            "AICTE-VAANI event updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1800,
          timerProgressBar: true,
        });
      } else {
        showLoadingAlert({
          title:
            "Adding AICTE-VAANI...",
          text:
            "Please wait while the AICTE-VAANI event is being added.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
        });

        const response =
          await apiClient.post(
            "/aicte-vaani/add",
            formData,
            {
              timeout: 60000,
            }
          );

        const createdItem =
          response.data?.data;

        if (!createdItem) {
          throw new Error(
            response.data?.message ||
              "Failed to create AICTE-VAANI event."
          );
        }

        setItems((prev) =>
          sortAicteVaaniNewestFirst(
            [
              createdItem,
              ...prev,
            ]
          )
        );

        await showAlert({
          title: "Added!",
          text:
            "AICTE-VAANI event created successfully.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1800,
          timerProgressBar: true,
        });
      }

      setShowModal(false);
      resetForm();
    } catch (error: any) {
      await showAlert({
        title: editingId
          ? "Update Failed"
          : "Add Failed",

        text:
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          error?.message ||
          "Failed to save AICTE-VAANI event.",

        icon: "error",
        confirmButtonText: "OK",
      });
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
    const result =
      await showAlert({
        title:
          "Delete AICTE-VAANI Event?",

        text:
          `"${topicName}" will be permanently deleted.`,

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor:
          "#be123c",
        cancelButtonColor:
          "#6b7280",
        confirmButtonText:
          "Yes, Delete",
        cancelButtonText:
          "Cancel",
        reverseButtons: true,
        focusCancel: true,
      });

    if (!result.isConfirmed)
      return;

    try {
      showLoadingAlert({
        title: "Deleting...",
        text:
          "Please wait while the AICTE-VAANI event is being deleted.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
      });

      const response =
        await apiClient.delete(
          `/aicte-vaani/delete/${id}`,
          {
            timeout: 30000,
          }
        );

      if (!response.data) {
        throw new Error(
          "Failed to delete AICTE-VAANI event."
        );
      }

      setItems((prev) =>
        prev.filter(
          (item) =>
            item._id !== id
        )
      );

      await showAlert({
        title: "Deleted!",
        text:
          "AICTE-VAANI event deleted successfully.",
        icon: "success",
        confirmButtonColor:
          "#be123c",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (error: any) {
      await showAlert({
        title: "Delete Failed",
        text:
          error?.response?.data
            ?.message ||
          error?.response?.data
            ?.error ||
          error?.message ||
          "Failed to delete AICTE-VAANI event.",

        icon: "error",
        confirmButtonColor:
          "#be123c",
      });
    }
  };

  // ==========================================================
  // AUTH
  // ==========================================================

  if (
    !token ||
    role !== "admin"
  ) {
    return (
      <div className="p-4">
        <SignIn_SignUP
          role="admin"
        />
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FileText className="w-8 h-8 text-rose-700" />

            AICTE-VAANI Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Create, edit and manage AICTE-VAANI
            workshops, resources and contact
            information.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
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
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg shadow-md transition"
          >
            <Plus className="w-4 h-4" />
            Add AICTE-VAANI
          </button>
        </div>
      </div>

      {/* NOTICE */}

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" />

        <div>
          <strong>
            AICTE-VAANI Management:
          </strong>{" "}
          Each event contains a topic,
          dates, time, venue, information,
          contact details, attachments,
          extra links and an active/inactive
          status.
        </div>
      </div>

      {/* LIST */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="font-bold text-gray-800 text-lg">
              {aicteFilter} AICTE-VAANI
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Manage AICTE-VAANI workshop
              events
            </p>
          </div>

          <span className="text-xs text-gray-500 font-medium">
            {selectedItems.length}{" "}
            {selectedItems.length === 1
              ? "entry"
              : "entries"}
          </span>
        </div>

        <div className="flex gap-2 border-b border-gray-200 p-3">
          <button
            type="button"
            onClick={() =>
              setAicteFilter("Active")
            }
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              aicteFilter === "Active"
                ? "bg-emerald-600 text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            ACTIVE{" "}
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {activeItems.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              setAicteFilter(
                "Inactive"
              )
            }
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${
              aicteFilter ===
              "Inactive"
                ? "bg-gray-700 text-white"
                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
            }`}
          >
            INACTIVE{" "}
            <span className="ml-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {inactiveItems.length}
            </span>
          </button>
        </div>

        {isLoading ? (
          <div className="p-16 flex flex-col items-center justify-center text-gray-500">
            <RefreshCw className="w-8 h-8 animate-spin mb-3" />

            <p className="font-medium">
              Loading AICTE-VAANI events...
            </p>
          </div>
        ) : selectedItems.length ===
          0 ? (
          <div className="p-16 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />

            <p className="font-semibold text-gray-600">
              No AICTE-VAANI events
              found.
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Click "Add AICTE-VAANI"
              to create the first
              event.
            </p>

            <button
              type="button"
              onClick={
                openAddModal
              }
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg"
            >
              <Plus className="w-4 h-4" />
              Add AICTE-VAANI
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px]">
              <thead>
                <tr className="bg-gray-100 text-xs uppercase text-gray-600">
                  <th className="px-5 py-3 text-left font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Topic
                  </th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Dates
                  </th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Time / Venue
                  </th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Contact
                  </th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Resources
                  </th>

                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {visibleAicteItems.map(
                  (item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* STATUS */}

                      <td className="px-5 py-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                            item.status ===
                            "Active"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                          }`}
                        >
                          {
                            item.status
                          }
                        </span>
                      </td>

                      {/* TOPIC */}

                      <td className="px-5 py-4 align-top">
                        <div className="max-w-[300px]">
                          <p className="text-xs font-semibold text-rose-700 mb-1">
                            {item.header ||
                              "AICTE-VAANI WORKSHOP"}
                          </p>

                          <p className="font-semibold text-gray-900 break-words">
                            {item.topic ||
                              "-"}
                          </p>

                          {item.information && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {
                                item.information
                              }
                            </p>
                          )}
                        </div>
                      </td>

                      {/* DATES */}

                      <td className="px-5 py-4 align-top">
                        <span className="inline-flex items-center gap-1.5 bg-cyan-100 text-cyan-800 border border-cyan-200 px-2.5 py-1 rounded-full text-xs font-bold">
                          <Calendar className="w-3.5 h-3.5" />

                          {item.dates ||
                            "-"}
                        </span>
                      </td>

                      {/* TIME / VENUE */}

                      <td className="px-5 py-4 align-top">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-start gap-2 text-gray-700">
                            <Clock className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />

                            <span>
                              {item.time ||
                                "-"}
                            </span>
                          </div>

                          <div className="flex items-start gap-2 text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />

                            <span className="max-w-[220px]">
                              {item.venue ||
                                "-"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1 text-xs text-gray-600 max-w-[220px]">

                          {item.contact
                            ?.coordinator && (
                            <div className="flex gap-2">
                              <UserRound className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />

                              <span>
                                {
                                  item
                                    .contact
                                    .coordinator
                                }
                              </span>
                            </div>
                          )}

                          {item.contact
                            ?.department && (
                            <div className="flex gap-2">
                              <Building2 className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />

                              <span>
                                {
                                  item
                                    .contact
                                    .department
                                }
                              </span>
                            </div>
                          )}

                          {item.contact
                            ?.email && (
                            <div className="flex gap-2">
                              <Mail className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />

                              <span className="break-all">
                                {
                                  item
                                    .contact
                                    .email
                                }
                              </span>
                            </div>
                          )}

                          {item.contact
                            ?.phone && (
                            <div className="flex gap-2">
                              <Phone className="w-3.5 h-3.5 mt-0.5 text-gray-400 flex-shrink-0" />

                              <span>
                                {
                                  item
                                    .contact
                                    .phone
                                }
                              </span>
                            </div>
                          )}

                          {item.contact
                            ?.website && (
                            <a
                              href={
                                item
                                  .contact
                                  .website
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex gap-2 text-rose-700 hover:text-rose-900 font-semibold"
                            >
                              <Globe className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />

                              <span>
                                Website
                              </span>

                              <ExternalLink className="w-3 h-3 mt-0.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* RESOURCES */}

                      <td className="px-5 py-4 align-top">
                        <div className="space-y-2 max-w-[240px]">

                          {item.attachments
                            ?.length >
                            0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-1">
                                Attachments
                              </p>

                              <div className="space-y-1">
                                {item.attachments.map(
                                  (
                                    link,
                                    index
                                  ) =>
                                    link.url && (
                                      <a
                                        key={
                                          link.id ??
                                          index
                                        }
                                        href={
                                          link.url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-rose-700 hover:text-rose-900 font-semibold"
                                      >
                                        <FileText className="w-3.5 h-3.5 flex-shrink-0" />

                                        <span className="truncate">
                                          {link.title ||
                                            "Attachment"}
                                        </span>

                                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                      </a>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {item.extraLinks
                            ?.length >
                            0 && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 mb-1">
                                Extra Links
                              </p>

                              <div className="space-y-1">
                                {item.extraLinks.map(
                                  (
                                    link,
                                    index
                                  ) =>
                                    link.url && (
                                      <a
                                        key={
                                          link.id ??
                                          index
                                        }
                                        href={
                                          link.url
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-900 font-semibold"
                                      >
                                        <LinkIcon className="w-3.5 h-3.5 flex-shrink-0" />

                                        <span className="truncate">
                                          {link.title ||
                                            link.originalName ||
                                            "Extra Link"}
                                        </span>

                                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                      </a>
                                    )
                                )}
                              </div>
                            </div>
                          )}

                          {!item.attachments
                            ?.length &&
                            !item.extraLinks
                              ?.length && (
                              <span className="text-xs text-gray-400">
                                No resources
                              </span>
                            )}
                        </div>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4 align-top">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                item
                              )
                            }
                            className="p-2 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-700 rounded-lg border border-gray-200 transition"
                            title="Edit AICTE-VAANI"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item._id,
                                item.topic
                              )
                            }
                            className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 rounded-lg border border-gray-200 transition"
                            title="Delete AICTE-VAANI"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          currentPage={
            safeAictePage
          }
          totalItems={
            selectedItems.length
          }
          pageSize={
            aictePageSize
          }
          onPageChange={
            aicteFilter === "Active"
              ? setActiveAictePage
              : setInactiveAictePage
          }
        />
      </div>

      {/* MODAL */}

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={
            closeModal
          }
        >
          <div
            className="bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
            onMouseDown={(e) =>
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
                  Enter the AICTE-VAANI event
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
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="p-6 space-y-7"
            >

              {/* BASIC INFORMATION */}

              <section>
                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">
                  1. Event Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="label">
                      Header
                    </label>

                    <input
                      type="text"
                      value={
                        header
                      }
                      onChange={(
                        e
                      ) =>
                        setHeader(
                          e.target
                            .value
                        )
                      }
                      className="input"
                      placeholder="AICTE-VAANI WORKSHOP (2 Days)"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Status *
                    </label>

                    <select
                      value={
                        status
                      }
                      onChange={(
                        e
                      ) =>
                        setStatus(
                          e.target
                            .value ===
                            "Inactive"
                            ? "Inactive"
                            : "Active"
                        )
                      }
                      className="input"
                      required
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="label">
                    Workshop Topic *
                  </label>

                  <input
                    type="text"
                    value={
                      topic
                    }
                    onChange={(
                      e
                    ) =>
                      setTopic(
                        e.target
                          .value
                      )
                    }
                    className="input"
                    placeholder="Enter workshop topic"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                  <div>
                    <label className="label">
                      Event Dates *
                    </label>

                    <input
                      type="text"
                      value={
                        dates
                      }
                      onChange={(
                        e
                      ) =>
                        setDates(
                          e.target
                            .value
                        )
                      }
                      className="input"
                      placeholder="12–13 October 2026"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      Time
                    </label>

                    <input
                      type="text"
                      value={
                        time
                      }
                      onChange={(
                        e
                      ) =>
                        setTime(
                          e.target
                            .value
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
                      type="text"
                      value={
                        venue
                      }
                      onChange={(
                        e
                      ) =>
                        setVenue(
                          e.target
                            .value
                        )
                      }
                      className="input"
                      placeholder="MIT, MU Campus"
                    />
                  </div>

                </div>

                <div className="mt-4">
                  <label className="label">
                    Information
                  </label>

                  <textarea
                    value={
                      information
                    }
                    onChange={(
                      e
                    ) =>
                      setInformation(
                        e.target
                          .value
                      )
                    }
                    className="input min-h-[120px] resize-y"
                    placeholder="Enter additional information about the AICTE-VAANI workshop..."
                  />
                </div>
              </section>

              {/* CONTACT */}

              <section>
                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">
                  2. Contact Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="label">
                      Coordinator
                    </label>

                    <input
                      type="text"
                      value={
                        contact.coordinator
                      }
                      onChange={(
                        e
                      ) =>
                        updateContact(
                          "coordinator",
                          e.target
                            .value
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
                      type="text"
                      value={
                        contact.coCoordinator
                      }
                      onChange={(
                        e
                      ) =>
                        updateContact(
                          "coCoordinator",
                          e.target
                            .value
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
                      type="text"
                      value={
                        contact.department
                      }
                      onChange={(
                        e
                      ) =>
                        updateContact(
                          "department",
                          e.target
                            .value
                        )
                      }
                      className="input"
                      placeholder="Department / School"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Website
                    </label>

                    <input
                      type="url"
                      value={
                        contact.website
                      }
                      onChange={(
                        e
                      ) =>
                        updateContact(
                          "website",
                          e.target
                            .value
                        )
                      }
                      className="input"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Email
                    </label>

                    <input
                      type="email"
                      value={
                        contact.email
                      }
                      onChange={(
                        e
                      ) =>
                        updateContact(
                          "email",
                          e.target
                            .value
                        )
                      }
                      className="input"
                      placeholder="contact@example.com"
                    />
                  </div>

                  <div>
                    <label className="label">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={
                        contact.phone
                      }
                      onChange={(
                        e
                      ) =>
                        updateContact(
                          "phone",
                          e.target
                            .value
                        )
                      }
                      className="input"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>

                </div>
              </section>

              {/* ATTACHMENTS */}

              <section>
                <div className="flex items-center justify-between border-b pb-2 mb-4">

                  <div>
                    <h4 className="font-bold text-gray-800">
                      3. Attachments
                    </h4>

                    <p className="text-xs text-gray-500 mt-1">
                      Upload documents directly.
                      Maximum file size: 10 MB.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addAttachment
                    }
                    disabled={
                      submitting
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-lg text-xs font-semibold border border-gray-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Attachment
                  </button>
                </div>

                {attachments.length ===
                0 ? (
                  <p className="text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    No attachments added.
                    Click "Add Attachment"
                    to upload a file.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {attachments.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            item.id ??
                            index
                          }
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_auto] gap-3 items-end">

                            {/* TITLE */}

                            <div>
                              <label className="label">
                                Title
                              </label>

                              <input
                                type="text"
                                value={
                                  item.title
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateAttachmentTitle(
                                    index,
                                    e
                                      .target
                                      .value
                                  )
                                }
                                className="input"
                                placeholder="Workshop brochure"
                                disabled={
                                  submitting
                                }
                              />
                            </div>

                            {/* FILE */}

                            <div>
                              <label className="label">
                                Upload File
                              </label>

                              <input
                                type="file"
                                accept={
                                  ALLOWED_FILE_TYPES
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateAttachmentFile(
                                    index,
                                    e
                                      .target
                                      .files?.[0]
                                  )
                                }
                                disabled={
                                  submitting
                                }
                                className="input file:mr-3 file:rounded-md file:border-0 file:bg-rose-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-rose-700"
                              />

                              {item.file ? (
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                  <FileText className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />

                                  <span className="truncate">
                                    {
                                      item
                                        .file
                                        .name
                                    }
                                  </span>

                                  <span className="text-gray-400 flex-shrink-0">
                                    (
                                    {(
                                      item
                                        .file
                                        .size /
                                      (1024 *
                                        1024)
                                    ).toFixed(
                                      2
                                    )}{" "}
                                    MB)
                                  </span>
                                </div>
                              ) : item.url ? (
                                <div className="mt-2 flex items-center gap-2">
                                  <FileText className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />

                                  <a
                                    href={
                                      item.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-rose-700 hover:text-rose-900 font-semibold truncate"
                                  >
                                    {item.originalName ||
                                      item.title ||
                                      "View existing file"}
                                  </a>

                                  <ExternalLink className="w-3 h-3 text-rose-600 flex-shrink-0" />
                                </div>
                              ) : null}
                            </div>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                removeAttachment(
                                  index
                                )
                              }
                              disabled={
                                submitting
                              }
                              className="p-2.5 bg-white hover:bg-red-50 disabled:opacity-50 text-gray-500 hover:text-red-700 rounded-lg border border-gray-300"
                              title="Remove attachment"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

              {/* EXTRA LINKS */}

              <section>
                <div className="flex items-center justify-between border-b pb-2 mb-4">

                  <div>
                    <h4 className="font-bold text-gray-800">
                      4. Extra Links
                    </h4>

                    <p className="text-xs text-gray-500 mt-1">
                      Upload additional files such
                      as registration forms,
                      brochures or other resources.
                      Maximum file size: 10 MB.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={
                      addExtraLink
                    }
                    disabled={
                      submitting
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 rounded-lg text-xs font-semibold border border-gray-300"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Extra Link
                  </button>
                </div>

                {extraLinks.length ===
                0 ? (
                  <p className="text-sm text-gray-400 bg-gray-50 border border-gray-200 rounded-lg p-4">
                    No extra links added.
                    Click "Add Extra Link"
                    to upload a file.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {extraLinks.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          key={
                            item.id ??
                            index
                          }
                          className="bg-gray-50 border border-gray-200 rounded-xl p-4"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_auto] gap-3 items-end">

                            {/* TITLE */}

                            <div>
                              <label className="label">
                                Title
                              </label>

                              <input
                                type="text"
                                value={
                                  item.title
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateExtraLinkTitle(
                                    index,
                                    e
                                      .target
                                      .value
                                  )
                                }
                                className="input"
                                placeholder="Registration Form"
                                disabled={
                                  submitting
                                }
                              />
                            </div>

                            {/* FILE */}

                            <div>
                              <label className="label">
                                Upload File
                              </label>

                              <input
                                type="file"
                                accept={
                                  ALLOWED_FILE_TYPES
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateExtraLinkFile(
                                    index,
                                    e
                                      .target
                                      .files?.[0]
                                  )
                                }
                                disabled={
                                  submitting
                                }
                                className="input file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-blue-700"
                              />

                              {item.file ? (
                                <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                                  <LinkIcon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />

                                  <span className="truncate">
                                    {
                                      item
                                        .file
                                        .name
                                    }
                                  </span>

                                  <span className="text-gray-400 flex-shrink-0">
                                    (
                                    {(
                                      item
                                        .file
                                        .size /
                                      (1024 *
                                        1024)
                                    ).toFixed(
                                      2
                                    )}{" "}
                                    MB)
                                  </span>
                                </div>
                              ) : item.url ? (
                                <div className="mt-2 flex items-center gap-2">
                                  <LinkIcon className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />

                                  <a
                                    href={
                                      item.url
                                    }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-700 hover:text-blue-900 font-semibold truncate"
                                  >
                                    {item.originalName ||
                                      item.title ||
                                      "View existing file"}
                                  </a>

                                  <ExternalLink className="w-3 h-3 text-blue-600 flex-shrink-0" />
                                </div>
                              ) : null}
                            </div>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() =>
                                removeExtraLink(
                                  index
                                )
                              }
                              disabled={
                                submitting
                              }
                              className="p-2.5 bg-white hover:bg-red-50 disabled:opacity-50 text-gray-500 hover:text-red-700 rounded-lg border border-gray-300"
                              title="Remove extra link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

              {/* ACTIONS */}

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    submitting
                  }
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold shadow"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />

                      {editingId
                        ? "Save Changes"
                        : "Add AICTE-VAANI"}
                    </>
                  )}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* INPUT STYLES */}

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

        .input[type="file"] {
          padding: 0.4rem;
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