import Informations from "~/Common/Informations/Informations";
import { FcOpenedFolder } from "react-icons/fc";
import { IoCloseSharp } from "react-icons/io5";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Gallery_Data } from "~/DB_Sample/Gallery";

// 🔍 Modal component (folder is typed as `any`)
function GalleryModal({
  isOpen,
  closeModal,
  folder,
}: {
  isOpen: boolean;
  closeModal: () => void;
  folder: any; // Using any since we're not modifying Gallery_Data typing
}) {
  const previewImage = (src: string) => {
    window.open(src, "_blank");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center overflow-auto p-4">
            <Dialog.Panel className="w-[80%] min-h-[80vh] transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title className="font-medium text-gray-900 flex justify-between uppercase text-3xl m-8">
                {folder?.folder_name}
                <div onClick={closeModal} className="cursor-pointer text-4xl">
                  <IoCloseSharp />
                </div>
              </Dialog.Title>

              <div className="mt-4 min-h-[60vh] overflow-y-auto scrollbar-hide">
                {folder?.images?.length ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {folder.images.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`img-${idx}`}
                        className="w-full rounded cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => previewImage(img)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No images available.</p>
                )}
              </div>

              <div className="mt-6 text-right flex items-center justify-center">
                <button
                  className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
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
  );
}

// 📁 Main component
export default function Gallery() {
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (folder: any) => {
    setSelectedFolder(folder);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFolder(null);
  };

  return (
    <>
      <div className="min-h-dvh">
        <div className="uppercase text-2xl font-bold tracking-widest p-4 bg-cyan-500 border-2 border-gray-300 rounded-xs">
          Gallery
        </div>
        <div className="flex gap-8 p-4 flex-wrap">
          {Gallery_Data.map((item, index) => (
            <div
              key={index}
              onClick={() => openModal(item)}
              className="cursor-pointer hover:scale-105 transition-transform text-center"
            >
              <FcOpenedFolder className="text-9xl mx-auto" />
              <div className="mt-2">{item.folder_name}</div>
            </div>
          ))}
        </div>
      </div>

      <GalleryModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        folder={selectedFolder}
      />

      <Informations />
    </>
  );
}
