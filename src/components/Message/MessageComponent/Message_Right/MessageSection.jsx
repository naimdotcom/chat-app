import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";

function MessageSection({}) {
  const [emoji, setEmoji] = useState(false);
  const [msgInput, setMsgInput] = useState("");

  return (
    <div className="">
      <hr className="mb-4 w-full border-[1.5px] text-black/25 " />
      <div className="flex w-full">
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
              />
            </div>
            <button>
              <span>
                <IoCameraOutline className="text-3xl " />
              </span>
            </button>
          </div>
        </div>
        <button>
          <span>
            <IoIosSend />
          </span>
        </button>
      </div>
    </div>
  );
}

export default MessageSection;
