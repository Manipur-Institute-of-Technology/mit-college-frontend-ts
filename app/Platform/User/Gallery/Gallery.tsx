import { useState, useEffect, Fragment } from "react";
import Informations from "~/Common/Informations/Informations";
import { IoCloseSharp } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import {
  FolderOpen,
  Image as ImageIcon,
} from "lucide-react";
import "./gallery.css";
import apiClient, {
  API_BASE_URL,
} from "~/utils/apiClient";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type GalleryImage = {
  _id: string;
  imageUrl: string;
  filename?: string;
  caption?: string;
};

type GalleryFolder = {
  _id: string;
  galleryName: string;
  is_normal_gallery: boolean;
  images: GalleryImage[];
};

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY MODAL
// ─────────────────────────────────────────────────────────────────────────────

function GalleryModal({
  isOpen,
  closeModal,
  folder,
}: {
  isOpen: boolean;
  closeModal: () => void;
  folder: GalleryFolder | null;
}) {
  const [lightbox, setLightbox] =
    useState<string | null>(null);

  if (!folder) return null;

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────
          MODAL
      ───────────────────────────────────────────────────────────────────── */}

      <Transition
        appear
        show={isOpen}
        as={Fragment}
      >
        <Dialog
          as="div"
          className="relative z-50 front_most"
          onClose={closeModal}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center overflow-auto p-4">

              <Dialog.Panel
                className="
                  w-full
                  max-w-5xl
                  max-h-[90vh]
                  min-h-[60vh]
                  transform
                  rounded-2xl
                  bg-white
                  p-5
                  sm:p-6
                  text-left
                  align-middle
                  shadow-2xl
                  transition-all
                  flex
                  flex-col
                "
              >

                {/* ───────────────────────────────────────────────────────────
                    MODAL HEADER
                ─────────────────────────────────────────────────────────── */}

                <Dialog.Title
                  className="
                    font-bold
                    text-gray-900
                    flex
                    justify-between
                    items-center
                    text-xl
                    sm:text-2xl
                    mb-5
                    pb-4
                    border-b
                    border-gray-200
                  "
                >
                  <div className="flex items-center gap-3 min-w-0">

                    <div
                      className="
                        w-10
                        h-10
                        rounded-xl
                        bg-cyan-100
                        text-cyan-600
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                    >
                      <FolderOpen
                        className="w-5 h-5"
                        strokeWidth={1.8}
                      />
                    </div>

                    <span
                      className="
                        uppercase
                        tracking-wide
                        truncate
                      "
                    >
                      {folder.galleryName}
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="
                      flex
                      items-center
                      justify-center
                      w-9
                      h-9
                      rounded-lg
                      text-gray-400
                      hover:text-gray-700
                      hover:bg-gray-100
                      transition-colors
                      flex-shrink-0
                    "
                    aria-label="Close gallery"
                  >
                    <IoCloseSharp
                      className="text-2xl"
                    />
                  </button>

                </Dialog.Title>

                {/* ───────────────────────────────────────────────────────────
                    GALLERY INFORMATION
                ─────────────────────────────────────────────────────────── */}

                <div className="flex items-center gap-2 mb-4">

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      px-3
                      py-1.5
                      bg-cyan-50
                      border
                      border-cyan-100
                      rounded-lg
                    "
                  >
                    <ImageIcon
                      className="w-4 h-4 text-cyan-600"
                    />

                    <span className="text-xs font-semibold text-cyan-700">
                      {folder.images.length}{" "}
                      {folder.images.length === 1
                        ? "Photo"
                        : "Photos"}
                    </span>

                  </div>

                </div>

                {/* ───────────────────────────────────────────────────────────
                    IMAGES
                ─────────────────────────────────────────────────────────── */}

                <div className="flex-1 min-h-0 overflow-y-auto hide-scrollbar pr-1">

                  {folder.images.length === 0 ? (

                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">

                      <div
                        className="
                          w-16
                          h-16
                          rounded-2xl
                          bg-gray-100
                          flex
                          items-center
                          justify-center
                          mb-4
                        "
                      >
                        <ImageIcon
                          className="w-8 h-8 text-gray-300"
                        />
                      </div>

                      <p className="text-sm font-semibold text-gray-500">
                        No images in this gallery yet.
                      </p>

                    </div>

                  ) : (

                    <div
                      className="
                        grid
                        grid-cols-2
                        sm:grid-cols-3
                        md:grid-cols-4
                        gap-3
                      "
                    >

                      {folder.images.map(
                        (img) => (
                          <div
                            key={
                              img._id ||
                              img.imageUrl
                            }
                            className="
                              relative
                              aspect-square
                              overflow-hidden
                              rounded-xl
                              bg-gray-100
                              border
                              border-gray-200
                              cursor-pointer
                              group
                            "
                            onClick={() =>
                              setLightbox(
                                img.imageUrl
                              )
                            }
                          >

                            <img
                              src={
                                img.imageUrl
                              }
                              alt={
                                img.caption ||
                                img.filename ||
                                "Gallery image"
                              }
                              className="
                                w-full
                                h-full
                                object-cover
                                transition-transform
                                duration-300
                                group-hover:scale-110
                              "
                              onError={(e) => {
                                (
                                  e.currentTarget as HTMLImageElement
                                ).style.opacity =
                                  "0.3";
                              }}
                            />

                            {/* Hover overlay */}

                            <div
                              className="
                                absolute
                                inset-0
                                bg-black/0
                                group-hover:bg-black/20
                                transition-colors
                                duration-300
                              "
                            />

                          </div>
                        )
                      )}

                    </div>

                  )}

                </div>

                {/* ───────────────────────────────────────────────────────────
                    CLOSE BUTTON
                ─────────────────────────────────────────────────────────── */}

                <div className="mt-5 pt-4 border-t border-gray-200 flex justify-end">

                  <button
                    type="button"
                    className="
                      px-5
                      py-2.5
                      bg-cyan-500
                      text-white
                      rounded-xl
                      hover:bg-cyan-600
                      active:bg-cyan-700
                      font-semibold
                      text-sm
                      transition-colors
                      shadow-sm
                    "
                    onClick={closeModal}
                  >
                    Close
                  </button>

                </div>

              </Dialog.Panel>

            </div>
          </Transition.Child>
        </Dialog>
      </Transition>

      {/* ─────────────────────────────────────────────────────────────────────
          LIGHTBOX
      ───────────────────────────────────────────────────────────────────── */}

      {lightbox && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/90
            backdrop-blur-md
            p-4
          "
          onClick={() =>
            setLightbox(null)
          }
        >

          {/* Close */}

          <button
            type="button"
            onClick={() =>
              setLightbox(null)
            }
            className="
              absolute
              top-5
              right-5
              z-[10000]
              w-10
              h-10
              rounded-full
              bg-white/10
              hover:bg-white/20
              text-white
              flex
              items-center
              justify-center
              transition-colors
            "
            aria-label="Close image"
          >
            <IoCloseSharp className="text-2xl" />
          </button>

          <img
            src={lightbox}
            alt="Full view"
            className="
              relative
              z-[10000]
              max-h-[90vh]
              max-w-full
              object-contain
              rounded-xl
              shadow-2xl
            "
            onClick={(e) =>
              e.stopPropagation()
            }
          />

        </div>

      )}

    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN GALLERY
// ─────────────────────────────────────────────────────────────────────────────

export default function Gallery() {
  const [folders, setFolders] =
    useState<GalleryFolder[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [selectedFolder, setSelectedFolder] =
    useState<GalleryFolder | null>(null);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  // ───────────────────────────────────────────────────────────────────────────
  // FETCH GALLERIES
  // ───────────────────────────────────────────────────────────────────────────

  const fetchGalleries = async () => {
    setIsLoading(true);

    try {
      const res =
        await apiClient.get("/gallery");

      const data =
        res.data?.data ??
        res.data ??
        [];

      const list: GalleryFolder[] =
        Array.isArray(data)
          ? data
          : [];

      // ───────────────────────────────────────────────────────────────────────
      // REMOVE CAROUSAL FOLDER
      // ───────────────────────────────────────────────────────────────────────

      const filteredList =
        list.filter((folder) => {
          const galleryName =
            String(
              folder.galleryName || ""
            )
              .trim()
              .toLowerCase();

          return galleryName !== "carousal";
        });

      // ───────────────────────────────────────────────────────────────────────
      // FORMAT IMAGES
      // ───────────────────────────────────────────────────────────────────────

      const formatted: GalleryFolder[] =
        filteredList.map((folder) => ({
          ...folder,

          images: Array.isArray(
            folder.images
          )
            ? folder.images.map(
                (img: any, index: number) => ({
                  _id:
                    img._id ||
                    `img-${folder._id}-${index}`,

                  imageUrl: img.filename
                    ? `${API_BASE_URL}/uploads/gallery/${encodeURIComponent(
                        folder.galleryName
                      )}/${encodeURIComponent(
                        img.filename
                      )}`
                    : img.imageUrl ||
                      img.url ||
                      "",

                  filename:
                    img.filename,

                  caption:
                    img.caption,
                })
              )
            : [],
        }));

      setFolders(formatted);

    } catch (error) {

      setFolders([]);

    } finally {
      setIsLoading(false);
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // INITIAL FETCH
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    fetchGalleries();
  }, []);

  // ───────────────────────────────────────────────────────────────────────────
  // OPEN MODAL
  // ───────────────────────────────────────────────────────────────────────────

  const openModal = (
    folder: GalleryFolder
  ) => {
    setSelectedFolder(folder);
    setIsModalOpen(true);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // CLOSE MODAL
  // ───────────────────────────────────────────────────────────────────────────

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFolder(null);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // RENDER
  // ───────────────────────────────────────────────────────────────────────────

  return (
    <>
      <div className="min-h-dvh bg-gray-50">

        {/* ───────────────────────────────────────────────────────────────────
            HEADER
        ─────────────────────────────────────────────────────────────────── */}

        <div
          className="
            uppercase
            text-2xl
            font-bold
            tracking-widest
            p-4
            bg-cyan-500
            border-b-2
            border-cyan-600
            text-white
            text-center
            shadow-sm
          "
        >
          Gallery
        </div>

        {/* ───────────────────────────────────────────────────────────────────
            CONTENT
        ─────────────────────────────────────────────────────────────────── */}

        <div className="max-w-7xl mx-auto">

          {/* ─────────────────────────────────────────────────────────────────
              LOADING
          ───────────────────────────────────────────────────────────────── */}

          {isLoading ? (

            <div className="flex flex-col items-center justify-center py-24">

              <div
                className="
                  w-10
                  h-10
                  border-4
                  border-cyan-200
                  border-t-cyan-500
                  rounded-full
                  animate-spin
                  mb-4
                "
              />

              <p className="text-sm font-semibold text-gray-500">
                Loading gallery...
              </p>

            </div>

          ) : folders.length === 0 ? (

            /* ───────────────────────────────────────────────────────────────
                EMPTY STATE
            ─────────────────────────────────────────────────────────────── */

            <div className="flex flex-col items-center justify-center py-24 text-center">

              <div
                className="
                  w-20
                  h-20
                  rounded-3xl
                  bg-cyan-50
                  border
                  border-cyan-100
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <FolderOpen
                  className="w-10 h-10 text-cyan-400"
                  strokeWidth={1.5}
                />
              </div>

              <h2 className="text-lg font-bold text-gray-700">
                No Gallery Albums
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                No gallery albums are available at the moment.
              </p>

            </div>

          ) : (

            /* ───────────────────────────────────────────────────────────────
                FOLDERS
            ─────────────────────────────────────────────────────────────── */

            <div className="p-4 sm:p-6">

              <div
                className="
                  grid
                  grid-cols-2
                  sm:grid-cols-3
                  md:grid-cols-4
                  lg:grid-cols-5
                  xl:grid-cols-6
                  gap-4
                  sm:gap-5
                "
              >

                {folders.map(
                  (folder) => (

                    <button
                      key={folder._id}
                      type="button"
                      onClick={() =>
                        openModal(
                          folder
                        )
                      }
                      className="
                        group
                        text-left
                        bg-white
                        border
                        border-gray-200
                        rounded-2xl
                        p-4
                        shadow-sm
                        hover:shadow-xl
                        hover:border-cyan-300
                        hover:-translate-y-1
                        transition-all
                        duration-300
                        focus:outline-none
                        focus:ring-2
                        focus:ring-cyan-400
                        focus:ring-offset-2
                      "
                    >

                      {/* ─────────────────────────────────────────────────
                          FOLDER ICON
                      ───────────────────────────────────────────────── */}

                      <div className="relative flex justify-center items-center pt-2">

                        {/* Folder tab */}

                        <div
                          className="
                            absolute
                            top-0
                            left-1/2
                            -translate-x-1/2
                            w-12
                            h-4
                            bg-cyan-400
                            rounded-t-lg
                            transition-colors
                            duration-300
                            group-hover:bg-cyan-500
                          "
                        />

                        {/* Folder body */}

                        <div
                          className="
                            relative
                            z-10
                            w-20
                            h-16
                            flex
                            items-center
                            justify-center
                            bg-cyan-500
                            rounded-xl
                            shadow-md
                            transition-all
                            duration-300
                            group-hover:bg-cyan-600
                            group-hover:scale-105
                          "
                        >

                          <FolderOpen
                            className="
                              w-10
                              h-10
                              text-white
                              transition-transform
                              duration-300
                              group-hover:scale-110
                            "
                            strokeWidth={1.8}
                          />

                        </div>

                      </div>

                      {/* ─────────────────────────────────────────────────
                          FOLDER NAME
                      ───────────────────────────────────────────────── */}

                      <div className="mt-5">

                        <h3
                          className="
                            text-sm
                            font-bold
                            text-gray-800
                            uppercase
                            tracking-wide
                            truncate
                            group-hover:text-cyan-700
                            transition-colors
                          "
                          title={
                            folder.galleryName
                          }
                        >
                          {folder.galleryName}
                        </h3>

                        {/* ───────────────────────────────────────────────
                            IMAGE COUNT
                        ─────────────────────────────────────────────── */}

                        <div className="flex items-center gap-1.5 mt-1.5">

                          <ImageIcon
                            className="
                              w-3.5
                              h-3.5
                              text-cyan-500
                            "
                          />

                          <span className="text-xs text-gray-500">

                            {folder.images.length}{" "}

                            {folder.images.length ===
                            1
                              ? "photo"
                              : "photos"}

                          </span>

                        </div>

                      </div>

                    </button>

                  )
                )}

              </div>

            </div>

          )}

        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────────
          GALLERY MODAL
      ───────────────────────────────────────────────────────────────────── */}

      <GalleryModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        folder={selectedFolder}
      />

      {/* ─────────────────────────────────────────────────────────────────────
          INFORMATION
      ───────────────────────────────────────────────────────────────────── */}

      <Informations />

    </>
  );
}