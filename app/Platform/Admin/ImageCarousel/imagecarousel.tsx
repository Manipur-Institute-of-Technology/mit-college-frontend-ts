import { useEffect, useRef, useState } from "react";
import { showAlert } from "~/utils/alert_utils";

import {
  Plus,
  Trash2,
  Image as ImageIcon,
  RefreshCw,
  Upload,
  X,
  Edit2,
  Save,
  Eye,
} from "lucide-react";

import { useAuth } from "~/context/AuthContext";

import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";

import apiClient, {
  API_BASE_URL,
} from "~/utils/apiClient";

// =====================================================
// TYPES
// =====================================================

type CarouselImage = {
  _id: string;
  filename?: string;
  imageUrl: string;
  caption?: string;
  createdAt?: string;
};

// =====================================================
// CONSTANTS
// =====================================================

const CAROUSAL_FOLDER = "Carousal";

// =====================================================
// TOKEN HELPER
// =====================================================

const getAuthToken = (): string => {
  let token =
    sessionStorage.getItem("token") ||
    localStorage.getItem("token") ||
    "";

  token = token.trim();

  // Remove JSON quotation marks if token was stored using JSON.stringify
  token = token.replace(/^"(.*)"$/, "$1");

  return token;
};

// =====================================================
// COMPONENT
// =====================================================

export default function Admin_Image_Carousel() {
  const { token, role } = useAuth();

  // ===================================================
  // STATES
  // ===================================================

  const [images, setImages] = useState<CarouselImage[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------
  // ADD
  // ---------------------------------------------------

  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [caption, setCaption] = useState("");

  const [uploading, setUploading] = useState(false);

  // ---------------------------------------------------
  // EDIT
  // ---------------------------------------------------

  const [showEditModal, setShowEditModal] = useState(false);

  const [editingImage, setEditingImage] =
    useState<CarouselImage | null>(null);

  const [editCaption, setEditCaption] = useState("");

  const [savingEdit, setSavingEdit] = useState(false);

  // ---------------------------------------------------
  // PREVIEW
  // ---------------------------------------------------

  const [previewImage, setPreviewImage] =
    useState<CarouselImage | null>(null);

  // ---------------------------------------------------
  // FILE
  // ---------------------------------------------------

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  // =====================================================
  // GET IMAGE URL
  // =====================================================

  const getImageUrl = (image: any): string => {
    if (!image) {
      return "";
    }

    // Already full URL
    if (
      image.imageUrl?.startsWith("http://") ||
      image.imageUrl?.startsWith("https://")
    ) {
      return image.imageUrl;
    }

    // Relative image URL
    if (image.imageUrl) {
      return `${API_BASE_URL}${
        image.imageUrl.startsWith("/") ? "" : "/"
      }${image.imageUrl}`;
    }

    // Filename fallback
    if (image.filename) {
      return `${API_BASE_URL}/uploads/gallery/${CAROUSAL_FOLDER}/${encodeURIComponent(
        image.filename
      )}`;
    }

    return "";
  };

  // =====================================================
  // ERROR MESSAGE HELPER
  // =====================================================

  const getErrorMessage = (error: any): string => {
    const responseData = error?.response?.data;

    if (
      responseData?.error?.message
    ) {
      return responseData.error.message;
    }

    if (
      responseData?.message
    ) {
      return responseData.message;
    }

    if (
      responseData?.error &&
      typeof responseData.error === "string"
    ) {
      return responseData.error;
    }

    if (error?.message) {
      return error.message;
    }

    return "Something went wrong.";
  };

  // =====================================================
  // AUTH HEADER
  // =====================================================

  const getAuthHeaders = () => {
    const authToken = getAuthToken();

    if (!authToken) {
      throw new Error(
        "Authentication token not found. Please login again."
      );
    }

    return {
      Authorization: `Bearer ${authToken}`,
    };
  };

  // =====================================================
  // FETCH CAROUSEL
  // =====================================================

  const fetchCarousel = async () => {
    setIsLoading(true);

    try {
      const headers = getAuthHeaders();

      const response = await apiClient.get(
        "/carousel",
        {
          headers,
        }
      );

      const rawData =
        response.data?.data ??
        response.data?.images ??
        response.data?.carousel ??
        [];

      const formatted = Array.isArray(rawData)
        ? rawData.map((item: any) => ({
            _id: item._id,

            filename:
              item.filename || "",

            imageUrl:
              getImageUrl(item),

            caption:
              item.caption || "",

            createdAt:
              item.createdAt,
          }))
        : [];

      setImages(formatted);
    } catch (error: any) {
      if (
        error?.response?.status === 401 ||
        error?.response?.status === 403
      ) {
        await showAlert({
          icon: "warning",
          title: "Session Expired",
          text:
            "Please login again.",
        });

        return;
      }

      showAlert({
        icon: "error",
        title: "Failed",
        text: getErrorMessage(error),
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
      fetchCarousel();
    }
  }, [token, role]);

  // =====================================================
  // RESET ADD MODAL
  // =====================================================

  const resetAddModal = () => {
    setSelectedFile(null);

    setCaption("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // OPEN ADD
  // =====================================================

  const openAddModal = () => {
    resetAddModal();

    setShowAddModal(true);
  };

  // =====================================================
  // CLOSE ADD
  // =====================================================

  const closeAddModal = () => {
    if (uploading) {
      return;
    }

    setShowAddModal(false);

    resetAddModal();
  };

  // =====================================================
  // FILE CHANGE
  // =====================================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0] || null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // ---------------------------------------------------
    // FILE TYPE
    // ---------------------------------------------------

    if (!file.type.startsWith("image/")) {
      showAlert({
        icon: "warning",
        title: "Invalid File",
        text:
          "Please select a valid image file.",
      });

      e.target.value = "";

      setSelectedFile(null);

      return;
    }

    // ---------------------------------------------------
    // FILE SIZE
    // ---------------------------------------------------

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      showAlert({
        icon: "warning",
        title: "File Too Large",
        text:
          "Maximum image size is 10 MB.",
      });

      e.target.value = "";

      setSelectedFile(null);

      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // UPLOAD IMAGE
  // =====================================================

  const handleAddImage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!selectedFile) {
      showAlert({
        icon: "warning",
        title: "Image Required",
        text:
          "Please select an image.",
      });

      return;
    }

    setUploading(true);

    try {
      // -------------------------------------------------
      // AUTH TOKEN
      // -------------------------------------------------

      const authToken = getAuthToken();

      if (!authToken) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // -------------------------------------------------
      // FORM DATA
      // -------------------------------------------------

      const formData = new FormData();

      formData.append(
        "image",
        selectedFile,
        selectedFile.name
      );

      formData.append(
        "caption",
        caption.trim()
      );

      // IMPORTANT:
      // Do NOT manually set Content-Type.
      //
      // Browser/Axios must generate:
      //
      // multipart/form-data;
      // boundary=----------------...
      //
      // -------------------------------------------------

      const response =
        await apiClient.post(
          "/carousel/upload",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${authToken}`,
            },
          }
        );

      await showAlert({
        icon: "success",
        title: "Uploaded",
        text:
          "Carousel image uploaded successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowAddModal(false);

      resetAddModal();

      await fetchCarousel();
    } catch (error: any) {
      const status =
        error?.response?.status;

      if (
        status === 401 ||
        status === 403
      ) {
        await showAlert({
          icon: "warning",
          title: "Authentication Failed",
          text:
            "Your login session is invalid or expired. Please login again.",
        });

        return;
      }

      showAlert({
        icon: "error",
        title: "Upload Failed",
        text: getErrorMessage(error),
      });
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEditModal = (
    image: CarouselImage
  ) => {
    setEditingImage(image);

    setEditCaption(
      image.caption || ""
    );

    setShowEditModal(true);
  };

  // =====================================================
  // CLOSE EDIT
  // =====================================================

  const closeEditModal = () => {
    if (savingEdit) {
      return;
    }

    setShowEditModal(false);

    setEditingImage(null);

    setEditCaption("");
  };

  // =====================================================
  // EDIT IMAGE
  // =====================================================

  const handleEditImage = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!editingImage?._id) {
      showAlert({
        icon: "error",
        title: "Invalid Image",
        text:
          "Image ID is missing.",
      });

      return;
    }

    setSavingEdit(true);

    try {
      const authToken =
        getAuthToken();

      if (!authToken) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // -------------------------------------------------
      // IMPORTANT
      // Authorization is manually attached here.
      // -------------------------------------------------

      const response =
        await apiClient.put(
          `/carousel/edit/${editingImage._id}`,
          {
            caption:
              editCaption.trim(),
          },
          {
            headers: {
              Authorization:
                `Bearer ${authToken}`,
              "Content-Type":
                "application/json",
            },
          }
        );

      await showAlert({
        icon: "success",
        title: "Updated",
        text:
          "Carousel caption updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setShowEditModal(false);

      setEditingImage(null);

      setEditCaption("");

      await fetchCarousel();
    } catch (error: any) {
      showAlert({
        icon: "error",
        title: "Update Failed",
        text: getErrorMessage(error),
      });
    } finally {
      setSavingEdit(false);
    }
  };

  // =====================================================
  // DELETE IMAGE
  // =====================================================

  const handleDeleteImage = async (
    image: CarouselImage
  ) => {
    if (!image?._id) {
      showAlert({
        icon: "error",
        title: "Invalid Image",
        text:
          "Image ID is missing.",
      });

      return;
    }

    // ---------------------------------------------------
    // CONFIRM
    // ---------------------------------------------------

    const result =
      await showAlert({
        icon: "warning",

        title:
          "Delete Image?",

        text:
          "This carousel image will be permanently deleted.",

        showCancelButton: true,

        confirmButtonText:
          "Yes, Delete",

        cancelButtonText:
          "Cancel",

        confirmButtonColor:
          "#be123c",

        reverseButtons: true,
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const authToken =
        getAuthToken();

      if (!authToken) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // -------------------------------------------------
      // DELETE
      // -------------------------------------------------

      const response =
        await apiClient.delete(
          `/carousel/delete/${image._id}`,
          {
            headers: {
              Authorization:
                `Bearer ${authToken}`,
            },
          }
        );

      await showAlert({
        icon: "success",
        title: "Deleted",
        text:
          "Carousel image deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      await fetchCarousel();
    } catch (error: any) {
      showAlert({
        icon: "error",
        title: "Delete Failed",
        text: getErrorMessage(error),
      });
    }
  };

  // =====================================================
  // AUTH
  // =====================================================

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

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-5">

        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ImageIcon className="w-8 h-8 text-rose-700" />
            Carousel Images
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage images displayed in
            the homepage carousel.
          </p>

          <div className="mt-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-semibold">
              Folder: {CAROUSAL_FOLDER}
            </span>
          </div>
        </div>

        <div className="flex gap-3">

          {/* REFRESH */}

          <button
            onClick={fetchCarousel}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300"
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

          {/* ADD */}

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg shadow-md"
          >
            <Plus className="w-4 h-4" />

            Add Image
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-20 text-center">

          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-rose-700 mb-3" />

          <p className="text-gray-500 font-semibold">
            Loading carousel images...
          </p>

        </div>
      ) : images.length === 0 ? (

        /* ================================================= */
        /* EMPTY */
        /* ================================================= */

        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-20 text-center">

          <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-5" />

          <h2 className="text-xl font-bold text-gray-700">
            No Carousel Images
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            Add images to display
            them on the homepage
            carousel.
          </p>

          <button
            onClick={openAddModal}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold text-sm"
          >
            <Plus className="w-4 h-4" />

            Add First Image
          </button>

        </div>

      ) : (

        /* ================================================= */
        /* GRID */
        /* ================================================= */

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {images.map(
            (image, index) => (

              <div
                key={image._id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:shadow-lg transition-shadow"
              >

                {/* IMAGE */}

                <div className="relative h-56 bg-gray-100 overflow-hidden">

                  {image.imageUrl ? (

                    <img
                      src={image.imageUrl}
                      alt={
                        image.caption ||
                        `Carousel image ${
                          index + 1
                        }`
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() =>
                        setPreviewImage(
                          image
                        )
                      }
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center">

                      <ImageIcon className="w-12 h-12 text-gray-300" />

                    </div>
                  )}

                  {/* NUMBER */}

                  <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
                    #{index + 1}
                  </div>

                  {/* PREVIEW */}

                  {image.imageUrl && (
                    <button
                      onClick={() =>
                        setPreviewImage(
                          image
                        )
                      }
                      className="absolute bottom-3 right-3 p-2 bg-black/70 hover:bg-black/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}

                </div>

                {/* DETAILS */}

                <div className="p-4">

                  <p className="text-xs uppercase tracking-wide font-semibold text-gray-400">
                    Caption
                  </p>

                  <p className="text-sm text-gray-800 font-medium mt-1 min-h-[40px] line-clamp-2">
                    {image.caption ||
                      "No caption"}
                  </p>

                  {/* ACTIONS */}

                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">

                    {/* EDIT */}

                    <button
                      onClick={() =>
                        openEditModal(
                          image
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-lg border border-gray-200 text-xs font-semibold"
                    >
                      <Edit2 className="w-4 h-4" />

                      Edit
                    </button>

                    {/* DELETE */}

                    <button
                      onClick={() =>
                        handleDeleteImage(
                          image
                        )
                      }
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-lg border border-gray-200 text-xs font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />

                      Delete
                    </button>

                  </div>

                </div>
              </div>
            )
          )}

        </div>
      )}

      {/* ================================================= */}
      {/* ADD MODAL */}
      {/* ================================================= */}

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeAddModal}
        >

          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex items-center justify-between border-b pb-4">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add Carousel Image
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Upload image to the{" "}
                  <b>
                    {CAROUSAL_FOLDER}
                  </b>{" "}
                  gallery.
                </p>
              </div>

              <button
                onClick={closeAddModal}
                disabled={uploading}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleAddImage}
              className="mt-5 space-y-5"
            >

              {/* FILE */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image *
                </label>

                <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-rose-50 hover:border-rose-400 cursor-pointer">

                  <Upload className="w-9 h-9 text-rose-600 mb-2" />

                  <span className="text-sm text-gray-600">
                    Click to select image
                  </span>

                  {selectedFile && (
                    <span className="mt-3 max-w-[90%] truncate text-xs font-semibold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
                      {selectedFile.name}
                    </span>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={
                      handleFileChange
                    }
                  />

                </label>
              </div>

              {/* CAPTION */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Caption
                </label>

                <textarea
                  value={caption}
                  onChange={(e) =>
                    setCaption(
                      e.target.value
                    )
                  }
                  maxLength={200}
                  rows={4}
                  placeholder="Enter image caption..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-500"
                />

                <p className="text-xs text-gray-400 text-right mt-1">
                  {caption.length}/200
                </p>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 border-t pt-4">

                <button
                  type="button"
                  onClick={closeAddModal}
                  disabled={uploading}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    uploading ||
                    !selectedFile
                  }
                  className="flex items-center gap-2 px-5 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold"
                >

                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />

                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />

                      Upload
                    </>
                  )}

                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* EDIT MODAL */}
      {/* ================================================= */}

      {showEditModal &&
        editingImage && (

          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={closeEditModal}
          >

            <div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* HEADER */}

              <div className="flex items-center justify-between border-b pb-4">

                <div>

                  <h2 className="text-xl font-bold text-gray-800">
                    Edit Carousel Image
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Update the image
                    caption.
                  </p>

                </div>

                <button
                  onClick={closeEditModal}
                  disabled={savingEdit}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              {/* IMAGE */}

              {editingImage.imageUrl && (
                <div className="mt-5 h-56 rounded-xl overflow-hidden bg-gray-900">

                  <img
                    src={
                      editingImage.imageUrl
                    }
                    alt={
                      editingImage.caption ||
                      "Carousel image"
                    }
                    className="w-full h-full object-contain"
                  />

                </div>
              )}

              {/* FORM */}

              <form
                onSubmit={
                  handleEditImage
                }
                className="mt-5 space-y-5"
              >

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Caption
                  </label>

                  <textarea
                    value={editCaption}
                    onChange={(e) =>
                      setEditCaption(
                        e.target.value
                      )
                    }
                    maxLength={200}
                    rows={4}
                    placeholder="Enter caption..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />

                  <p className="text-xs text-gray-400 text-right mt-1">
                    {editCaption.length}/200
                  </p>

                </div>

                {/* BUTTONS */}

                <div className="flex justify-end gap-3 border-t pt-4">

                  <button
                    type="button"
                    onClick={
                      closeEditModal
                    }
                    disabled={savingEdit}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={savingEdit}
                    className="flex items-center gap-2 px-5 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold"
                  >

                    {savingEdit ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />

                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />

                        Save Changes
                      </>
                    )}

                  </button>

                </div>

              </form>

            </div>
          </div>
        )}

      {/* ================================================= */}
      {/* PREVIEW */}
      {/* ================================================= */}

      {previewImage &&
        previewImage.imageUrl && (

          <div
            className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-5"
            onClick={() =>
              setPreviewImage(null)
            }
          >

            <button
              onClick={() =>
                setPreviewImage(null)
              }
              className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              className="max-w-6xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <img
                src={
                  previewImage.imageUrl
                }
                alt={
                  previewImage.caption ||
                  "Carousel image"
                }
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />

              {previewImage.caption && (
                <div className="mt-4 bg-black/70 text-white px-5 py-3 rounded-xl max-w-2xl text-center">
                  {previewImage.caption}
                </div>
              )}

            </div>
          </div>
        )}
    </div>
  );
}