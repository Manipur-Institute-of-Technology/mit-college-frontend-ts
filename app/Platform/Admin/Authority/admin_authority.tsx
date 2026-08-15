import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  UserCheck,
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  User,
  X,
} from "lucide-react";

import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import apiClient, {  API_BASE_URL,} from "~/utils/apiClient";

export type AuthorityItem = {
  _id: string;
  position: string;
  name: string;
  info: string;
  bios: string;
  photo: string;
  createdAt?: string;
};

export default function Admin_Authority() {
  const { token, role } = useAuth();

  /*
   * ============================================================
   * STATE
   * ============================================================
   */

  const [authorities, setAuthorities] = useState<
    AuthorityItem[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(false);

  /*
   * ============================================================
   * ADD / EDIT MODAL
   * ============================================================
   */

  const [showModal, setShowModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  /*
   * ============================================================
   * FORM STATE
   * ============================================================
   */

  const [position, setPosition] =
    useState("Vice-Chancellor");

  const [name, setName] = useState("");

  const [info, setInfo] = useState("");

  const [bios, setBios] = useState("");

  const [photoFile, setPhotoFile] =
    useState<File | null>(null);

  const [submitting, setSubmitting] =
    useState(false);

  /*
   * ============================================================
   * FETCH AUTHORITIES
   * ============================================================
   */

  const fetchAuthorities = async () => {
    if (!token) return;

    setIsLoading(true);

    try {
      const res =
        await apiClient.get("/authority");

      const data: AuthorityItem[] =
        res.data?.data ??
        (Array.isArray(res.data)
          ? res.data
          : []);

      setAuthorities(data);
    } catch (error: any) {
      console.error(
        "FETCH AUTHORITY ERROR:",
        error
      );

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to load authority data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * ============================================================
   * INITIAL FETCH
   * ============================================================
   */

  useEffect(() => {
    if (token) {
      fetchAuthorities();
    }
  }, [token]);

  /*
   * ============================================================
   * CHECK POSITION EXISTS
   * ============================================================
   */

  const roleExists = (
    selectedPosition: string
  ) => {
    return authorities.some(
      (item) =>
        item.position
          ?.toLowerCase()
          .trim() ===
        selectedPosition
          .toLowerCase()
          .trim()
    );
  };

  /*
   * ============================================================
   * OPEN ADD MODAL
   * ============================================================
   */

  const openAddModal = (
    selectedPosition: string
  ) => {
    if (roleExists(selectedPosition)) {
      toast.warning(
        `${selectedPosition} already exists. Please edit the existing record.`
      );

      return;
    }

    setEditingId(null);

    setPosition(selectedPosition);

    setName("");

    setInfo("");

    setBios("");

    setPhotoFile(null);

    setShowModal(true);
  };

  /*
   * ============================================================
   * OPEN EDIT MODAL
   * ============================================================
   */

  const openEditModal = (
    item: AuthorityItem
  ) => {
    setEditingId(item._id);

    setPosition(item.position);

    setName(item.name);

    setInfo(item.info);

    setBios(item.bios);

    /*
     * Existing photo should NOT be
     * converted to File.
     *
     * If user selects a new photo,
     * it will replace the old one.
     */

    setPhotoFile(null);

    setShowModal(true);
  };

  /*
   * ============================================================
   * SUBMIT ADD / EDIT
   * ============================================================
   */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    /*
     * ==========================================================
     * VALIDATION
     * ==========================================================
     */

    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!info.trim()) {
      toast.error(
        "Header information is required."
      );
      return;
    }

    if (!bios.trim()) {
      toast.error(
        "Biography is required."
      );
      return;
    }

    /*
     * Photo required only when creating
     */

    if (!editingId && !photoFile) {
      toast.error(
        "Please select a photo."
      );

      return;
    }

    /*
     * ==========================================================
     * DUPLICATE POSITION CHECK
     * ==========================================================
     */

    const duplicateRole =
      authorities.some(
        (item) =>
          item.position
            ?.toLowerCase()
            .trim() ===
            position
              .toLowerCase()
              .trim() &&
          item._id !== editingId
      );

    if (duplicateRole) {
      toast.error(
        `Only one ${position} is allowed.`
      );

      return;
    }

    setSubmitting(true);

    /*
     * ==========================================================
     * FORM DATA
     * ==========================================================
     */

    const formData = new FormData();

    formData.append(
      "position",
      position
    );

    formData.append(
      "name",
      name.trim()
    );

    formData.append(
      "info",
      info.trim()
    );

    formData.append(
      "bios",
      bios.trim()
    );

    if (photoFile) {
      formData.append(
        "photo",
        photoFile
      );
    }

    /*
     * ==========================================================
     * API
     * ==========================================================
     */

    try {
      /*
       * ========================================================
       * EDIT
       * ========================================================
       */

      if (editingId) {
        const res =
          await apiClient.put(
            `/authority/edit/${editingId}`,
            formData
          );

        const updated: AuthorityItem =
          res.data?.data ??
          res.data;

        setAuthorities((prev) =>
          prev.map((item) =>
            item._id === editingId
              ? updated
              : item
          )
        );

        /*
         * SUCCESS POPUP
         */

        await Swal.fire({
          title: "Updated!",
          text: `${position} updated successfully.`,
          icon: "success",

          confirmButtonText: "OK",

          confirmButtonColor:
            "#22c55e",

          customClass: {
            popup: "rounded-xl",
          },
        });
      }

      /*
       * ========================================================
       * ADD
       * ========================================================
       */

      else {
        const res =
          await apiClient.post(
            "/authority/add",
            formData
          );

        const created: AuthorityItem =
          res.data?.data ??
          res.data;

        setAuthorities((prev) => [
          created,
          ...prev,
        ]);

        /*
         * SUCCESS POPUP
         */

        await Swal.fire({
          title: "Created!",
          text: `${position} added successfully.`,
          icon: "success",

          confirmButtonText: "OK",

          confirmButtonColor:
            "#22c55e",

          customClass: {
            popup: "rounded-xl",
          },
        });
      }

      closeModal();
    } catch (error: any) {
      console.error(
        "AUTHORITY SAVE ERROR:",
        error
      );

      /*
       * ERROR POPUP
       */

      Swal.fire({
        title: "Operation Failed",
        text:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to save authority.",
        icon: "error",

        confirmButtonText: "OK",

        confirmButtonColor:
          "#ef4444",

        customClass: {
          popup: "rounded-xl",
        },
      });
    } finally {
      setSubmitting(false);
    }
  };

  /*
   * ============================================================
   * DELETE CONFIRMATION
   * ============================================================
   */

  const openDeleteModal = (
    id: string,
    authName: string,
    authPosition: string
  ) => {
    Swal.fire({
      title: "Delete Authority?",

      text: `Are you sure you want to delete the ${authPosition} record for "${authName}"?`,

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: "Delete",

      cancelButtonText: "Cancel",

      confirmButtonColor: "#ef4444",

      cancelButtonColor: "#6b7280",

      reverseButtons: true,

      customClass: {
        popup: "rounded-xl",

        title: "text-xl font-bold",

        htmlContainer:
          "text-sm text-gray-600",

        confirmButton:
          "px-5 py-2.5 rounded-lg font-semibold",

        cancelButton:
          "px-5 py-2.5 rounded-lg font-semibold",
      },
    }).then(async (result) => {
      if (!result.isConfirmed) {
        return;
      }

      await handleDelete(
        id,
        authName,
        authPosition
      );
    });
  };

  /*
   * ============================================================
   * DELETE AUTHORITY
   * ============================================================
   */

  const handleDelete = async (
    id: string,
    authName: string,
    authPosition: string
  ) => {
    try {
      /*
       * DELETE API
       */

      await apiClient.delete(
        `/authority/delete/${id}`
      );

      /*
       * REMOVE FROM STATE
       */

      setAuthorities((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

      /*
       * SUCCESS POPUP
       */

      await Swal.fire({
        title: "Deleted!",

        text: `${authPosition} "${authName}" has been deleted successfully.`,

        icon: "success",

        confirmButtonText: "OK",

        confirmButtonColor:
          "#22c55e",

        customClass: {
          popup: "rounded-xl",
        },
      });
    } catch (error: any) {
      console.error(
        "DELETE AUTHORITY ERROR:",
        error
      );

      /*
       * ERROR POPUP
       */

      Swal.fire({
        title: "Delete Failed",

        text:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to delete authority.",

        icon: "error",

        confirmButtonText: "OK",

        confirmButtonColor:
          "#ef4444",

        customClass: {
          popup: "rounded-xl",
        },
      });
    }
  };

  /*
   * ============================================================
   * CLOSE ADD / EDIT MODAL
   * ============================================================
   */

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);

    setEditingId(null);

    setPosition(
      "Vice-Chancellor"
    );

    setName("");

    setInfo("");

    setBios("");

    setPhotoFile(null);
  };

  /*
   * ============================================================
   * AUTH CHECK
   * ============================================================
   */

  if (!token || role !== "admin") {
    return (
      <div className="p-4">
        <SignIn_SignUP role="admin" />
      </div>
    );
  }

  /*
   * ============================================================
   * FIND VICE CHANCELLOR
   * ============================================================
   */

  const viceChancellor =
    authorities.find((item) =>
      /vice[-\s]?chancellor|^vc$/i.test(
        item.position
      )
    );

  /*
   * ============================================================
   * FIND PRINCIPAL
   * ============================================================
   */

  const principal =
    authorities.find((item) =>
      /principal/i.test(
        item.position
      )
    );

  /*
   * ============================================================
   * AUTHORITY CARD
   * ============================================================
   */

  const renderAuthorityCard = (
    item: AuthorityItem | undefined,
    expectedPosition: string
  ) => {
    /*
     * ========================================================
     * NO RECORD
     * ========================================================
     */

    if (!item) {
      return (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
          <User className="w-12 h-12 mx-auto text-gray-400 mb-3" />

          <h3 className="text-lg font-bold text-gray-700">
            No {expectedPosition} Added
          </h3>

          <p className="text-sm text-gray-500 mt-1 mb-5">
            There is currently no{" "}
            {expectedPosition} record in
            the system.
          </p>

          <button
            type="button"
            onClick={() =>
              openAddModal(
                expectedPosition
              )
            }
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />

            Add {expectedPosition}
          </button>
        </div>
      );
    }

    /*
     * ========================================================
     * IMAGE
     * ========================================================
     */

    const imageSrc = item.photo
      ? item.photo.startsWith("http")
        ? item.photo
        : `${API_BASE_URL}/uploads/authority/${item.photo}`
      : "";

    /*`${API_BASE_URL}/uploads/faculty/${faculty.photoId}`
     * ========================================================
     * CARD
     * ========================================================
     */

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-rose-700" />

            <h2 className="text-xl font-bold text-gray-800">
              {item.position}
            </h2>
          </div>

          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
            Active
          </span>
        </div>

        {/* PROFILE */}

        <div className="flex items-start gap-5">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={item.name}
              className="w-28 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
            />
          ) : (
            <div className="w-28 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900">
              {item.name}
            </h3>

            <p className="text-sm text-gray-600 whitespace-pre-line">
              {item.info}
            </p>
          </div>
        </div>

        {/* BIO */}

        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">
            Biography
          </h4>

          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {item.bios}
          </p>
        </div>

        {/* ACTIONS */}

        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
          {/* EDIT */}

          <button
            type="button"
            onClick={() =>
              openEditModal(item)
            }
            className="px-4 py-2 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 text-sm font-semibold rounded-lg border border-gray-200 flex items-center gap-2 transition-colors"
          >
            <Edit2 className="w-4 h-4" />

            Edit
          </button>

          {/* DELETE */}

          <button
            type="button"
            onClick={() =>
              openDeleteModal(
                item._id,
                item.name,
                item.position
              )
            }
            className="px-4 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 text-sm font-semibold rounded-lg border border-gray-200 flex items-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4" />

            Delete
          </button>
        </div>
      </div>
    );
  };

  /*
   * ============================================================
   * PAGE
   * ============================================================
   */

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* ========================================================
          PAGE HEADER
          ======================================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5 border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <UserCheck className="w-8 h-8 text-rose-700" />

            Administration Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage the Vice Chancellor and
            Principal profiles.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAuthorities}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300 transition-colors disabled:opacity-50"
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
      </div>

      {/* ========================================================
          AUTHORITY CARDS
          ======================================================== */}

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 font-semibold">
          Loading administration data...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderAuthorityCard(
            viceChancellor,
            "Vice-Chancellor"
          )}

          {renderAuthorityCard(
            principal,
            "Principal"
          )}
        </div>
      )}

      {/* ========================================================
          ADD / EDIT MODAL
          ======================================================== */}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            {/* HEADER */}

            <div className="px-6 py-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-rose-100 flex items-center justify-center">
                    {editingId ? (
                      <Edit2 className="w-5 h-5 text-rose-700" />
                    ) : (
                      <Plus className="w-5 h-5 text-rose-700" />
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {editingId
                        ? `Edit ${position}`
                        : `Add ${position}`}
                    </h3>

                    <p className="text-xs text-gray-500 mt-0.5">
                      {editingId
                        ? "Update the authority profile information."
                        : "Create a new authority profile."}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="max-h-[75vh] overflow-y-auto"
            >
              <div className="px-6 py-6 space-y-5">
                {/* POSITION */}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Position *
                  </label>

                  <select
                    value={position}
                    onChange={(e) =>
                      setPosition(
                        e.target.value
                      )
                    }
                    disabled={!!editingId}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500 disabled:bg-gray-100 disabled:text-gray-500"
                  >
                    <option value="Vice-Chancellor">
                      Vice-Chancellor
                    </option>

                    <option value="Principal">
                      Principal
                    </option>
                  </select>
                </div>

                {/* NAME */}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName(
                        e.target.value
                      )
                    }
                    placeholder="Enter full name"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
                    required
                  />
                </div>

                {/* INFO */}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Header Information *
                  </label>

                  <textarea
                    value={info}
                    onChange={(e) =>
                      setInfo(
                        e.target.value
                      )
                    }
                    placeholder={`Vice-Chancellor, Manipur University
Chairman, Governing Body of MIT`}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
                    required
                  />
                </div>

                {/* BIO */}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Detailed Biography *
                  </label>

                  <textarea
                    value={bios}
                    onChange={(e) =>
                      setBios(
                        e.target.value
                      )
                    }
                    placeholder="Enter biography..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm h-32 resize-none focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-500"
                    required
                  />
                </div>

                {/* PHOTO */}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Photo {!editingId && "*"}
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setPhotoFile(
                        e.target.files?.[0] ??
                          null
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 text-xs"
                  />

                  {editingId && (
                    <p className="text-xs text-gray-500 mt-1.5">
                      Leave empty to keep
                      the existing photo.
                    </p>
                  )}
                </div>
              </div>

              {/* FOOTER */}

              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2.5 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingId ? (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Profile
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