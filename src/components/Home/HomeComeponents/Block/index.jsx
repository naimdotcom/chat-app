import React, { useEffect, useState } from "react";
import { IoMdMore } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import userImg from "../../../../assets/ProfilePic/Asset 5.webp";
import {
  equalTo,
  get,
  getDatabase,
  onValue,
  orderByChild,
  query,
  ref,
  remove,
} from "firebase/database";
import { DB } from "../../../../FirebaseConfig/FireBaseDBConnection.js";
import { getAuth } from "firebase/auth";
import moment from "moment";
import { ErrorToast, SuccesfullToast } from "../../../../Utils/toast";
import { CiSquareMore } from "react-icons/ci";

function Block() {
  const auth = getAuth();

  const [blockedPersonList, setBlockedPersonList] = useState([]);
  const [activePopupIndex, setActivePopupIndex] = useState(null);

  const handleUnblock = (data) => {
    console.log(data);

    const blockUidJoin = ref(DB, `block/${data.blockKey}`);

    remove(blockUidJoin)
      .then(() => {
        SuccesfullToast("Unblocked Successfully 🎉");
      })
      .catch((err) => {
        console.log(err);
        ErrorToast("Unblocked Failed ☹️");
      });
  };
  useEffect(() => {
    const fetchBlockedPerson = async () => {
      const blockedPersonRef = query(
        ref(DB, `block/`),
        orderByChild("blockedBy"),
        equalTo(auth.currentUser.uid)
      );
      onValue(blockedPersonRef, (snapShot) => {
        let blockedBlankList = [];
        snapShot.forEach((item) => {
          const fetchUserQuery = query(
            ref(DB, "users/"),
            orderByChild("uid"),
            equalTo(item.val().blockedPerson)
          );

          onValue(
            fetchUserQuery,
            (snapShot) => {
              snapShot.forEach((user) => {
                blockedBlankList.push({
                  ...user.val(),
                  blockKey: item.key,
                  blockedBy: item.val().blockedBy,
                  blockedPerson: item.val().blockedPerson,
                  createdAt: item.val().createdAt,
                });
              });
            },
            {
              onlyOnce: true,
            }
          );
        });
        setBlockedPersonList(blockedBlankList);
      });
    };

    fetchBlockedPerson();
  }, []);

  console.log(blockedPersonList);

  return (
    <div className="shadow-lg py-4 px-5 rounded-lg 2xl:w-full  scrollbar-thumb-cs-purple/80 scrollbar-track-cs-purple/40 scrollbar-thumb-r font-poppins ">
      <div className="flex justify-between mb-4">
        <p className="text-xl font-semibold relative">
          <span>Blocked person </span>
          <span className="absolute -top-1 -right-[16px] flex h-4 w-4">
            <span className="animate-ping animate-infinite animate-duration-1000 animate-ease-in-out absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 text-xs text-white justify-center items-center ">
              {blockedPersonList.length}
            </span>
          </span>
        </p>
        <IoMdMore className="text-xl text-cs-purple" />
      </div>
      <div className="overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-thin max-h-[312px] px-2 ">
        {blockedPersonList.map((item, i) => {
          return (
            <div key={i}>
              <div className="flex  mb-3 justify-between items-center">
                <div className="flex items-center gap-4 rounded-full">
                  <picture>
                    <img
                      //   src={userImg}
                      src={item.userProfilePic ? item.userProfilePic : userImg}
                      className="w-16 rounded-full"
                    />
                  </picture>
                  <div className="flex flex-col w-full">
                    <h3 className="text-lg font-semibold font-poppins xl:text-sm truncate w-[80%]">
                      {item?.username}
                    </h3>
                    <p className="text-sm text-[#4D4D4D]/75 font-medium font-poppins xl:text-xs w-full">
                      {moment(item?.sentItAt).fromNow()}
                    </p>
                  </div>
                </div>
                <div className="relative ">
                  <button
                    className="text-cs-purple cursor-pointer font-bold 2xl:text-3xl font-poppins text-3xl"
                    onClick={() =>
                      setActivePopupIndex(activePopupIndex === i ? null : i)
                    }
                  >
                    <CiSquareMore />
                  </button>
                  <div
                    className={`bg-white shadow-xl rounded-xl absolute duration-300 ${
                      activePopupIndex === i
                        ? "-top-[2px] right-8 scale-100"
                        : "scale-0  -top-0 -right-9"
                    }`}
                  >
                    <div
                      className=" hover:bg-cs-purple flex items-center gap-1 hover:text-white w-full px-3 py-2 rounded-xl rounded-tr-xl duration-200 text-sm cursor-pointer"
                      onClick={() => handleUnblock(item)}
                    >
                      Unblock
                    </div>
                  </div>
                </div>
              </div>
              <hr className="mb-2" key={i + 20} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Block;
