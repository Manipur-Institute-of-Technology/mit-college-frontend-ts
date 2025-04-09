import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Fragment, memo, useState } from "react";
import Modal from "../components/Modal";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const ModalComponent: React.FC<{ children: React.JSX.Element }> = ({
    children,
  }) => (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      {children}
    </Modal>
  );

  return {
    isOpen,
    setIsOpen,
    ModalComponent,
  } as const;
};
