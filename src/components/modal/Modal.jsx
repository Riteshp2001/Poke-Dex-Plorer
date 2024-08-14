import React from "react";
import IntroModal from "./IntroModal";
import TabsContainer from "./TabsContainer";
import { usePokemonModal } from "../../context/PokemonModalProvider";
import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const Modal = () => {
  const { isModalOpen, closeModal, currentPokemon } = usePokemonModal();

  return (
    <Dialog.Root
      open={isModalOpen}
      onOpenChange={(isOpen) => !isOpen && closeModal()}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />

        <Dialog.Content
          aria-describedby="modal-description"
          className={`modal ${currentPokemon?.types[0]?.name}`}
          data-content={currentPokemon?.name}
        >
          <Dialog.Title asChild>
            <VisuallyHidden.Root>
              {currentPokemon?.name || "Modal Title"}
            </VisuallyHidden.Root>
          </Dialog.Title>

          <IntroModal />

          <TabsContainer />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
