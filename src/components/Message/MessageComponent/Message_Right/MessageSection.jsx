import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import ModalComponent from "../../../Home/HomeComeponents/modalComponent/ModalComponent";
import ImageSendModalComp from "./ImageSendModalComp";

function MessageSection({}) {
  const [emoji, setEmoji] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModalForCamera = () => {
    setModalIsOpen(true);
  };

  const closeModalForCamera = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="">
      <hr className="mb-4 w-full border-[1.5px] text-black/25 " />
      <div className="flex w-full gap-2">
        <div className="bg-[#F1F1F1] w-full flex items-center pr-5 rounded-lg">
          <input
            type="text"
            className="bg-[#F1F1F1] w-full px-4 py-3 rounded-lg"
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
          />
          <div className="flex gap-3 relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                setEmoji((prev) => !prev);
              }}
            >
              <span>
                <MdOutlineEmojiEmotions className="text-3xl " />
              </span>
            </button>
            <div className="absolute bottom-10 right-10">
              <EmojiPicker
                open={emoji}
                // theme="dark"
                emojiStyle="apple"
                defaultSkinTone={`dark`}
                onEmojiClick={(emoji) => {
                  setMsgInput((prev) => prev + emoji.emoji);
                }}
                className="z-50"
              />
            </div>
            <button>
              <span onClick={openModalForCamera}>
                <IoCameraOutline className="text-3xl " />
              </span>
              <div>
                <ModalComponent
                  openModal={openModalForCamera}
                  closeModal={closeModalForCamera}
                  modalIsOpen={modalIsOpen}
                  classname={" w-[70vw] max-h-[90vh] "}
                  // appElement={document.getElementById("root")}
                >
                  <ImageSendModalComp
                    closeModalForCamera={closeModalForCamera}
                  />
                </ModalComponent>
              </div>
            </button>
          </div>
        </div>
        <button className="bg-cs-purple text-white px-4 py-2 rounded-lg">
          <span className="text-2xl">
            <IoIosSend />
          </span>
        </button>
      </div>
    </div>
  );
}

export default MessageSection;
