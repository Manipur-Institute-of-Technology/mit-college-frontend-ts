import { useEffect, useMemo, useState } from "react";

import Swal, {
  type SweetAlertOptions,
} from "sweetalert2";

import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";

import {
  Bell,
  Info,
  Download as DownloadIcon,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  Edit2,
  X,
  Upload,
  FileText,
  CalendarDays,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Archive,
  Loader2,
} from "lucide-react";

/* ==========================================================================
   SWEET ALERT CONFIGURATION
========================================================================== */

const SWEET_ALERT_COLOR = "#be123c";

/* ==========================================================================
   SWEET ALERT HELPERS
========================================================================== */

const showAlert = (
  options: SweetAlertOptions
) =>
  Swal.fire({
    confirmButtonColor: SWEET_ALERT_COLOR,
    ...options,
  });

const showSuccessAlert = (
  title: string,
  text?: string
) =>
  showAlert({
    icon: "success",
    title,
    text,
  });

const showErrorAlert = (
  title: string,
  text?: string
) =>
  showAlert({
    icon: "error",
    title,
    text,
  });

const showLoadingAlert = (
  title: string
) =>
  Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

/* ==========================================================================
   TYPES
========================================================================== */

export type CategoryType =
  | "exam"
  | "admission"
  | "form fillup"
  | "miscellaneous";

export type ResourceItem = {
  _id: string;
  title: string;
  fileName: string;

  type?: CategoryType;

  submittedBy?: any;

  active_date?: string;

  createdAt?: string;
  updatedAt?: string;
};

type ActiveBlockTab =
  | "notifications"
  | "information"
  | "downloads";

type NotificationFilter =
  | "active"
  | "inactive";

type EditItem = ResourceItem | null;

/* ==========================================================================
   CATEGORY OPTIONS
========================================================================== */

const CATEGORY_OPTIONS: {
  value: CategoryType;
  label: string;
}[] = [
  {
    value: "exam",
    label: "Exam",
  },
  {
    value: "admission",
    label: "Admission",
  },
  {
    value: "form fillup",
    label: "Form Fillup",
  },
  {
    value: "miscellaneous",
    label: "Miscellaneous",
  },
];

/* ==========================================================================
   COMPONENT
========================================================================== */

export default function Admin_News_Notification() {
  const { token, role } = useAuth();

  /* ------------------------------------------------------------------------
     MAIN TAB
  ------------------------------------------------------------------------ */

  const [activeTab, setActiveTab] =
    useState<ActiveBlockTab>(
      "notifications"
    );

  /* ------------------------------------------------------------------------
     NOTIFICATION FILTER
  ------------------------------------------------------------------------ */

  const [
    notificationFilter,
    setNotificationFilter,
  ] =
    useState<NotificationFilter>(
      "active"
    );

  /* ------------------------------------------------------------------------
     DATA
  ------------------------------------------------------------------------ */

  const [notifications, setNotifications] =
    useState<ResourceItem[]>([]);

  const [
    inactiveNotifications,
    setInactiveNotifications,
  ] = useState<ResourceItem[]>([]);

  const [informations, setInformations] =
    useState<ResourceItem[]>([]);

  const [downloads, setDownloads] =
    useState<ResourceItem[]>([]);

  /* ------------------------------------------------------------------------
     LOADING
  ------------------------------------------------------------------------ */

  const [isLoading, setIsLoading] =
    useState(false);

  /* ------------------------------------------------------------------------
     ADD / EDIT MODAL
  ------------------------------------------------------------------------ */

  const [showModal, setShowModal] =
    useState(false);

  const [isEditMode, setIsEditMode] =
    useState(false);

  const [editingItem, setEditingItem] =
    useState<EditItem>(null);

  /* ------------------------------------------------------------------------
     FORM
  ------------------------------------------------------------------------ */

  const [formTitle, setFormTitle] =
    useState("");

  const [formType, setFormType] =
    useState<CategoryType>(
      "miscellaneous"
    );

  const [activeDate, setActiveDate] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  /* ==========================================================================
     FETCH DATA
  ========================================================================== */

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const [
        activeNotificationResponse,
        inactiveNotificationResponse,
        informationResponse,
        downloadResponse,
      ] = await Promise.all([
        apiClient.get("/notification"),
        apiClient.get(
          "/notification/inactive"
        ),
        apiClient.get("/information"),
        apiClient.get("/download"),
      ]);

      const activeNotificationData =
        activeNotificationResponse.data
          ?.data ??
        activeNotificationResponse.data ??
        [];

      const inactiveNotificationData =
        inactiveNotificationResponse.data
          ?.data ??
        inactiveNotificationResponse.data ??
        [];

      const informationData =
        informationResponse.data?.data ??
        informationResponse.data ??
        [];

      const downloadData =
        downloadResponse.data?.data ??
        downloadResponse.data ??
        [];

      setNotifications(
        Array.isArray(
          activeNotificationData
        )
          ? activeNotificationData
          : []
      );

      setInactiveNotifications(
        Array.isArray(
          inactiveNotificationData
        )
          ? inactiveNotificationData
          : []
      );

      setInformations(
        Array.isArray(
          informationData
        )
          ? informationData
          : []
      );

      setDownloads(
        Array.isArray(downloadData)
          ? downloadData
          : []
      );
    } catch (error) {
      showErrorAlert(
        "Failed to Load Data",
        "Failed to load data from backend."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================================================
     INITIAL LOAD
  ========================================================================== */

  useEffect(() => {
    if (token && role === "admin") {
      fetchData();
    }
  }, [token, role]);

  /* ==========================================================================
     RESET FORM
  ========================================================================== */

  const resetForm = () => {
    setFormTitle("");
    setFormType("miscellaneous");
    setActiveDate("");
    setSelectedFile(null);

    setEditingItem(null);
    setIsEditMode(false);
  };

  /* ==========================================================================
     OPEN ADD MODAL
  ========================================================================== */

  const openAddModal = () => {
    resetForm();

    setShowModal(true);
  };

  /* ==========================================================================
     FORMAT DATE FOR INPUT
  ========================================================================== */

  const formatDateTimeLocal = (
    value?: string
  ) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (
      Number.isNaN(date.getTime())
    ) {
      return "";
    }

    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const hours = String(
      date.getHours()
    ).padStart(2, "0");

    const minutes = String(
      date.getMinutes()
    ).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  /* ==========================================================================
     OPEN EDIT MODAL
  ========================================================================== */

  const openEditModal = (
    item: ResourceItem
  ) => {
    setIsEditMode(true);

    setEditingItem(item);

    setFormTitle(
      item.title || ""
    );

    if (
      activeTab ===
      "notifications"
    ) {
      setFormType(
        item.type ||
          "miscellaneous"
      );

      setActiveDate(
        formatDateTimeLocal(
          item.active_date
        )
      );
    } else {
      setFormType(
        "miscellaneous"
      );

      setActiveDate("");
    }

    setSelectedFile(null);

    setShowModal(true);
  };

  /* ==========================================================================
     CLOSE MODAL
  ========================================================================== */

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setShowModal(false);

    resetForm();
  };

  /* ==========================================================================
     FILE URL
  ========================================================================== */

  const getFileUrl = (
    item: ResourceItem,
    tab: ActiveBlockTab
  ) => {
    if (!item.fileName) {
      return "#";
    }

    let folder = "";

    if (
      tab === "notifications"
    ) {
      folder = "notifications";
    } else if (
      tab === "information"
    ) {
      folder = "informations";
    } else {
      folder = "downloads";
    }

    return `${API_BASE_URL}/uploads/${folder}/${item.fileName}`;
  };

  /* ==========================================================================
     SUBMIT ADD / EDIT
  ========================================================================== */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    /* ----------------------------------------------------------------------
       TITLE VALIDATION
    ---------------------------------------------------------------------- */

    if (!formTitle.trim()) {
      await showErrorAlert(
        "Title Required",
        "Please enter a title."
      );

      return;
    }

    /* ----------------------------------------------------------------------
       FILE VALIDATION
    ---------------------------------------------------------------------- */

    if (
      !isEditMode &&
      !selectedFile
    ) {
      await showErrorAlert(
        "File Required",
        "Please select a file."
      );

      return;
    }

    /* ----------------------------------------------------------------------
       NOTIFICATION ACTIVE DATE
    ---------------------------------------------------------------------- */

    if (
      activeTab ===
        "notifications" &&
      !activeDate
    ) {
      await showErrorAlert(
        "Active Date Required",
        "Please select an active date."
      );

      return;
    }

    try {
      setIsSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "title",
        formTitle.trim()
      );

      /* --------------------------------------------------------------------
         NOTIFICATIONS ONLY
      -------------------------------------------------------------------- */

      if (
        activeTab ===
        "notifications"
      ) {
        formData.append(
          "type",
          formType
        );

        formData.append(
          "active_date",
          activeDate
        );
      }

      /* --------------------------------------------------------------------
         FILE
      -------------------------------------------------------------------- */

      if (selectedFile) {
        formData.append(
          "file",
          selectedFile
        );
      }

      let endpoint = "";

      /* --------------------------------------------------------------------
         ENDPOINT
      -------------------------------------------------------------------- */

      if (
        activeTab ===
        "notifications"
      ) {
        endpoint = isEditMode
          ? `/notification/update/${editingItem?._id}`
          : "/notification/add";
      } else if (
        activeTab ===
        "information"
      ) {
        endpoint = isEditMode
          ? `/information/update/${editingItem?._id}`
          : "/information/add";
      } else {
        endpoint = isEditMode
          ? `/download/update/${editingItem?._id}`
          : "/download/add";
      }

      /* --------------------------------------------------------------------
         LOADING ALERT
      -------------------------------------------------------------------- */

      showLoadingAlert(
        isEditMode
          ? "Updating..."
          : "Adding..."
      );

      /* --------------------------------------------------------------------
         API CALL
      -------------------------------------------------------------------- */

      if (isEditMode) {
        await apiClient.put(
          endpoint,
          formData
        );
      } else {
        await apiClient.post(
          endpoint,
          formData
        );
      }

      /* --------------------------------------------------------------------
         CLOSE LOADING ALERT
      -------------------------------------------------------------------- */

      Swal.close();

      /* --------------------------------------------------------------------
         CLOSE FORM
      -------------------------------------------------------------------- */

      setShowModal(false);

      resetForm();

      /* --------------------------------------------------------------------
         REFRESH DATA
      -------------------------------------------------------------------- */

      await fetchData();

      /* --------------------------------------------------------------------
         SUCCESS ALERT
      -------------------------------------------------------------------- */

      await showSuccessAlert(
        isEditMode
          ? "Updated Successfully"
          : "Added Successfully",
        isEditMode
          ? "The item has been updated successfully."
          : "The item has been added successfully."
      );
    } catch (error: any) {
      Swal.close();

      const backendMessage =
        error?.response?.data
          ?.error ||
        error?.response?.data
          ?.message ||
        "Operation failed.";

      await showErrorAlert(
        "Operation Failed",
        backendMessage
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ==========================================================================
     DELETE ITEM
  ========================================================================== */

  const confirmDelete = async (
    item: ResourceItem
  ) => {
    /* ----------------------------------------------------------------------
       SWEET ALERT CONFIRMATION
    ---------------------------------------------------------------------- */

    const result =
      await showAlert({
        icon: "warning",

        title: "Delete Item?",

        html: `
          <div style="text-align:center;">
            <p style="margin-bottom:12px;">
              Are you sure you want to permanently delete this item?
            </p>

            <div style="
              background:#f9fafb;
              border:1px solid #e5e7eb;
              border-radius:12px;
              padding:12px;
              margin-top:12px;
              text-align:left;
            ">
              <div style="
                font-size:11px;
                font-weight:700;
                text-transform:uppercase;
                color:#9ca3af;
                margin-bottom:4px;
              ">
                Item
              </div>

              <div style="
                font-size:14px;
                font-weight:600;
                color:#111827;
                word-break:break-word;
              ">
                ${item.title}
              </div>

              ${
                item.fileName
                  ? `
                    <div style="
                      font-size:12px;
                      color:#6b7280;
                      margin-top:6px;
                      word-break:break-all;
                    ">
                      File: ${item.fileName}
                    </div>
                  `
                  : ""
              }
            </div>

            <p style="
              margin-top:14px;
              font-size:12px;
              color:#6b7280;
            ">
              This action cannot be undone.
            </p>
          </div>
        `,

        showCancelButton: true,

        confirmButtonText:
          "Yes, Delete",

        cancelButtonText:
          "Cancel",

        confirmButtonColor:
          SWEET_ALERT_COLOR,

        cancelButtonColor:
          SWEET_ALERT_COLOR,

        customClass: {
          popup: "rounded-xl",
        },
      });

    if (!result.isConfirmed) {
      return;
    }

    /* ----------------------------------------------------------------------
       DELETE
    ---------------------------------------------------------------------- */

    try {
      let endpoint = "";

      if (
        activeTab ===
        "notifications"
      ) {
        endpoint = `/notification/delete/${item._id}`;
      } else if (
        activeTab ===
        "information"
      ) {
        endpoint = `/information/delete/${item._id}`;
      } else {
        endpoint = `/download/delete/${item._id}`;
      }

      /* --------------------------------------------------------------------
         LOADING
      -------------------------------------------------------------------- */

      showLoadingAlert(
        "Deleting..."
      );

      await apiClient.delete(
        endpoint
      );

      /* --------------------------------------------------------------------
         CLOSE LOADING
      -------------------------------------------------------------------- */

      Swal.close();

      /* --------------------------------------------------------------------
         REFRESH
      -------------------------------------------------------------------- */

      await fetchData();

      /* --------------------------------------------------------------------
         SUCCESS
      -------------------------------------------------------------------- */

      await showSuccessAlert(
        "Deleted Successfully",
        `"${item.title}" has been deleted successfully.`
      );
    } catch (error: any) {
      Swal.close();

      const backendMessage =
        error?.response?.data
          ?.error ||
        error?.response?.data
          ?.message ||
        "Failed to delete item.";

      await showErrorAlert(
        "Delete Failed",
        backendMessage
      );
    }
  };

  /* ==========================================================================
     CURRENT LIST
  ========================================================================== */

  const currentList =
    useMemo(() => {
      if (
        activeTab ===
        "notifications"
      ) {
        return notificationFilter ===
          "active"
          ? notifications
          : inactiveNotifications;
      }

      if (
        activeTab ===
        "information"
      ) {
        return informations;
      }

      return downloads;
    }, [
      activeTab,
      notificationFilter,
      notifications,
      inactiveNotifications,
      informations,
      downloads,
    ]);

  /* ==========================================================================
     PAGE TITLE
  ========================================================================== */

  const pageTitle =
    activeTab ===
    "notifications"
      ? notificationFilter ===
        "active"
        ? "Active News & Notifications"
        : "Inactive News & Notifications"
      : activeTab ===
        "information"
      ? "Information"
      : "Downloads";

  /* ==========================================================================
     ACCESS CONTROL
  ========================================================================== */

  if (
    !token ||
    role !== "admin"
  ) {
    return (
      <div className="p-4">
        <SignIn_SignUP role="admin" />
      </div>
    );
  }

  /* ==========================================================================
     UI
  ========================================================================== */

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* ================================================================
            HEADER
        ================================================================ */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="p-3 rounded-xl bg-rose-100">

                <Bell className="w-7 h-7 text-rose-700" />

              </div>

              <div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  News, Information & Downloads
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Manage announcements,
                  information and downloadable
                  resources.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={fetchData}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm disabled:opacity-50"
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
                onClick={
                  openAddModal
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-sm shadow-sm"
              >

                <Plus className="w-4 h-4" />

                Add Item

              </button>

            </div>

          </div>

        </div>

        {/* ================================================================
            MAIN TABS
        ================================================================ */}

        <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-sm overflow-x-auto">

          <div className="flex gap-2 min-w-max">

            {/* NOTIFICATIONS */}

            <button
              type="button"
              onClick={() => {
                setActiveTab(
                  "notifications"
                );

                setNotificationFilter(
                  "active"
                );
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab ===
                "notifications"
                  ? "bg-rose-700 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >

              <Bell className="w-4 h-4" />

              News & Notifications

              <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
                {notifications.length +
                  inactiveNotifications.length}
              </span>

            </button>

            {/* INFORMATION */}

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "information"
                )
              }
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab ===
                "information"
                  ? "bg-rose-700 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >

              <Info className="w-4 h-4" />

              Information

              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100">
                {informations.length}
              </span>

            </button>

            {/* DOWNLOADS */}

            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  "downloads"
                )
              }
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab ===
                "downloads"
                  ? "bg-rose-700 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >

              <DownloadIcon className="w-4 h-4" />

              Downloads

              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100">
                {downloads.length}
              </span>

            </button>

          </div>

        </div>

        {/* ================================================================
            NOTIFICATION FILTER
        ================================================================ */}

        {activeTab ===
          "notifications" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-2 shadow-sm">

            <div className="flex flex-col sm:flex-row gap-2">

              <button
                type="button"
                onClick={() =>
                  setNotificationFilter(
                    "active"
                  )
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  notificationFilter ===
                  "active"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >

                <CheckCircle2 className="w-4 h-4" />

                Active

                <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
                  {notifications.length}
                </span>

              </button>

              <button
                type="button"
                onClick={() =>
                  setNotificationFilter(
                    "inactive"
                  )
                }
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  notificationFilter ===
                  "inactive"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >

                <Archive className="w-4 h-4" />

                Inactive / Expired

                <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
                  {inactiveNotifications.length}
                </span>

              </button>

            </div>

          </div>
        )}

        {/* ================================================================
            TABLE
        ================================================================ */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="p-5 bg-gray-50 border-b border-gray-200">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

              <div>

                <h2 className="font-bold text-gray-900 text-lg">
                  {pageTitle}
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Total items:{" "}
                  <span className="font-semibold">
                    {
                      currentList.length
                    }
                  </span>
                </p>

              </div>

              {activeTab ===
                "notifications" &&
                notificationFilter ===
                  "inactive" && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">

                    <AlertTriangle className="w-4 h-4" />

                    These notifications have
                    passed their active date.

                  </div>
                )}

            </div>

          </div>

          {/* LOADING */}

          {isLoading ? (
            <div className="p-14 flex flex-col items-center justify-center gap-3">

              <RefreshCw className="w-7 h-7 text-rose-700 animate-spin" />

              <p className="text-sm text-gray-500">
                Loading data...
              </p>

            </div>
          ) : currentList.length ===
            0 ? (

            /* EMPTY */

            <div className="p-14 text-center">

              <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">

                {activeTab ===
                "notifications" ? (
                  <Bell className="w-7 h-7 text-gray-400" />
                ) : activeTab ===
                  "information" ? (
                  <Info className="w-7 h-7 text-gray-400" />
                ) : (
                  <DownloadIcon className="w-7 h-7 text-gray-400" />
                )}

              </div>

              <h3 className="font-semibold text-gray-700">
                No items found
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                There are currently no
                items in this section.
              </p>

              <button
                type="button"
                onClick={
                  openAddModal
                }
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-sm font-semibold"
              >

                <Plus className="w-4 h-4" />

                Add Item

              </button>

            </div>
          ) : (

            /* TABLE */

            <div className="overflow-x-auto">

              <table className="w-full text-left min-w-[800px]">

                <thead className="bg-gray-100 border-b border-gray-200">

                  <tr>

                    <th className="px-5 py-3 text-xs font-bold uppercase text-gray-600">
                      Title
                    </th>

                    {activeTab ===
                      "notifications" && (
                      <th className="px-5 py-3 text-xs font-bold uppercase text-gray-600">
                        Category
                      </th>
                    )}

                    {activeTab ===
                      "notifications" && (
                      <th className="px-5 py-3 text-xs font-bold uppercase text-gray-600">
                        Active Date
                      </th>
                    )}

                    <th className="px-5 py-3 text-xs font-bold uppercase text-gray-600">
                      File
                    </th>

                    <th className="px-5 py-3 text-xs font-bold uppercase text-gray-600 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-gray-200">

                  {currentList.map(
                    (item) => {

                      const fileUrl =
                        getFileUrl(
                          item,
                          activeTab
                        );

                      const isExpired =
                        activeTab ===
                          "notifications" &&
                        !!item.active_date &&
                        new Date(
                          item.active_date
                        ).getTime() <
                          Date.now();

                      return (
                        <tr
                          key={
                            item._id
                          }
                          className="hover:bg-gray-50 transition"
                        >

                          {/* TITLE */}

                          <td className="px-5 py-4">

                            <div className="flex items-start gap-3">

                              <div className="p-2 rounded-lg bg-rose-50">

                                <FileText className="w-4 h-4 text-rose-700" />

                              </div>

                              <div>

                                <p className="font-semibold text-gray-900">
                                  {item.title ||
                                    "Untitled"}
                                </p>

                                {item.createdAt && (
                                  <p className="text-xs text-gray-400 mt-1">
                                    Added{" "}
                                    {new Date(
                                      item.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                )}

                              </div>

                            </div>

                          </td>

                          {/* CATEGORY */}

                          {activeTab ===
                            "notifications" && (
                            <td className="px-5 py-4">

                              <span className="inline-flex px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold capitalize">

                                {item.type ||
                                  "miscellaneous"}

                              </span>

                            </td>
                          )}

                          {/* ACTIVE DATE */}

                          {activeTab ===
                            "notifications" && (
                            <td className="px-5 py-4">

                              {item.active_date ? (
                                <div>

                                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">

                                    <CalendarDays className="w-4 h-4 text-gray-400" />

                                    {new Date(
                                      item.active_date
                                    ).toLocaleDateString()}

                                  </div>

                                  <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">

                                    <Clock className="w-3.5 h-3.5" />

                                    {new Date(
                                      item.active_date
                                    ).toLocaleTimeString(
                                      [],
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      }
                                    )}

                                  </div>

                                  {isExpired && (
                                    <span className="inline-flex mt-2 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase">
                                      Expired
                                    </span>
                                  )}

                                </div>
                              ) : (
                                "-"
                              )}

                            </td>
                          )}

                          {/* FILE */}

                          <td className="px-5 py-4">

                            <a
                              href={
                                fileUrl
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition"
                            >

                              <ExternalLink className="w-3.5 h-3.5" />

                              View File

                            </a>

                          </td>

                          {/* ACTIONS */}

                          <td className="px-5 py-4">

                            <div className="flex items-center justify-end gap-2">

                              {/* EDIT */}

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    item
                                  )
                                }
                                className="p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition"
                                title="Edit"
                              >

                                <Edit2 className="w-4 h-4" />

                              </button>

                              {/* DELETE */}

                              <button
                                type="button"
                                onClick={() =>
                                  confirmDelete(
                                    item
                                  )
                                }
                                className="p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:text-red-700 hover:bg-red-50 transition"
                                title="Delete"
                              >

                                <Trash2 className="w-4 h-4" />

                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* ====================================================================
          ADD / EDIT MODAL
      ==================================================================== */}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={closeModal}
        >

          <div
            className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden max-h-[95vh] overflow-y-auto"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">

              <div>

                <h3 className="text-lg font-bold text-gray-900">

                  {isEditMode
                    ? `Edit ${
                        activeTab ===
                        "notifications"
                          ? "Notification"
                          : activeTab ===
                            "information"
                          ? "Information"
                          : "Download"
                      }`
                    : `Add ${
                        activeTab ===
                        "notifications"
                          ? "Notification"
                          : activeTab ===
                            "information"
                          ? "Information"
                          : "Download"
                      }`}

                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Fill in the details below.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={
                  isSubmitting
                }
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              >

                <X className="w-5 h-5" />

              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
              className="p-6 space-y-5"
            >

              {/* TITLE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Title / Heading *
                </label>

                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) =>
                    setFormTitle(
                      e.target.value
                    )
                  }
                  placeholder="Enter title or heading"
                  maxLength={100}
                  required
                  className="w-full border border-gray-300 rounded-xl px-3.5 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none"
                />

                <p className="text-[11px] text-gray-400 mt-1 text-right">
                  {formTitle.length}/100
                </p>

              </div>

              {/* CATEGORY */}

              {activeTab ===
                "notifications" && (
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Category *
                  </label>

                  <select
                    value={
                      formType
                    }
                    onChange={(e) =>
                      setFormType(
                        e.target
                          .value as CategoryType
                      )
                    }
                    className="w-full border border-gray-300 rounded-xl px-3.5 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none bg-white"
                  >

                    {CATEGORY_OPTIONS.map(
                      (
                        option
                      ) => (
                        <option
                          key={
                            option.value
                          }
                          value={
                            option.value
                          }
                        >
                          {
                            option.label
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>
              )}

              {/* ACTIVE DATE */}

              {activeTab ===
                "notifications" && (
                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Active Date *
                  </label>

                  <div className="relative">

                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                    <input
                      type="datetime-local"
                      value={
                        activeDate
                      }
                      onChange={(e) =>
                        setActiveDate(
                          e.target
                            .value
                        )
                      }
                      required
                      className="w-full border border-gray-300 rounded-xl pl-10 pr-3.5 py-3 text-sm focus:ring-2 focus:ring-rose-500 focus:border-rose-500 focus:outline-none"
                    />

                  </div>

                  <p className="text-xs text-gray-400 mt-1.5">
                    After this date and
                    time, the notification
                    will appear under
                    Inactive / Expired.
                  </p>

                </div>
              )}

              {/* FILE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Document / PDF{" "}
                  {!isEditMode &&
                    "*"}
                </label>

                <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 hover:border-rose-400 transition">

                  <div className="flex flex-col items-center justify-center text-center">

                    <div className="p-3 rounded-full bg-rose-50 mb-3">

                      <Upload className="w-6 h-6 text-rose-700" />

                    </div>

                    <label className="cursor-pointer">

                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold">

                        <Upload className="w-4 h-4" />

                        {isEditMode
                          ? "Replace File"
                          : "Choose File"}

                      </span>

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) =>
                          setSelectedFile(
                            e.target
                              .files?.[0] ||
                              null
                          )
                        }
                        className="hidden"
                      />

                    </label>

                    <p className="text-xs text-gray-400 mt-2">
                      PDF, DOC, DOCX, JPG,
                      JPEG or PNG
                    </p>

                    {/* CURRENT FILE */}

                    {isEditMode &&
                      editingItem?.fileName && (
                        <div className="mt-4 w-full bg-gray-50 rounded-lg p-3 text-left">

                          <p className="text-[11px] text-gray-400 uppercase font-bold">
                            Current File
                          </p>

                          <p className="text-xs text-gray-700 mt-1 truncate">
                            {
                              editingItem.fileName
                            }
                          </p>

                        </div>
                      )}

                    {/* SELECTED FILE */}

                    {selectedFile && (
                      <div className="mt-3 w-full bg-emerald-50 border border-emerald-200 rounded-lg p-3">

                        <div className="flex items-center gap-2">

                          <FileText className="w-4 h-4 text-emerald-700" />

                          <span className="text-xs font-semibold text-emerald-800 truncate">
                            {
                              selectedFile.name
                            }
                          </span>

                        </div>

                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={
                    isSubmitting
                  }
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting
                  }
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-semibold text-sm shadow-sm disabled:opacity-50"
                >

                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />

                      Saving...
                    </>
                  ) : (
                    <>
                      {isEditMode ? (
                        <Edit2 className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}

                      {isEditMode
                        ? "Update"
                        : "Add Item"}

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