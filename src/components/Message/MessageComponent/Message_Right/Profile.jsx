import React from "react";
import profieImage from "../../../../assets/ProfilePic/Asset 16.webp";
import { IoMdMore } from "react-icons/io";
function Profile() {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <picture>
            <img src={profieImage} alt={profieImage} className="w-14" />
          </picture>
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold font-poppins text-xl text-black">
              Name
            </h3>
            <p className="font-poppins text-sm text-black/85 ">online</p>
          </div>
        </div>
        <div>
          <span className="text-3xl">
            <IoMdMore />
          </span>
        </div>
      </div>
      <hr className="mt-4 w-full border-[1.5px] text-black/25" />
    </div>
  );
}

export default Profile;
