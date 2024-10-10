import React, { useEffect, useState } from "react";
import {
  equalTo,
  get,
  getDatabase,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { IoMdMore } from "react-icons/io";
import userImg from "../../../../assets/ProfilePic/Asset 14.webp";
import { getAuth } from "firebase/auth";
import { GetTimeNow } from "../../../../Utils/moment";
import { IoPersonAddOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import joinTheUid from "../../../../Utils/joinUID";
import { DB } from "../../../../FirebaseConfig/FireBaseDBConnection";

function UserList() {
  const auth = getAuth();
  const db = getDatabase();
  const [users, setusers] = useState([]);
  const [friendReqList, setFriendReqList] = useState([]);

  const handleFriendReq = (user) => {
    const friendRequestKey =
      auth.currentUser.uid < user.uid
        ? `${auth.currentUser.uid}_${user.uid}`
        : `${user.uid}_${auth.currentUser.uid}`;
    const friendReqDbRef = ref(db, `friendreq/${friendRequestKey}`);

    set(friendReqDbRef, {
      sender_uid: auth.currentUser.uid,
      receiver_uid: user.uid,
      createdAt: GetTimeNow(),
    });
  };

  /**
   * todo: handle cancle friend request
   * remove the friend request from data base with the reqKey
   * @param {*} item
   */

  const handleCancleFriendReq = (item) => {
    // console.log(item.reqKey);
    const friendReqDbRef = ref(db, "friendreq/" + item.reqKey);
    remove(friendReqDbRef);
  };

  /*
  todo: 
  get all friend request from fireBase
  */
  useEffect(() => {
    const friendReqDBQuery = query(
      ref(db, "friendreq/"),
      orderByChild("sender_uid"),
      equalTo(auth.currentUser.uid)
    );

    onValue(friendReqDBQuery, (snapShot) => {
      let friendReqList = [];
      snapShot.forEach((item) => {
        friendReqList.push({ ...item.val(), reqKey: item.key });
      });
      setFriendReqList(friendReqList);
    });
    return () => {
      setFriendReqList([]);
    };
  }, [db, auth.currentUser.uid]);

  /**
   * todo: get all users from firebase
   */
  useEffect(() => {
    const fetchUsers = () => {
      const userDbRef = ref(db, "users/");
      onValue(userDbRef, (snapshot) => {
        let userBlankArr = [];

        snapshot.forEach((item) => {
          if (item.val().uid !== auth.currentUser.uid) {
            const uidJoin = joinTheUid(auth.currentUser.uid, item.val().uid);
            const blockListRef = ref(db, `block/${uidJoin}`);
            const friendListRef = ref(
              db,
              `friend/${auth.currentUser.uid}_${item.val().uid}`
            );
            // Check blocklist status for each user
            onValue(blockListRef, (blockSnapShot) => {
              if (!blockSnapShot.exists()) {
                onValue(friendListRef, (friendSnapShot) => {
                  if (!friendSnapShot.exists()) {
                    userBlankArr.push({
                      ...item.val(),
                      userKey: item.key,
                    });
                    setusers([...userBlankArr]);
                  }
                }); // Update state after each valid user is found
              }
            }); // Ensure the listener is removed after one call
          }
        });
      });
    };

    fetchUsers();
  }, [DB, auth?.currentUser, friendReqList]);

  console.log("====================================");
  console.log(users);
  console.log("====================================");

  return (
    <div className="shadow-lg py-4 px-5 rounded-lg 2xl:w-full  scrollbar-thumb-cs-purple/80 scrollbar-track-cs-purple/40 scrollbar-thumb-r font-poppins">
      <div className="flex justify-between mb-4">
        <p className="text-xl font-semibold relative">
          <span>User List</span>
          <span className="absolute -top-1 -right-[16px] flex h-4 w-4">
            <span className="animate-ping animate-infinite animate-duration-1000 animate-ease-in-out absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-sky-500 text-xs text-white justify-center items-center ">
              {users.length}
            </span>
          </span>
        </p>
        <IoMdMore className="text-xl text-cs-purple" />
      </div>
      <div className="overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-thin max-h-[312px]  px-2 ">
        {users.map((item, i) => {
          return (
            <div key={item.uid + i}>
              <div className="flex  mb-3 justify-between items-center">
                <div className="flex items-center gap-4 rounded-full">
                  <picture>
                    <img
                      src={item.userProfilePic ? item.userProfilePic : userImg}
                      alt={""}
                      className="w-16 rounded-full"
                    />
                  </picture>
                  <div className="flex flex-col ">
                    <h3 className="text-lg font-semibold font-poppins xl:text-sm ">
                      {item.username}
                    </h3>
                    <p className="text-sm text-[#4D4D4D]/75 font-medium font-poppins xl:text-xs">
                      {item.status}
                    </p>
                  </div>
                </div>
                <div>
                  {friendReqList.some(
                    (req) =>
                      req.receiver_uid === item.uid &&
                      req.sender_uid === auth.currentUser.uid
                  ) ? (
                    <button
                      onClick={() =>
                        handleCancleFriendReq(
                          friendReqList.find(
                            (req) =>
                              req.receiver_uid === item.uid &&
                              req.sender_uid === auth.currentUser.uid
                          )
                        )
                      }
                      className="bg-cs-purple 2xl:px-5 2xl:py-2 rounded-xl text-white 2xl:text-lg font-semibold font-poppins text-sm px-3 py-1"
                    >
                      <MdOutlineCancel />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFriendReq(item)}
                      className="bg-cs-purple 2xl:px-5 2xl:py-2 rounded-xl text-white 2xl:text-lg font-semibold font-poppins text-sm px-3 py-1"
                    >
                      <IoPersonAddOutline />
                    </button>
                  )}
                </div>
              </div>
              <hr className="mb-2" key={i + 20} />
            </div>
          );
        })}
        {/* member */}

        {/* member */}
      </div>
    </div>
  );
}

export default UserList;
