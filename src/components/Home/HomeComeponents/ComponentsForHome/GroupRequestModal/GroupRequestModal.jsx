import React, { useEffect, useState } from "react";

import profileImg from "../../../../../assets/ProfilePic/Asset 5.webp";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import {
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { GetTimeNow } from "../../../../../Utils/moment";
import { SuccesfullToast } from "../../../../../Utils/toast";

function GroupRequestModal({ groupID }) {
  const auth = getAuth();
  const db = getDatabase();
  const fireDB = getFirestore();

  const [data, setData] = useState([]);

  const handleAcceptReq = async (item) => {
    const groupReqDbRef = doc(fireDB, `groups/${groupID}`);

    await updateDoc(groupReqDbRef, {
      groupMembersUID: arrayUnion(item?.uid),
      groupMembers: arrayUnion({
        uid: item?.uid,
        invitedBy: auth?.currentUser?.uid,
        joinedAt: GetTimeNow(),
      }),
    })
      .then(() => {
        const groupReqDbRef = doc(fireDB, `groupRequest/${groupID}`);

        updateDoc(groupReqDbRef, {
          members: arrayRemove(item?.uid),
          RequestedAt: GetTimeNow(),
        }).then(() => {
          SuccesfullToast("Request Rejected");
        });
      })
      .then(() => {
        SuccesfullToast("Request Accepted");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRejectReq = async (item) => {
    const groupReqDbRef = doc(fireDB, `groupRequest/${groupID}`);

    await updateDoc(groupReqDbRef, {
      members: arrayRemove(item?.uid),
      RequestedAt: GetTimeNow(),
    })
      .then(() => {
        SuccesfullToast("Request Rejected");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getData = () => {
      const groupReqDbRef = doc(fireDB, `groupRequest/${groupID}`);

      onSnapshot(groupReqDbRef, (snapshot) => {
        const groupReqEmptyData = [];
        snapshot.data().members.map((item) => {
          const userRef = ref(db, `users/${item}`);
          onValue(userRef, (snapShot) => {
            groupReqEmptyData.push({
              ...snapShot.val(),
            });
          });
        });

        setData(groupReqEmptyData);
      });
    };

    getData();
  }, []);
  return (
    <div>
      <div className="overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-thin max-h-[312px] px-2">
        {data.length == 0 ? (
          <p>No Request avalaible</p>
        ) : (
          data?.map((item, i) => {
            return (
              <div key={item?.uid || uuidv4()}>
                <div
                  className="flex  mb-3 justify-between items-center"
                  key={item?.uid || uuidv4()}
                >
                  <div className="flex items-center gap-4">
                    <picture>
                      <img
                        // src={}
                        src={item?.userProfilePic || profileImg}
                        alt={item?.userProfilePic || profileImg}
                        className="w-16 rounded-full"
                      />
                    </picture>
                    <div className="flex flex-col ">
                      <h3 className="text-lg font-semibold font-poppins ">
                        {item?.username}
                      </h3>
                      <p className="text-sm text-[#4D4D4D]/75 font-medium font-poppins ">
                        {item?.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="bg-cs-purple px-5 py-2 rounded-xl text-white  font-semibold font-poppins "
                      onClick={() => handleAcceptReq(item)}
                    >
                      Accept
                    </button>
                    <button
                      className="bg-cs-purple px-5 py-2 rounded-xl text-white  font-semibold font-poppins "
                      onClick={() => handleRejectReq(item)}
                    >
                      cancle
                    </button>
                  </div>
                </div>
                {data.length > 1 && (
                  <hr className="mb-2" key={item?.url || uuidv4()} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default GroupRequestModal;
