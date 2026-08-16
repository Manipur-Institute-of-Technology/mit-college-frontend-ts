import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  showAlert,
  showLoadingAlert,
} from "~/utils/alert_utils";

import {
  Award,
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
} from "lucide-react";

import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";

import apiClient, {
  API_BASE_URL,
} from "~/utils/apiClient";

// ============================================================
// TYPES
// ============================================================

export type ResourceType = "link" | "file";

export type NirfResource = {
  type: ResourceType;
  url: string;
  file: string;
};

export type NirfItem = {
  _id: string;
  header: string;
  description: string;
  resource: NirfResource;
  year: string;
  createdAt?: string;
  updatedAt?: string;
};

// ============================================================
// COMPONENT
// ============================================================

export default function Admin_NIRF() {
  const { token, role } = useAuth();

  // ==========================================================
  // DATA
  // ==========================================================

  const [items, setItems] = useState<NirfItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(false);

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
    useState("");

  const [description, setDescription] =
    useState("");

  const [year, setYear] =
    useState(
      new Date()
        .getFullYear()
        .toString()
    );

  const [resourceType, setResourceType] =
    useState<ResourceType>("link");

  const [resourceUrl, setResourceUrl] =
    useState("");

  const [resourceFile, setResourceFile] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  // ==========================================================
  // SUBMIT
  // ==========================================================

  const [submitting, setSubmitting] =
    useState(false);

  // ==========================================================
  // FETCH
  // ==========================================================

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const response =
        await apiClient.get("/nirf");

      const data: NirfItem[] =
        response.data?.data ??
        (Array.isArray(response.data)
          ? response.data
          : []);

      setItems(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to load NIRF records."
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

    setHeader("");

    setDescription("");

    setYear(
      new Date()
        .getFullYear()
        .toString()
    );

    setResourceType("link");

    setResourceUrl("");

    setResourceFile("");

    setSelectedFile(null);
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
    item: NirfItem
  ) => {
    setEditingId(item._id);

    setHeader(
      item.header || ""
    );

    setDescription(
      item.description || ""
    );

    setYear(
      item.year || ""
    );

    const type: ResourceType =
      item.resource?.type === "file"
        ? "file"
        : "link";

    setResourceType(type);

    setResourceUrl(
      item.resource?.url || ""
    );

    setResourceFile(
      item.resource?.file || ""
    );

    setSelectedFile(null);

    setShowModal(true);
  };

  // ==========================================================
  // CLOSE MODAL
  // ==========================================================

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setShowModal(false);

    resetForm();
  };

  // ==========================================================
  // BUILD FORMDATA
  // ==========================================================

  const buildFormData = () => {
    const formData =
      new FormData();

    formData.append(
      "header",
      header.trim()
    );

    formData.append(
      "description",
      description.trim()
    );

    formData.append(
      "year",
      year.trim()
    );

    formData.append(
      "resource[type]",
      resourceType
    );

    // ========================================================
    // LINK
    // ========================================================

    if (resourceType === "link") {
      formData.append(
        "resource[url]",
        resourceUrl.trim()
      );

      formData.append(
        "resource[file]",
        ""
      );

      return formData;
    }

    // ========================================================
    // FILE
    // ========================================================

    formData.append(
      "resource[url]",
      ""
    );

    if (selectedFile) {
      formData.append(
        "file",
        selectedFile,
        selectedFile.name
      );
    }

    return formData;
  };

  // ==========================================================
  // HANDLE SUBMIT
  // ==========================================================

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!header.trim()) {
      toast.error(
        "Please enter the NIRF header."
      );

      return;
    }

    if (!description.trim()) {
      toast.error(
        "Please enter the description."
      );

      return;
    }

    if (!year.trim()) {
      toast.error(
        "Please enter the NIRF year."
      );

      return;
    }

    if (
      resourceType === "link" &&
      !resourceUrl.trim()
    ) {
      toast.error(
        "Please enter the resource URL."
      );

      return;
    }

    if (
      resourceType === "file" &&
      !selectedFile &&
      !resourceFile
    ) {
      toast.error(
        "Please select a document."
      );

      return;
    }

    // ========================================================
    // FILE SIZE VALIDATION
    // ========================================================

    if (selectedFile) {
      const maxSize =
        10 * 1024 * 1024;

      if (
        selectedFile.size >
        maxSize
      ) {
        toast.error(
          "File size must not exceed 10 MB."
        );

        return;
      }
    }

    setSubmitting(true);

    try {
      const formData =
        buildFormData();

      // ======================================================
      // EDIT
      // ======================================================

      if (editingId) {
        showLoadingAlert({
          title: "Updating NIRF...",
          text:
            "Please wait while the NIRF record is being updated.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
        });

        const response =
          await apiClient.put(
            `/nirf/edit/${editingId}`,
            formData,
            {
              timeout: 120000,
            }
          );

        if (
          !response.data?.success
        ) {
          throw new Error(
            response.data?.message ||
              "Failed to update NIRF record."
          );
        }

        const updatedItem =
          response.data?.data;

        if (updatedItem) {
          setItems((prev) =>
            prev.map((item) =>
              item._id === editingId
                ? updatedItem
                : item
            )
          );
        } else {
          await fetchData();
        }

        await showAlert({
          title: "Updated!",
          text:
            "NIRF record updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1800,
          timerProgressBar: true,
        });
      }

      // ======================================================
      // ADD
      // ======================================================

      else {
        showLoadingAlert({
          title: "Adding NIRF...",
          text:
            "Please wait while the NIRF record is being added.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
        });

        const response =
          await apiClient.post(
            "/nirf/add",
            formData,
            {
              timeout: 120000,
            }
          );

        if (
          !response.data?.success
        ) {
          throw new Error(
            response.data?.message ||
              "Failed to add NIRF record."
          );
        }

        const createdItem =
          response.data?.data;

        if (createdItem) {
          setItems((prev) => [
            createdItem,
            ...prev,
          ]);
        } else {
          await fetchData();
        }

        await showAlert({
          title: "Added!",
          text:
            "NIRF record added successfully.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1800,
          timerProgressBar: true,
        });
      }

      setShowModal(false);

      resetForm();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to save NIRF record.";

      await showAlert({
        title: editingId
          ? "Update Failed"
          : "Add Failed",
        text: message,
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
    headerName: string
  ) => {
    // ========================================================
    // CONFIRMATION
    // ========================================================

    const result =
      await showAlert({
        title: "Delete NIRF Record?",
        text: `"${headerName}" will be permanently deleted.`,
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

    if (!result.isConfirmed) {
      return;
    }

    // ========================================================
    // DELETE
    // ========================================================

    try {
      showLoadingAlert({
        title: "Deleting...",
        text:
          "Please wait while the NIRF record is being deleted.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
      });

      const response =
        await apiClient.delete(
          `/nirf/delete/${id}`,
          {
            timeout: 30000,
          }
        );

      if (
        !response.data?.success
      ) {
        throw new Error(
          response.data?.message ||
            "Failed to delete NIRF record."
        );
      }

      // ======================================================
      // REMOVE FROM UI
      // ======================================================

      setItems((prev) =>
        prev.filter(
          (item) =>
            item._id !== id
        )
      );

      // ======================================================
      // SUCCESS
      // ======================================================

      await showAlert({
        title: "Deleted!",
        text:
          "NIRF record deleted successfully.",
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
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Failed to delete NIRF record.",

        icon: "error",

        confirmButtonColor:
          "#be123c",
      });
    }
  };

  // ==========================================================
  // RESOURCE URL
  // ==========================================================

  const getResourceUrl = (
    item: NirfItem
  ) => {
    if (!item.resource) {
      return "";
    }

    // ========================================================
    // LINK
    // ========================================================

    if (
      item.resource.type ===
      "link"
    ) {
      return (
        item.resource.url || ""
      );
    }

    // ========================================================
    // FILE
    // ========================================================

    const file =
      item.resource.file || "";

    if (!file) {
      return "";
    }

    if (
      file.startsWith(
        "http://"
      ) ||
      file.startsWith(
        "https://"
      )
    ) {
      return file;
    }

    if (file.startsWith("/")) {
      return `${API_BASE_URL}${file}`;
    }

    return `${API_BASE_URL}/${file}`;
  };

  // ==========================================================
  // AUTH
  // ==========================================================

  if (!token || role !== "admin") {
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

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-200">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">

            <Award className="w-8 h-8 text-rose-700" />

            NIRF Management

          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Create, edit and manage NIRF
            submissions and resources.
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

            Add NIRF
          </button>

        </div>
      </div>

      {/* ====================================================
          NOTICE
      ==================================================== */}

      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">

        <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" />

        <div>

          <strong>
            NIRF Management:
          </strong>{" "}

          Each NIRF record contains a
          header, description, year and
          either a web link or uploaded
          document.

        </div>

      </div>

      {/* ====================================================
          LIST
      ==================================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">

          <div>

            <h2 className="font-bold text-gray-800 text-lg">
              NIRF Records
            </h2>

            <p className="text-xs text-gray-500 mt-0.5">
              Manage NIRF submissions
            </p>

          </div>

          <span className="text-xs text-gray-500 font-medium">
            {items.length}{" "}
            {items.length === 1
              ? "entry"
              : "entries"}
          </span>

        </div>

        {/* ==================================================
            LOADING
        ================================================== */}

        {isLoading ? (

          <div className="p-16 flex flex-col items-center justify-center text-gray-500">

            <RefreshCw className="w-8 h-8 animate-spin mb-3" />

            <p className="font-medium">
              Loading NIRF records...
            </p>

          </div>

        ) : items.length === 0 ? (

          /* ==================================================
             EMPTY
          ================================================== */

          <div className="p-16 text-center">

            <Award className="w-12 h-12 mx-auto text-gray-300 mb-4" />

            <p className="font-semibold text-gray-600">
              No NIRF records found.
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Click "Add NIRF" to create
              the first record.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg"
            >
              <Plus className="w-4 h-4" />

              Add NIRF
            </button>

          </div>

        ) : (

          /* ==================================================
             TABLE
          ================================================== */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="bg-gray-100 text-xs uppercase text-gray-600">

                  <th className="px-5 py-3 text-left font-semibold">
                    Year
                  </th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Header
                  </th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Description
                  </th>

                  <th className="px-5 py-3 text-left font-semibold">
                    Resource
                  </th>

                  <th className="px-5 py-3 text-right font-semibold">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-200">

                {items.map((item) => {

                  const resourceUrl =
                    getResourceUrl(
                      item
                    );

                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50 transition"
                    >

                      {/* YEAR */}

                      <td className="px-5 py-4 align-top">

                        <span className="inline-flex items-center gap-1.5 bg-cyan-100 text-cyan-800 border border-cyan-200 px-2.5 py-1 rounded-full text-xs font-bold">

                          <Calendar className="w-3.5 h-3.5" />

                          {item.year ||
                            "-"}

                        </span>

                      </td>

                      {/* HEADER */}

                      <td className="px-5 py-4 align-top">

                        <div className="flex gap-2">

                          <Award className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />

                          <p className="font-semibold text-gray-900 max-w-[280px] break-words">
                            {item.header ||
                              "-"}
                          </p>

                        </div>

                      </td>

                      {/* DESCRIPTION */}

                      <td className="px-5 py-4 align-top">

                        <p className="text-sm text-gray-600 max-w-[320px] line-clamp-3">
                          {item.description ||
                            "-"}
                        </p>

                      </td>

                      {/* RESOURCE */}

                      <td className="px-5 py-4 align-top">

                        {resourceUrl ? (

                          <a
                            href={
                              resourceUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 max-w-[220px] text-rose-700 hover:text-rose-900 text-sm font-semibold"
                          >

                            {item.resource
                              ?.type ===
                            "file" ? (
                              <FileText className="w-4 h-4 flex-shrink-0" />
                            ) : (
                              <LinkIcon className="w-4 h-4 flex-shrink-0" />
                            )}

                            <span className="truncate">

                              {item.resource
                                ?.type ===
                              "file"
                                ? "Open File"
                                : "Open Link"}

                            </span>

                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />

                          </a>

                        ) : (

                          <span className="text-xs text-gray-400">
                            No resource
                          </span>

                        )}

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
                            title="Edit NIRF"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                item._id,
                                item.header
                              )
                            }
                            className="p-2 bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-700 rounded-lg border border-gray-200 transition"
                            title="Delete NIRF"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ====================================================
          MODAL
      ==================================================== */}

      {showModal && (

        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onMouseDown={closeModal}
        >

          <div
            className="bg-white w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            {/* ==================================================
                MODAL HEADER
            ================================================== */}

            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

              <div>

                <h3 className="text-xl font-bold text-gray-800">

                  {editingId
                    ? "Edit NIRF Record"
                    : "Add NIRF Record"}

                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Enter the NIRF information
                  below.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-7"
            >

              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

              <section>

                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">
                  1. NIRF Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* HEADER */}

                  <div>

                    <label className="label">
                      Header *
                    </label>

                    <input
                      type="text"
                      value={header}
                      onChange={(e) =>
                        setHeader(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="NIRF 2026 Engineering"
                      required
                    />

                  </div>

                  {/* YEAR */}

                  <div>

                    <label className="label">
                      Year *
                    </label>

                    <input
                      type="text"
                      value={year}
                      onChange={(e) =>
                        setYear(
                          e.target.value
                        )
                      }
                      className="input"
                      placeholder="2026"
                      required
                    />

                  </div>

                </div>

                {/* DESCRIPTION */}

                <div className="mt-4">

                  <label className="label">
                    Description *
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    className="input min-h-[140px] resize-y"
                    placeholder="Enter description for the NIRF submission..."
                    required
                  />

                </div>

              </section>

              {/* =================================================
                  RESOURCE
              ================================================= */}

              <section>

                <h4 className="font-bold text-gray-800 border-b pb-2 mb-4">
                  2. Resource
                </h4>

                {/* RESOURCE TYPE */}

                <div>

                  <label className="label">
                    Resource Type
                  </label>

                  <div className="grid grid-cols-2 gap-3">

                    {/* LINK */}

                    <button
                      type="button"
                      onClick={() => {

                        setResourceType(
                          "link"
                        );

                        setSelectedFile(
                          null
                        );

                        setResourceFile(
                          ""
                        );

                      }}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition ${
                        resourceType ===
                        "link"
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >

                      <LinkIcon className="w-4 h-4" />

                      Link

                    </button>

                    {/* FILE */}

                    <button
                      type="button"
                      onClick={() => {

                        setResourceType(
                          "file"
                        );

                        setResourceUrl(
                          ""
                        );

                      }}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold transition ${
                        resourceType ===
                        "file"
                          ? "border-rose-500 bg-rose-50 text-rose-700"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >

                      <FileText className="w-4 h-4" />

                      File

                    </button>

                  </div>

                </div>

                {/* =================================================
                    LINK RESOURCE
                ================================================= */}

                {resourceType ===
                "link" ? (

                  <div className="mt-4">

                    <label className="label">
                      Resource URL *
                    </label>

                    <div className="relative">

                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

                      <input
                        type="url"
                        value={
                          resourceUrl
                        }
                        onChange={(e) =>
                          setResourceUrl(
                            e.target.value
                          )
                        }
                        className="input pl-9"
                        placeholder="https://example.com/nirf"
                        required
                      />

                    </div>

                  </div>

                ) : (

                  /* =================================================
                     FILE RESOURCE
                  ================================================= */

                  <div className="mt-4">

                    <label className="label">
                      Upload Document *
                    </label>

                    <div className="relative">

                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={(e) => {

                          const file =
                            e.target.files?.[0] ||
                            null;

                          setSelectedFile(
                            file
                          );

                          if (file) {
                            setResourceFile(
                              ""
                            );
                          }

                        }}
                        className="input pl-9"
                      />

                    </div>

                    <p className="text-xs text-gray-400 mt-1.5">
                      Maximum file size:
                      10 MB. Supported:
                      PDF, DOC, DOCX,
                      XLS and XLSX.
                    </p>

                    {/* NEW FILE */}

                    {selectedFile && (

                      <div className="mt-3 flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">

                        <FileText className="w-4 h-4 text-rose-600 flex-shrink-0" />

                        <span className="truncate flex-1">
                          {
                            selectedFile.name
                          }
                        </span>

                        <span className="text-xs text-gray-400 whitespace-nowrap">

                          {(
                            selectedFile.size /
                            1024 /
                            1024
                          ).toFixed(2)}

                          {" "}
                          MB

                        </span>

                      </div>

                    )}

                    {/* EXISTING FILE */}

                    {editingId &&
                      resourceFile &&
                      !selectedFile && (

                        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">

                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />

                          <span className="truncate flex-1">
                            Existing document:
                            {" "}
                            {
                              resourceFile
                            }
                          </span>

                          {getResourceUrl(
                            {
                              _id:
                                editingId,
                              header,
                              description,
                              year,
                              resource: {
                                type: "file",
                                url: "",
                                file:
                                  resourceFile,
                              },
                            }
                          ) && (

                            <a
                              href={getResourceUrl(
                                {
                                  _id:
                                    editingId,
                                  header,
                                  description,
                                  year,
                                  resource: {
                                    type: "file",
                                    url: "",
                                    file:
                                      resourceFile,
                                  },
                                }
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-rose-700 hover:text-rose-900 font-semibold"
                            >
                              Open
                            </a>

                          )}

                        </div>

                      )}

                  </div>

                )}

              </section>

              {/* =================================================
                  ACTIONS
              ================================================= */}

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 rounded-lg text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
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
                        : "Add NIRF"}
                    </>

                  )}

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