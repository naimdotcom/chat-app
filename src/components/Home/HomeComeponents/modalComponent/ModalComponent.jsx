import React from "react";
import ReactDOM from "react-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Modal from "react-modal";

const customStyles = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",

    transform: "translate(-50%, -50%)",
    zIndex: "1000",
    padding: "2rem 3rem",
    borderRadius: "20px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.75)",
    zIndex: "1000",
  },
};

function ModalComponent({
  openModal,
  closeModal,
  modalIsOpen,
  classname,
  children,
}) {
  return (
    <Modal
      isOpen={modalIsOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className={`${classname}`}>
        <button onClick={closeModal}>
          <IoIosCloseCircleOutline className="text-3xl text-cs-purple" />
        </button>
        <div>{children}</div>
      </div>
    </Modal>
  );
}

export default ModalComponent;
