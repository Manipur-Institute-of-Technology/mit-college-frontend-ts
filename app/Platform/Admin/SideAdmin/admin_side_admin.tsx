import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import apiClient from "~/utils/apiClient";

import {
  Plus,
  Trash2,
  Edit2,
  RefreshCw,
  BookOpen,
  Home,
  Users,
  X,
  Save,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

export type SideAdminItem = {
  _id?: string;
  key: "library" | "boys_hostel" | "girls_hostel";
  name: string;
  position?: string;
  info: string;
  isActive?: boolean;
};

type FacilityType = "boys_hostel" | "girls_hostel" | "library";

// =====================================================
// COMPONENT
// =====================================================

export default function Admin_SideAdmin({
  targetCategory,
}: {
  targetCategory?: "hostel" | "library";
}) {
  const { token, role } = useAuth();

  const [admins, setAdmins] = useState<SideAdminItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Modal
  const [showModal, setShowModal] = useState(false);

  const [editingFacility, setEditingFacility] =
    useState<FacilityType | null>(null);

  const [facilityKey, setFacilityKey] =
    useState<FacilityType>("boys_hostel");

  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [info, setInfo] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // =====================================================
  // FETCH
  // =====================================================

  const fetchSideAdmins = async () => {
    setIsLoading(true);

    try {
      const endpoint = targetCategory
        ? `/sideadmin/${targetCategory}`
        : "/sideadmin";

      const res = await apiClient.get(endpoint);

      const rawData = res.data?.data ?? res.data;

      const list: SideAdminItem[] = Array.isArray(rawData)
        ? rawData
        : rawData
        ? [rawData]
        : [];

      setAdmins(list);
    } catch (error: any) {
      console.error("FETCH SIDE ADMIN ERROR:", error);

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to load facility administration.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    if (token && role === "admin") {
      fetchSideAdmins();
    }
  }, [token, role, targetCategory]);

  // =====================================================
  // FIND ADMIN
  // =====================================================

  const getAdmin = (key: FacilityType) => {
    return admins.find((item) => item.key === key);
  };

  // =====================================================
  // OPEN ADD / EDIT
  // =====================================================

  const openModal = (facility: FacilityType) => {
    const existing = getAdmin(facility);

    setFacilityKey(facility);

    if (existing) {
      setEditingFacility(facility);

      setName(existing.name || "");
      setPosition(existing.position || "");
      setInfo(existing.info || "");
    } else {
      setEditingFacility(null);

      setName("");
      setPosition("");
      setInfo("");
    }

    setShowModal(true);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const closeModal = () => {
    if (submitting) return;

    setShowModal(false);

    setEditingFacility(null);

    setName("");
    setPosition("");
    setInfo("");
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name Required",
        text: "Please enter the administration name.",
      });

      return;
    }

    if (!info.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Information Required",
        text: "Please enter administration information.",
      });

      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      position: position.trim(),
      info: info.trim(),
    };

    try {
      // ===============================================
      // EDIT
      // ===============================================

      if (editingFacility) {
        const res = await apiClient.post(
          `/sideadmin/${editingFacility}/edit`,
          payload
        );

        const updated = res.data?.data;

        setAdmins((prev) =>
          prev.map((item) =>
            item.key === editingFacility
              ? updated
              : item
          )
        );

        await Swal.fire({
          icon: "success",
          title: "Updated",
          text: `${getFacilityLabel(
            editingFacility
          )} administration updated successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }

      // ===============================================
      // ADD
      // ===============================================

      else {
        const res = await apiClient.post(
          `/sideadmin/${facilityKey}/add`,
          payload
        );

        const created = res.data?.data;

        setAdmins((prev) => [
          ...prev,
          created,
        ]);

        await Swal.fire({
          icon: "success",
          title: "Added",
          text: `${getFacilityLabel(
            facilityKey
          )} administration added successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });
      }

      closeModal();

      // Make sure UI matches DB
      await fetchSideAdmins();
    } catch (error: any) {
      console.error(
        "SAVE SIDE ADMIN ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to save facility administration.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (
    facility: FacilityType
  ) => {
    const existing = getAdmin(facility);

    if (!existing) {
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Administration?",
      text: `Delete ${getFacilityLabel(
        facility
      )} administration? This action cannot be undone.`,
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#be123c",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(
        `/sideadmin/${facility}/delete`
      );

      setAdmins((prev) =>
        prev.filter(
          (item) => item.key !== facility
        )
      );

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: `${getFacilityLabel(
          facility
        )} administration deleted successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error(
        "DELETE SIDE ADMIN ERROR:",
        error
      );

      Swal.fire({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to delete facility administration.",
      });
    }
  };

  // =====================================================
  // LABEL
  // =====================================================

  const getFacilityLabel = (
    facility: FacilityType
  ) => {
    switch (facility) {
      case "boys_hostel":
        return "Boys Hostel";

      case "girls_hostel":
        return "Girls Hostel";

      case "library":
        return "Library";

      default:
        return "Facility";
    }
  };

  // =====================================================
  // AUTH
  // =====================================================

  if (!token || role !== "admin") {
    return (
      <div className="p-4">
        <SignIn_SignUP role="admin" />
      </div>
    );
  }

  // =====================================================
  // LIBRARY PAGE
  // =====================================================

  if (targetCategory === "library") {
    const libraryAdmin =
      getAdmin("library");

    return (
      <div className="p-6 max-w-7xl mx-auto space-y-8">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-200">

          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-rose-700" />

              Library Administration
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              Manage library administration details.
            </p>
          </div>

          <div className="flex gap-3">

            <button
              onClick={fetchSideAdmins}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2
              bg-gray-100 hover:bg-gray-200
              text-gray-700 text-sm font-semibold
              rounded-lg border border-gray-300"
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
              onClick={() =>
                openModal("library")
              }
              className="flex items-center gap-2 px-4 py-2
              bg-rose-700 hover:bg-rose-800
              text-white text-sm font-semibold
              rounded-lg shadow-md"
            >
              {libraryAdmin ? (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit Library
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Library Admin
                </>
              )}
            </button>

          </div>
        </div>

        {/* LIBRARY CARD */}

        {isLoading ? (
          <Loading />
        ) : libraryAdmin ? (
          <FacilityCard
            item={libraryAdmin}
            onEdit={() =>
              openModal("library")
            }
            onDelete={() =>
              handleDelete("library")
            }
          />
        ) : (
          <EmptyState
            title="No Library Administration"
            description="No library administration has been created yet."
            buttonText="Add Library Admin"
            onAdd={() =>
              openModal("library")
            }
          />
        )}

        {/* MODAL */}

        {showModal && (
          <FacilityModal
            title={
              editingFacility
                ? "Edit Library Administration"
                : "Add Library Administration"
            }
            facilityLabel="Library"
            name={name}
            position={position}
            info={info}
            setName={setName}
            setPosition={setPosition}
            setInfo={setInfo}
            submitting={submitting}
            onClose={closeModal}
            onSubmit={handleSubmit}
          />
        )}

      </div>
    );
  }

  // =====================================================
  // HOSTEL PAGE
  // =====================================================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-200">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Home className="w-8 h-8 text-rose-700" />

            Hostel Administration
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage Boys Hostel and Girls Hostel administration.
          </p>
        </div>

        <button
          onClick={fetchSideAdmins}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2
          bg-gray-100 hover:bg-gray-200
          text-gray-700 text-sm font-semibold
          rounded-lg border border-gray-300"
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

      {/* HOSTEL CARDS */}

      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* BOYS HOSTEL */}

          <div>
            <div className="flex items-center gap-2 mb-3">

              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-700" />
              </div>

              <h2 className="font-bold text-gray-800">
                Boys Hostel
              </h2>

            </div>

            {getAdmin("boys_hostel") ? (
              <FacilityCard
                item={
                  getAdmin("boys_hostel")!
                }
                onEdit={() =>
                  openModal("boys_hostel")
                }
                onDelete={() =>
                  handleDelete(
                    "boys_hostel"
                  )
                }
              />
            ) : (
              <EmptyState
                title="No Boys Hostel Admin"
                description="Boys Hostel administration has not been added."
                buttonText="Add Boys Hostel Admin"
                onAdd={() =>
                  openModal(
                    "boys_hostel"
                  )
                }
              />
            )}
          </div>

          {/* GIRLS HOSTEL */}

          <div>
            <div className="flex items-center gap-2 mb-3">

              <div className="p-2 bg-pink-50 rounded-lg">
                <Users className="w-5 h-5 text-pink-700" />
              </div>

              <h2 className="font-bold text-gray-800">
                Girls Hostel
              </h2>

            </div>

            {getAdmin("girls_hostel") ? (
              <FacilityCard
                item={
                  getAdmin("girls_hostel")!
                }
                onEdit={() =>
                  openModal(
                    "girls_hostel"
                  )
                }
                onDelete={() =>
                  handleDelete(
                    "girls_hostel"
                  )
                }
              />
            ) : (
              <EmptyState
                title="No Girls Hostel Admin"
                description="Girls Hostel administration has not been added."
                buttonText="Add Girls Hostel Admin"
                onAdd={() =>
                  openModal(
                    "girls_hostel"
                  )
                }
              />
            )}

          </div>

        </div>
      )}

      {/* MODAL */}

      {showModal && (
        <FacilityModal
          title={
            editingFacility
              ? `Edit ${getFacilityLabel(
                  facilityKey
                )} Administration`
              : `Add ${getFacilityLabel(
                  facilityKey
                )} Administration`
          }
          facilityLabel={getFacilityLabel(
            facilityKey
          )}
          name={name}
          position={position}
          info={info}
          setName={setName}
          setPosition={setPosition}
          setInfo={setInfo}
          submitting={submitting}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}

    </div>
  );
}

// =====================================================
// FACILITY CARD
// =====================================================

function FacilityCard({
  item,
  onEdit,
  onDelete,
}: {
  item: SideAdminItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="bg-white rounded-2xl
      border border-gray-200 shadow-sm
      p-6 space-y-5"
    >

      {/* TOP */}

      <div className="flex items-start justify-between gap-3">

        <div>

          <span
            className="inline-block px-2.5 py-1
            bg-cyan-100 text-cyan-800
            text-xs font-bold uppercase
            rounded-full"
          >
            {item.key}
          </span>

          <h3 className="text-xl font-bold text-gray-900 mt-3">
            {item.name}
          </h3>

          {item.position && (
            <p className="text-sm font-semibold text-gray-500 mt-1">
              {item.position}
            </p>
          )}

        </div>

      </div>

      {/* INFO */}

      <div
        className="bg-gray-50 p-4 rounded-xl
        border border-gray-100"
      >
        <p
          className="text-sm text-gray-700
          leading-relaxed whitespace-pre-line"
        >
          {item.info}
        </p>
      </div>

      {/* ACTIONS */}

      <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">

        <button
          onClick={onEdit}
          className="px-3 py-1.5
          bg-gray-100 hover:bg-blue-50
          text-gray-700 hover:text-blue-700
          text-xs font-semibold rounded-lg
          border border-gray-200
          flex items-center gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />

          Edit
        </button>

        <button
          onClick={onDelete}
          className="px-3 py-1.5
          bg-gray-100 hover:bg-red-50
          text-gray-700 hover:text-red-700
          text-xs font-semibold rounded-lg
          border border-gray-200
          flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />

          Delete
        </button>

      </div>

    </div>
  );
}

// =====================================================
// EMPTY STATE
// =====================================================

function EmptyState({
  title,
  description,
  buttonText,
  onAdd,
}: {
  title: string;
  description: string;
  buttonText: string;
  onAdd: () => void;
}) {
  return (
    <div
      className="bg-white rounded-2xl
      border border-dashed border-gray-300
      p-10 text-center"
    >

      <Home
        className="w-10 h-10
        mx-auto text-gray-300 mb-3"
      />

      <h3 className="font-bold text-gray-700">
        {title}
      </h3>

      <p className="text-xs text-gray-500 mt-1">
        {description}
      </p>

      <button
        onClick={onAdd}
        className="mt-5 inline-flex
        items-center gap-2 px-4 py-2
        bg-rose-700 hover:bg-rose-800
        text-white text-xs font-bold
        rounded-lg"
      >
        <Plus className="w-4 h-4" />

        {buttonText}
      </button>

    </div>
  );
}

// =====================================================
// LOADING
// =====================================================

function Loading() {
  return (
    <div className="text-center py-20 text-gray-500 font-semibold">
      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3" />

      Loading facility administration...
    </div>
  );
}

// =====================================================
// MODAL
// =====================================================

function FacilityModal({
  title,
  facilityLabel,
  name,
  position,
  info,
  setName,
  setPosition,
  setInfo,
  submitting,
  onClose,
  onSubmit,
}: {
  title: string;
  facilityLabel: string;
  name: string;
  position: string;
  info: string;

  setName: (value: string) => void;
  setPosition: (value: string) => void;
  setInfo: (value: string) => void;

  submitting: boolean;

  onClose: () => void;
  onSubmit: (
    e: React.FormEvent
  ) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50
      flex items-center justify-center
      bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >

      <div
        className="bg-white rounded-2xl
        shadow-2xl p-6 w-full max-w-lg
        border border-gray-200"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="flex justify-between items-center border-b pb-3">

          <div>

            <h3 className="text-xl font-bold text-gray-800">
              {title}
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              {facilityLabel} Administration
            </p>

          </div>

          <button
            onClick={onClose}
            disabled={submitting}
            className="p-1 text-gray-400
            hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* FORM */}

        <form
          onSubmit={onSubmit}
          className="space-y-4 mt-5"
        >

          {/* NAME */}

          <div>

            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Title / Name *
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder={`e.g. ${facilityLabel} Administration`}
              className="w-full border border-gray-300
              rounded-lg p-2.5 text-sm
              focus:ring-2 focus:ring-rose-500
              focus:outline-none"
              required
              autoFocus
            />

          </div>

          {/* POSITION */}

          <div>

            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Position / Role
            </label>

            <input
              type="text"
              value={position}
              onChange={(e) =>
                setPosition(e.target.value)
              }
              placeholder="e.g. Warden"
              className="w-full border border-gray-300
              rounded-lg p-2.5 text-sm
              focus:ring-2 focus:ring-rose-500
              focus:outline-none"
            />

          </div>

          {/* INFO */}

          <div>

            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Administration Information *
            </label>

            <textarea
              value={info}
              onChange={(e) =>
                setInfo(e.target.value)
              }
              placeholder="Enter administration details..."
              className="w-full border border-gray-300
              rounded-lg p-2.5 text-sm
              focus:ring-2 focus:ring-rose-500
              focus:outline-none
              h-32 resize-none"
              required
            />

          </div>

          {/* BUTTONS */}

          <div
            className="flex justify-end gap-3
            pt-3 border-t"
          >

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2
              bg-gray-100 hover:bg-gray-200
              text-gray-700 rounded-lg
              text-sm font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2
              bg-rose-700 hover:bg-rose-800
              disabled:opacity-60
              text-white rounded-lg
              text-sm font-semibold
              flex items-center gap-2"
            >

              {submitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}