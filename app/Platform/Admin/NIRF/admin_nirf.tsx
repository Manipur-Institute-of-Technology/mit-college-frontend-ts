import {
  useEffect,
  useState,
} from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

import apiClient, {
  API_BASE_URL,
} from "~/utils/apiClient";

import { useAuth } from "~/context/AuthContext";

import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";

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

// ============================================================
// TYPES
// ============================================================

type ResourceType =
  | "link"
  | "file";

type NirfResource = {
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
  const {
    token,
    role,
  } = useAuth();

  // ============================================================
  // LIST
  // ============================================================

  const [
    nirfList,
    setNirfList,
  ] = useState<NirfItem[]>([]);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  // ============================================================
  // MODAL
  // ============================================================

  const [
    showModal,
    setShowModal,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<string | null>(
    null
  );

  // ============================================================
  // FORM
  // ============================================================

  const [
    formHeader,
    setFormHeader,
  ] = useState("");

  const [
    formDescription,
    setFormDescription,
  ] = useState("");

  const [
    formYear,
    setFormYear,
  ] = useState(
    new Date()
      .getFullYear()
      .toString()
  );

  const [
    resourceType,
    setResourceType,
  ] = useState<ResourceType>(
    "link"
  );

  const [
    resourceUrl,
    setResourceUrl,
  ] = useState("");

  const [
    resourceFile,
    setResourceFile,
  ] = useState("");

  const [
    selectedFile,
    setSelectedFile,
  ] = useState<File | null>(
    null
  );

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  // ============================================================
  // FETCH
  // ============================================================

  const fetchNirfData =
    async () => {
      setIsLoading(true);

      try {
        const response =
          await apiClient.get(
            "/nirf"
          );

        const data =
          response.data?.data ??
          [];

        setNirfList(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error: any) {
        console.error(
          "FETCH NIRF ERROR:",
          error
        );

        const message =
          error?.response
            ?.data?.message ||
          error?.message ||
          "Failed to fetch NIRF records.";

        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

  // ============================================================
  // INITIAL FETCH
  // ============================================================

  useEffect(() => {
    if (
      token &&
      role === "admin"
    ) {
      fetchNirfData();
    }
  }, [token, role]);

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setFormHeader("");

    setFormDescription("");

    setFormYear(
      new Date()
        .getFullYear()
        .toString()
    );

    setResourceType(
      "link"
    );

    setResourceUrl("");

    setResourceFile("");

    setSelectedFile(null);

    setEditingId(null);
  };

  // ============================================================
  // OPEN ADD
  // ============================================================

  const openAddModal = () => {
    resetForm();

    setShowModal(true);
  };

  // ============================================================
  // OPEN EDIT
  // ============================================================

  const openEditModal = (
    item: NirfItem
  ) => {
    setEditingId(
      item._id
    );

    setFormHeader(
      item.header || ""
    );

    setFormDescription(
      item.description || ""
    );

    setFormYear(
      item.year || ""
    );

    const type =
      item.resource?.type ===
      "file"
        ? "file"
        : "link";

    setResourceType(type);

    setResourceUrl(
      item.resource?.url ||
        ""
    );

    setResourceFile(
      item.resource?.file ||
        ""
    );

    setSelectedFile(null);

    setShowModal(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    if (submitting) {
      return;
    }

    setShowModal(false);

    resetForm();
  };

  // ============================================================
  // BUILD FORMDATA
  // ============================================================

  const buildFormData =
    () => {
      const formData =
        new FormData();

      formData.append(
        "header",
        formHeader.trim()
      );

      formData.append(
        "description",
        formDescription.trim()
      );

      formData.append(
        "year",
        formYear.trim()
      );

      formData.append(
        "resource[type]",
        resourceType
      );

      // ========================================================
      // LINK
      // ========================================================

      if (
        resourceType ===
        "link"
      ) {
        formData.append(
          "resource[url]",
          resourceUrl.trim()
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

  // ============================================================
  // DEBUG FORMDATA
  // ============================================================

  const debugFormData = (
    formData: FormData
  ) => {
    console.log(
      "========== NIRF FORM DATA =========="
    );

    for (
      const [
        key,
        value,
      ] of formData.entries()
    ) {
      if (
        value instanceof File
      ) {
        console.log(
          key,
          {
            name:
              value.name,
            size:
              value.size,
            type:
              value.type,
          }
        );
      } else {
        console.log(
          key,
          value
        );
      }
    }

    console.log(
      "====================================="
    );
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit =
    async (
      e: React.FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();

      // ========================================================
      // VALIDATION
      // ========================================================

      if (
        !formHeader.trim()
      ) {
        toast.error(
          "Please enter the NIRF header."
        );

        return;
      }

      if (
        !formDescription.trim()
      ) {
        toast.error(
          "Please enter the description."
        );

        return;
      }

      if (
        !formYear.trim()
      ) {
        toast.error(
          "Please enter the year."
        );

        return;
      }

      if (
        resourceType ===
          "link" &&
        !resourceUrl.trim()
      ) {
        toast.error(
          "Please enter the resource URL."
        );

        return;
      }

      if (
        resourceType ===
          "file" &&
        !selectedFile &&
        !resourceFile
      ) {
        toast.error(
          "Please select a document."
        );

        return;
      }

      setSubmitting(true);

      try {
        const formData =
          buildFormData();

        debugFormData(
          formData
        );

        let response;

        // ======================================================
        // EDIT
        // ======================================================

        if (editingId) {
          response =
            await apiClient.put(
              `/nirf/edit/${editingId}`,
              formData,
              {
                timeout:
                  120000,
              }
            );

          if (
            !response.data
              ?.success
          ) {
            throw new Error(
              response.data
                ?.message ||
                "Failed to update NIRF."
            );
          }

          const updatedItem =
            response.data
              ?.data;

          if (
            updatedItem
          ) {
            setNirfList(
              (
                previous
              ) =>
                previous.map(
                  (
                    item
                  ) =>
                    item._id ===
                    editingId
                      ? updatedItem
                      : item
                )
            );
          } else {
            await fetchNirfData();
          }

          toast.success(
            "NIRF record updated successfully."
          );
        }

        // ======================================================
        // ADD
        // ======================================================

        else {
          response =
            await apiClient.post(
              "/nirf/add",
              formData,
              {
                timeout:
                  120000,
              }
            );

          if (
            !response.data
              ?.success
          ) {
            throw new Error(
              response.data
                ?.message ||
                "Failed to add NIRF."
            );
          }

          const createdItem =
            response.data
              ?.data;

          if (
            createdItem
          ) {
            setNirfList(
              (
                previous
              ) => [
                createdItem,
                ...previous,
              ]
            );
          } else {
            await fetchNirfData();
          }

          toast.success(
            "NIRF record added successfully."
          );
        }

        setShowModal(
          false
        );

        resetForm();
      } catch (error: any) {
        console.error(
          "SAVE NIRF ERROR:",
          error
        );

        console.error(
          "STATUS:",
          error?.response
            ?.status
        );

        console.error(
          "RESPONSE:",
          error?.response
            ?.data
        );

        const message =
          error?.response
            ?.data?.message ||
          error?.response
            ?.data?.error ||
          error?.message ||
          "Failed to save NIRF record.";

        toast.error(
          message
        );
      } finally {
        setSubmitting(
          false
        );
      }
    };

  // ============================================================
  // DELETE
  // ============================================================

// ============================================================
// DELETE
// ============================================================

const handleDelete = async (
  id: string,
  header: string
) => {
  const result = await Swal.fire({
    title: "Delete NIRF Record?",
    text: `"${header}" will be permanently deleted.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
  });

  if (!result.isConfirmed) {
    return;
  }

  try {
    // Show loading popup
    Swal.fire({
      title: "Deleting...",
      text: "Please wait while the NIRF record is being deleted.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const response = await apiClient.delete(
      `/nirf/delete/${id}`,
      {
        timeout: 30000,
      }
    );

    console.log(
      "DELETE RESPONSE:",
      response.status,
      response.data
    );

    if (!response.data?.success) {
      throw new Error(
        response.data?.message ||
          "Failed to delete NIRF."
      );
    }

    // Remove from UI
    setNirfList((previous) =>
      previous.filter(
        (item) => item._id !== id
      )
    );

    // Success popup
    await Swal.fire({
      title: "Deleted!",
      text: "NIRF record deleted successfully.",
      icon: "success",
      confirmButtonText: "OK",
      timer: 2000,
      timerProgressBar: true,
    });
  } catch (error: any) {
    console.error(
      "DELETE NIRF ERROR:",
      error
    );

    console.error(
      "STATUS:",
      error?.response?.status
    );

    console.error(
      "RESPONSE:",
      error?.response?.data
    );

    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Failed to delete NIRF record.";

    await Swal.fire({
      title: "Delete Failed",
      text: message,
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

  // ============================================================
  // RESOURCE URL
  // ============================================================

  const getResourceUrl =
    (
      item: NirfItem
    ) => {
      if (
        !item.resource
      ) {
        return "";
      }

      // LINK

      if (
        item.resource
          .type === "link"
      ) {
        return (
          item.resource
            .url || ""
        );
      }

      // FILE

      const file =
        item.resource
          .file || "";

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

      if (
        file.startsWith("/")
      ) {
        return `${API_BASE_URL}${file}`;
      }

      return `${API_BASE_URL}/${file}`;
    };

  // ============================================================
  // AUTH
  // ============================================================

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

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      <div className="max-w-7xl mx-auto space-y-6">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">

                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-100">
                  <Award className="w-6 h-6 text-rose-700" />
                </span>

                NIRF Data Management

              </h1>

              <p className="text-sm text-gray-500 mt-2">
                Add, edit and delete NIRF submissions and resources.
              </p>

            </div>

            <div className="flex items-center gap-2">

              <button
                type="button"
                onClick={fetchNirfData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold disabled:opacity-50"
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold"
              >

                <Plus className="w-4 h-4" />

                Add NIRF

              </button>

            </div>

          </div>

        </div>

        {/* =====================================================
            INFO
        ===================================================== */}

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">

          <AlertTriangle className="w-5 h-5 mt-0.5 text-amber-500 flex-shrink-0" />

          <div>

            <p className="font-semibold">
              NIRF Resource Information
            </p>

            <p className="mt-1">
              Each record contains a header,
              description, year and either
              a link or uploaded document.
            </p>

          </div>

        </div>

        {/* =====================================================
            TABLE
        ===================================================== */}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">

            <div>

              <h2 className="font-bold text-gray-800 text-lg">
                All NIRF Submissions
              </h2>

              <p className="text-xs text-gray-500 mt-0.5">
                Manage NIRF records
              </p>

            </div>

            <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full">
              {nirfList.length}{" "}
              {nirfList.length === 1
                ? "Entry"
                : "Entries"}
            </span>

          </div>

          {isLoading ? (

            <div className="py-16 text-center">

              <RefreshCw className="w-7 h-7 animate-spin mx-auto text-gray-400" />

              <p className="text-sm text-gray-500 mt-3">
                Loading NIRF records...
              </p>

            </div>

          ) : nirfList.length === 0 ? (

            <div className="py-16 text-center">

              <FileText className="w-10 h-10 mx-auto text-gray-300" />

              <h3 className="font-semibold text-gray-700 mt-4">
                No NIRF records found
              </h3>

              <p className="text-sm text-gray-400 mt-1">
                Click "Add NIRF" to create
                the first record.
              </p>

              <button
                type="button"
                onClick={
                  openAddModal
                }
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold"
              >

                <Plus className="w-4 h-4" />

                Add NIRF

              </button>

            </div>

          ) : (

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

                  {nirfList.map(
                    (item) => {

                      const resourceUrl =
                        getResourceUrl(
                          item
                        );

                      return (

                        <tr
                          key={
                            item._id
                          }
                          className="hover:bg-gray-50"
                        >

                          <td className="px-5 py-4 align-top">

                            <span className="inline-flex items-center gap-1.5 bg-cyan-50 text-cyan-800 border border-cyan-200 px-2.5 py-1 rounded-lg text-xs font-bold">

                              <Calendar className="w-3.5 h-3.5" />

                              {item.year ||
                                "-"}

                            </span>

                          </td>

                          <td className="px-5 py-4 align-top">

                            <div className="flex gap-2">

                              <Award className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />

                              <p className="font-semibold text-gray-900 max-w-[280px]">
                                {item.header}
                              </p>

                            </div>

                          </td>

                          <td className="px-5 py-4 align-top">

                            <p className="text-sm text-gray-600 max-w-[300px] line-clamp-3">
                              {item.description}
                            </p>

                          </td>

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

                          <td className="px-5 py-4 align-top">

                            <div className="flex justify-end items-center gap-2">

                              <button
                                type="button"
                                onClick={() =>
                                  openEditModal(
                                    item
                                  )
                                }
                                className="p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
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
                                className="p-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                                title="Delete NIRF"
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

      {/* =======================================================
          MODAL
      ======================================================= */}

      {showModal && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onMouseDown={closeModal}
        >

          <div
            className="bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl"
            onMouseDown={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">

              <div>

                <h2 className="text-xl font-bold text-gray-800">

                  {editingId
                    ? "Edit NIRF Entry"
                    : "Add NIRF Entry"}

                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Enter the NIRF submission details below.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
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

              {/* HEADER */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">

                  Header

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  value={
                    formHeader
                  }
                  onChange={(e) =>
                    setFormHeader(
                      e.target.value
                    )
                  }
                  placeholder="e.g. NIRF 2026 Engineering"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">

                  Description

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>

                <textarea
                  value={
                    formDescription
                  }
                  onChange={(e) =>
                    setFormDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enter a description for this NIRF submission..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-500"
                />

              </div>

              {/* YEAR */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">

                  Year

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  value={
                    formYear
                  }
                  onChange={(e) =>
                    setFormYear(
                      e.target.value
                    )
                  }
                  placeholder="2026"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                />

              </div>

              {/* RESOURCE TYPE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold ${
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
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-semibold ${
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

              {/* LINK */}

              {resourceType ===
              "link" ? (

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">

                    Resource URL

                    <span className="text-red-500 ml-1">
                      *
                    </span>

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
                      placeholder="https://example.com/nirf"
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />

                  </div>

                </div>

              ) : (

                /* FILE */

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">

                    Upload Document

                    <span className="text-red-500 ml-1">
                      *
                    </span>

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

                        if (
                          file
                        ) {
                          setResourceFile(
                            ""
                          );
                        }

                      }}
                      className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />

                  </div>

                  <p className="text-xs text-gray-400 mt-1.5">
                    Maximum file size: 10 MB.
                    Supported: PDF, DOC, DOCX,
                    XLS and XLSX.
                  </p>

                  {/* NEW FILE */}

                  {selectedFile && (

                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">

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

                      <div className="mt-2 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">

                        <FileText className="w-4 h-4 text-gray-400" />

                        <span className="truncate">

                          Existing document:
                          {" "}
                          {
                            resourceFile
                          }

                        </span>

                      </div>

                    )}

                </div>

              )}

              {/* FOOTER */}

              <div className="flex justify-end gap-3 pt-5 border-t border-gray-200">

                <button
                  type="button"
                  onClick={
                    closeModal
                  }
                  disabled={
                    submitting
                  }
                  className="px-5 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold disabled:opacity-50"
                >

                  Cancel

                </button>

                <button
                  type="submit"
                  disabled={
                    submitting
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold disabled:opacity-60"
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

    </div>
  );
}