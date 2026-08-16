import { useState, useEffect, useRef } from "react";
import { showAlert } from "~/utils/alert_utils";
import { useAuth } from "~/context/AuthContext";
import SignIn_SignUP from "~/Common/SignIn_SignUP/SiignIn_Signup";
import apiClient, { API_BASE_URL } from "~/utils/apiClient";

import {
  FolderOpen,
  FolderPlus,
  Trash2,
  Upload,
  X,
  RefreshCw,
  ArrowLeft,
  Images,
  ImageIcon,
} from "lucide-react";

// =====================================================
// TYPES
// =====================================================

type GalleryImage = {
  _id: string;
  filename?: string;
  imageUrl: string;
  caption?: string;
  createdAt?: string;
};

type GalleryFolder = {
  _id: string;
  galleryName: string;
  is_normal_gallery: boolean;
  images: GalleryImage[];
  createdAt?: string;
};

// =====================================================
// CONSTANTS
// =====================================================

// Keep this exactly the same as your backend
const CAROUSAL_FOLDER = "Carousal";

// =====================================================
// COMPONENT
// =====================================================

export default function Admin_Gallery() {
  const { token, role } = useAuth();

  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [activeFolder, setActiveFolder] =
    useState<GalleryFolder | null>(null);

  // =====================================================
  // CREATE FOLDER MODAL
  // =====================================================

  const [showFolderModal, setShowFolderModal] =
    useState(false);

  const [newFolderName, setNewFolderName] =
    useState("");

  const [creatingFolder, setCreatingFolder] =
    useState(false);

  // =====================================================
  // UPLOAD MODAL
  // =====================================================

  const [showUploadModal, setShowUploadModal] =
    useState(false);

  const [uploadFile, setUploadFile] =
    useState<File | null>(null);

  const [uploadCaption, setUploadCaption] =
    useState("");

  const [uploading, setUploading] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // =====================================================
  // LIGHTBOX
  // =====================================================

  const [lightboxSrc, setLightboxSrc] =
    useState<string | null>(null);

  // =====================================================
  // FETCH GALLERIES
  // =====================================================

  const fetchGalleries = async () => {
    setIsLoading(true);

    try {
      const res = await apiClient.get("/gallery");

      const data =
        res.data?.data ??
        res.data ??
        [];

      const list: GalleryFolder[] =
        Array.isArray(data)
          ? data
          : [];

      // =================================================
      // HIDE CAROUSAL FROM UI
      //
      // IMPORTANT:
      // We DO NOT prevent creating Carousal.
      // We only hide it from the gallery list.
      // =================================================

      const normalGalleries =
        list.filter(
          (folder) =>
            folder.galleryName?.toLowerCase() !==
              CAROUSAL_FOLDER.toLowerCase()
        );

      // =================================================
      // FORMAT IMAGE URL
      // =================================================

      const formatted: GalleryFolder[] =
        normalGalleries.map((folder: any) => ({
          ...folder,

          images: Array.isArray(folder.images)
            ? folder.images.map((img: any) => ({
                _id: img._id,

                filename:
                  img.filename || "",

                imageUrl:
                  img.imageUrl
                    ? `${API_BASE_URL}${img.imageUrl}`
                    : img.filename
                    ? `${API_BASE_URL}/uploads/gallery/${encodeURIComponent(
                        folder.galleryName
                      )}/${img.filename}`
                    : "",

                caption:
                  img.caption || "",

                createdAt:
                  img.createdAt,
              }))
            : [],
        }));

      setFolders(formatted);

      // =================================================
      // UPDATE ACTIVE FOLDER
      // =================================================

      if (activeFolder) {
        const updated =
          formatted.find(
            (folder) =>
              folder._id === activeFolder._id
          );

        if (updated) {
          setActiveFolder(updated);
        } else {
          setActiveFolder(null);
        }
      }
    } catch (error: any) {
      showAlert({
        icon: "error",
        title: "Failed",
        text:
          error?.response?.data?.message ||
          "Failed to fetch galleries.",
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
      fetchGalleries();
    }
  }, [token, role]);

  // =====================================================
  // CREATE GALLERY
  // =====================================================

  const handleCreateFolder = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const name =
      newFolderName.trim();

    if (!name) {
      showAlert({
        icon: "warning",
        title: "Folder Name Required",
        text: "Please enter a gallery folder name.",
      });

      return;
    }

    setCreatingFolder(true);

    try {
      const res =
        await apiClient.post(
          "/gallery/add",
          {
            galleryName: name,

            // Normal gallery
            is_normal_gallery: true,
          }
        );

      await showAlert({
        icon: "success",
        title: "Gallery Created",
        text:
          res.data?.message ||
          `Gallery "${name}" created successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });

      setNewFolderName("");
      setShowFolderModal(false);

      await fetchGalleries();
    } catch (error: any) {
      showAlert({
        icon: "error",
        title: "Creation Failed",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to create gallery.",
      });
    } finally {
      setCreatingFolder(false);
    }
  };

  // =====================================================
  // DELETE GALLERY
  // =====================================================

  const handleDeleteFolder = async (
    folder: GalleryFolder
  ) => {
    // Extra safety:
    // Carousal isn't displayed, but don't allow
    // deleting it from this UI accidentally.

    if (
      folder.galleryName?.toLowerCase() ===
      CAROUSAL_FOLDER.toLowerCase()
    ) {
      showAlert({
        icon: "warning",
        title: "Reserved Gallery",
        text:
          "The Carousal gallery cannot be deleted from this page.",
      });

      return;
    }

    const result =
      await showAlert({
        icon: "warning",
        title: "Delete Gallery?",
        text:
          `Delete "${folder.galleryName}" and all its images? This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText:
          "Yes, Delete",
        cancelButtonText:
          "Cancel",
        confirmButtonColor:
          "#be123c",
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(
        `/gallery/delete/${folder._id}`
      );

      setFolders((prev) =>
        prev.filter(
          (item) =>
            item._id !== folder._id
        )
      );

      if (
        activeFolder?._id ===
        folder._id
      ) {
        setActiveFolder(null);
      }

      await showAlert({
        icon: "success",
        title: "Deleted",
        text:
          `Gallery "${folder.galleryName}" deleted successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      showAlert({
        icon: "error",
        title: "Delete Failed",
        text:
          error?.response?.data?.message ||
          "Failed to delete gallery.",
      });
    }
  };

  // =====================================================
  // OPEN UPLOAD MODAL
  // =====================================================

  const openUploadModal = () => {
    setUploadFile(null);
    setUploadCaption("");
    setShowUploadModal(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // UPLOAD IMAGE
  // =====================================================

  const handleUploadImage = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!uploadFile) {
      showAlert({
        icon: "warning",
        title: "Image Required",
        text: "Please select an image.",
      });

      return;
    }

    if (!activeFolder) {
      showAlert({
        icon: "warning",
        title: "Gallery Required",
        text: "Please select a gallery first.",
      });

      return;
    }

    setUploading(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "image",
        uploadFile
      );

      formData.append(
        "caption",
        uploadCaption.trim()
      );

      await apiClient.post(
        `/image/add/${encodeURIComponent(
          activeFolder.galleryName
        )}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      await showAlert({
        icon: "success",
        title: "Uploaded",
        text:
          "Image uploaded successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setUploadFile(null);
      setUploadCaption("");
      setShowUploadModal(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await fetchGalleries();
    } catch (error: any) {
      showAlert({
        icon: "error",
        title: "Upload Failed",
        text:
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to upload image.",
      });
    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // DELETE IMAGE
  // =====================================================

  const handleDeleteImage = async (
    image: GalleryImage
  ) => {
    const result =
      await showAlert({
        icon: "warning",
        title: "Delete Image?",
        text:
          "This image will be permanently deleted.",
        showCancelButton: true,
        confirmButtonText:
          "Yes, Delete",
        cancelButtonText:
          "Cancel",
        confirmButtonColor:
          "#be123c",
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await apiClient.delete(
        `/image/delete/${image._id}`
      );

      await showAlert({
        icon: "success",
        title: "Deleted",
        text:
          "Image deleted successfully.",
        timer: 1200,
        showConfirmButton: false,
      });

      await fetchGalleries();
    } catch (error: any) {
      showAlert({
        icon: "error",
        title: "Delete Failed",
        text:
          error?.response?.data?.message ||
          "Failed to delete image.",
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
  // ACTIVE GALLERY
  // =====================================================

  if (activeFolder) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-200">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                setActiveFolder(null)
              }
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Images className="w-6 h-6 text-rose-700" />

                {activeFolder.galleryName}
              </h1>

              <p className="text-gray-500 text-sm mt-0.5">
                {activeFolder.images.length}{" "}
                {activeFolder.images.length === 1
                  ? "image"
                  : "images"}
              </p>
            </div>

          </div>

          <div className="flex gap-3">

            <button
              onClick={fetchGalleries}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300"
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
              onClick={openUploadModal}
              className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg shadow-md"
            >
              <Upload className="w-4 h-4" />

              Upload Image
            </button>

          </div>
        </div>

        {/* IMAGES */}

        {isLoading ? (
          <Loading />
        ) : activeFolder.images.length === 0 ? (

          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">

            <ImageIcon className="w-14 h-14 text-gray-300 mx-auto mb-4" />

            <p className="text-gray-500 font-medium">
              No images in this gallery.
            </p>

            <button
              onClick={openUploadModal}
              className="mt-5 px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-sm font-semibold"
            >
              Upload First Image
            </button>

          </div>

        ) : (

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">

            {activeFolder.images.map(
              (img) => (

                <div
                  key={img._id}
                  className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-200 shadow-sm aspect-square"
                >

                  <img
                    src={img.imageUrl}
                    alt={
                      img.caption ||
                      img.filename ||
                      "Gallery Image"
                    }
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                    onClick={() =>
                      setLightboxSrc(
                        img.imageUrl
                      )
                    }
                  />

                  {/* CAPTION */}

                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
                      <p className="text-xs line-clamp-2">
                        {img.caption}
                      </p>
                    </div>
                  )}

                  {/* DELETE */}

                  <button
                    onClick={() =>
                      handleDeleteImage(
                        img
                      )
                    }
                    className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              )
            )}

          </div>
        )}

        {/* =====================================================
            UPLOAD MODAL
        ===================================================== */}

        {showUploadModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() =>
              !uploading &&
              setShowUploadModal(false)
            }
          >

            <div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="flex justify-between items-center border-b pb-3">

                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Upload Image
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {activeFolder.galleryName}
                  </p>
                </div>

                <button
                  onClick={() =>
                    !uploading &&
                    setShowUploadModal(false)
                  }
                  disabled={uploading}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>

              </div>

              <form
                onSubmit={handleUploadImage}
                className="space-y-5 mt-5"
              >

                {/* IMAGE */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Select Image *
                  </label>

                  <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-rose-50 hover:border-rose-400">

                    <Upload className="w-8 h-8 text-rose-600 mb-2" />

                    <span className="text-sm text-gray-600">
                      Click to select image
                    </span>

                    {uploadFile && (
                      <span className="mt-2 text-xs font-semibold bg-rose-100 text-rose-800 px-3 py-1 rounded-full">
                        {uploadFile.name}
                      </span>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setUploadFile(
                          e.target.files?.[0] ||
                            null
                        )
                      }
                    />

                  </label>

                </div>

                {/* CAPTION */}

                <div>

                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Caption
                  </label>

                  <input
                    type="text"
                    value={uploadCaption}
                    onChange={(e) =>
                      setUploadCaption(
                        e.target.value
                      )
                    }
                    maxLength={200}
                    placeholder="Enter image caption"
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />

                </div>

                {/* BUTTONS */}

                <div className="flex justify-end gap-3 pt-3 border-t">

                  <button
                    type="button"
                    onClick={() =>
                      setShowUploadModal(false)
                    }
                    disabled={uploading}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      uploading ||
                      !uploadFile
                    }
                    className="px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
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

        {/* =====================================================
            LIGHTBOX
        ===================================================== */}

        {lightboxSrc && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
            onClick={() =>
              setLightboxSrc(null)
            }
          >

            <button
              onClick={() =>
                setLightboxSrc(null)
              }
              className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full"
            >
              <X className="w-6 h-6" />
            </button>

            <img
              src={lightboxSrc}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-xl"
              onClick={(e) =>
                e.stopPropagation()
              }
            />

          </div>
        )}

      </div>
    );
  }

  // =====================================================
  // GALLERY LIST
  // =====================================================

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 border-gray-200">

        <div>

          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <FolderOpen className="w-8 h-8 text-rose-700" />

            Gallery Management
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Manage gallery folders and images.
          </p>

        </div>

        <div className="flex gap-3">

          <button
            onClick={fetchGalleries}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg border border-gray-300"
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
              setShowFolderModal(true)
            }
            className="flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold rounded-lg shadow-md"
          >
            <FolderPlus className="w-4 h-4" />

            New Gallery
          </button>

        </div>

      </div>

      {/* =====================================================
          LOADING
      ===================================================== */}

      {isLoading ? (
        <Loading />
      ) : folders.length === 0 ? (

        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-16 text-center">

          <FolderOpen className="w-14 h-14 text-gray-300 mx-auto mb-4" />

          <p className="text-gray-500 font-medium">
            No gallery folders found.
          </p>

          <button
            onClick={() =>
              setShowFolderModal(true)
            }
            className="mt-5 px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-sm font-semibold"
          >
            Create Gallery
          </button>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {folders.map(
            (folder) => {

              const cover =
                folder.images[0]
                  ?.imageUrl;

              return (
                <div
                  key={folder._id}
                  className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md overflow-hidden"
                >

                  {/* COVER */}

                  <div
                    className="h-48 bg-gray-100 overflow-hidden relative cursor-pointer"
                    onClick={() =>
                      setActiveFolder(
                        folder
                      )
                    }
                  >

                    {cover ? (
                      <img
                        src={cover}
                        alt={
                          folder.galleryName
                        }
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FolderOpen className="w-16 h-16 text-gray-300" />
                      </div>
                    )}

                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md font-semibold">
                      {folder.images.length}{" "}
                      {folder.images.length ===
                      1
                        ? "photo"
                        : "photos"}
                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="p-4 flex items-center justify-between gap-3">

                    <button
                      onClick={() =>
                        setActiveFolder(
                          folder
                        )
                      }
                      className="font-semibold text-gray-800 text-sm hover:text-rose-700 truncate flex-1 text-left"
                    >
                      {folder.galleryName}
                    </button>

                    <button
                      onClick={() =>
                        handleDeleteFolder(
                          folder
                        )
                      }
                      className="p-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-700 rounded-lg border border-gray-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* =====================================================
          CREATE GALLERY MODAL
      ===================================================== */}

      {showFolderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() =>
            !creatingFolder &&
            setShowFolderModal(false)
          }
        >

          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-200"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="flex justify-between items-center border-b pb-3">

              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  New Gallery
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Create a new image gallery
                </p>
              </div>

              <button
                onClick={() =>
                  setShowFolderModal(false)
                }
                disabled={creatingFolder}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* FORM */}

            <form
              onSubmit={
                handleCreateFolder
              }
              className="space-y-5 mt-5"
            >

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Gallery Name *
                </label>

                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) =>
                    setNewFolderName(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Annual Day 2026"
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  autoFocus
                  required
                />

                {/* IMPORTANT:
                    No restriction on Carousal.
                */}

                <p className="text-xs text-gray-500 mt-2">
                  Enter the name of the gallery you want to create.
                </p>

              </div>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3 border-t">

                <button
                  type="button"
                  onClick={() =>
                    setShowFolderModal(false)
                  }
                  disabled={creatingFolder}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingFolder}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 disabled:opacity-60 text-white rounded-lg text-sm font-semibold flex items-center gap-2"
                >

                  {creatingFolder ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <FolderPlus className="w-4 h-4" />
                      Create Gallery
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

// =====================================================
// LOADING
// =====================================================

function Loading() {
  return (
    <div className="text-center py-20 text-gray-500 font-semibold">

      <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-3" />

      Loading galleries...

    </div>
  );
}