import React, { useEffect, useState } from "react";
import { GrHomeRounded } from "react-icons/gr";
import { AiOutlineMessage } from "react-icons/ai";
import { ProfileImg1 } from "../../Utils/Constant";
import { FaRegBell } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Uploader } from "uploader"; // Installed by "react-uploader".
import { UploadButton } from "react-uploader";
import { MdOutlineCloudUpload } from "react-icons/md";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  onValue,
  update,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { ErrorToast, SuccesfullToast } from "../../Utils/toast";

function NavigationBar() {
  const [userList, setuserList] = useState({});
  const [userProfileImg, setuserProfileImg] = useState(ProfileImg1);
  const auth = getAuth();
  const db = getDatabase();

  const location = useLocation();

  const uploader = Uploader({
    apiKey: "free", // Get production API keys from Bytescale
  });

  const options = {
    multi: true,
    editor: {
      images: {
        allowResizeOnMove: true,
        preview: true,
        crop: true,
        cropRatio: 4 / 3,
        cropShape: "circ",
      },
    },
  };

  const handleSignOut = (auth) => {
    auth.signOut();
    SuccesfullToast("Logout Successfully");
  };

  const handleImgUpload = (files) => {
    updateProfile(auth.currentUser, {
      photoURL: files[0].fileUrl,
    })
      .then(() => {
        update(ref(db, `users/${userList.userKey}`), {
          userProfilePic: files[0].fileUrl,
        })
          .then(() => {
            SuccesfullToast("Profile Update done", "top-left");
          })
          .catch((err) => {
            ErrorToast(`${err.code}`);
          });
      })
      .catch((err) => {
        ErrorToast(`${err.code}`);
      });
  };

  useEffect(() => {
    const userId = auth?.currentUser?.uid;
    const userQuery = query(
      ref(db, "users/"),
      orderByChild("uid"),
      equalTo(userId)
    );
    onValue(userQuery, (snapShot) => {
      snapShot.forEach((item) => {
        setuserList(item.val());
        setuserProfileImg(item.val().userProfilePic);
      });
    });
  }, [location, auth?.currentUser?.uid]);

  return (
    <div className="bg-cs-purple  w-[186px] h-full  py-6 rounded-xl overflow-hidden">
      <div className="flex flex-col items-center gap-20 mb-10 -z-30">
        <div className="relative group/upload">
          <picture className="">
            <img
              src={
                auth.currentUser?.photoURL
                  ? auth.currentUser?.photoURL
                  : userProfileImg
              }
              alt={userProfileImg}
              className="w-24 h-24 rounded-full"
            />
          </picture>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover/upload:bg-black/45 group-hover/upload:rounded-full w-full h-full  items-center justify-center group-hover/upload:flex hidden text-white text-2xl duration-500 ease-in-out ring ring-white/70 ">
            <UploadButton
              uploader={uploader}
              options={options}
              onComplete={(files) => handleImgUpload(files)}
            >
              {({ onClick }) => (
                <button onClick={onClick}>
                  <MdOutlineCloudUpload />
                </button>
              )}
            </UploadButton>
          </div>
          <p className="text-center">{auth.currentUser.displayName}</p>
        </div>
        <div className="text-white/70  flex flex-col gap-16 ">
          <NavLink to={"/"}>
            <div
              className={`relative  w-full homebar_bg   ${
                location.pathname == "/"
                  ? "homebar_bgAfter text-cs-deepBlue before:shadow-2xl before:shadow-black transition-colors duration-300 "
                  : ""
              }`}
            >
              <GrHomeRounded
                className={`text-[44px] ${
                  location.pathname == "/" ? "animate-tada" : ""
                }`}
              />
            </div>
          </NavLink>
          <NavLink to={"/messages"}>
            <div
              className={`relative homebar_bg   ${
                location.pathname == "/messages"
                  ? "homebar_bgAfter text-cs-deepBlue before:shadow-2xl before:shadow-black transition-colors duration-300"
                  : ""
              } `}
            >
              <AiOutlineMessage
                className={`text-[44px] ${
                  location.pathname == "/messages" ? "animate-tada" : ""
                } `}
              />
            </div>
          </NavLink>
          <NavLink to={"/notification"}>
            <div
              className={`relative homebar_bg   ${
                location.pathname == "/notification"
                  ? "homebar_bgAfter text-cs-deepBlue before:shadow-2xl before:shadow-black transition-colors duration-infinite"
                  : ""
              } `}
            >
              <FaRegBell className="text-[44px] animate-jiggle dur" />
            </div>
          </NavLink>
          <NavLink to={"/settings"}>
            <div
              className={`relative homebar_bg   ${
                location.pathname == "/settings"
                  ? "homebar_bgAfter text-cs-deepBlue before:shadow-2xl before:shadow-black transition-colors duration-300"
                  : ""
              } `}
            >
              <IoSettingsOutline
                className={`text-[44px] ${
                  location.pathname == "/settings" ? "animate-tada" : ""
                } `}
              />
            </div>
          </NavLink>
        </div>

        <div className="mt-10" onClick={() => handleSignOut(auth)}>
          <HiOutlineLogout className="text-[44px] text-white/70" />
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
