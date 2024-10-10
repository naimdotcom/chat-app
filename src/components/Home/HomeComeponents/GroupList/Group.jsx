import React, { useEffect, useState } from "react";
import profileImg from "../../../../assets/ProfilePic/Asset 5.webp";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import {
  getFirestore,
  onSnapshot,
  query as fireQuery,
  doc,
  collection,
  where,
  setDoc,
  arrayUnion,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { GetTimeNow } from "../../../../Utils/moment";
import { SuccesfullToast } from "../../../../Utils/toast";
function Group() {
  const auth = getAuth();
  const db = getDatabase();
  const fireDB = getFirestore();
  const [groupData, setGroupData] = useState([]);
  const [groupReqData, setGroupReqData] = useState([]);
  const uid = auth?.currentUser?.uid;

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const joinTheGroup = async (item) => {
    const groupReqDBRef = doc(fireDB, `groupRequest/${item.id}`);
    await setDoc(groupReqDBRef, {
      members: arrayUnion(uid),
      RequestedAt: GetTimeNow(),
    }).then(() => {
      SuccesfullToast("Request Sent");
    });
  };

  const cancleJoinReq = async (item) => {
    const groupReqDBRef = doc(fireDB, `groupRequest/${item.id}`);

    await updateDoc(groupReqDBRef, {
      members: arrayRemove(uid),
      RequestedAt: GetTimeNow(),
    })
      .then(() => {
        SuccesfullToast("Request Canceled");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getData = () => {
      const groupDbRef = collection(fireDB, "groups");

      onSnapshot(groupDbRef, (snapshot) => {
        const groupEmptyData = [];
        snapshot.forEach((doc) => {
          // console.log(doc.data());

          if (doc.data().creator != uid) {
            groupEmptyData.push({ id: doc.id, ...doc.data() });
          }
        });
        setGroupData(groupEmptyData);
      });
    };
    getData();
    // console.log(groupData);
  }, []);

  useEffect(() => {
    const joinedOrNot = () => {
      const groupReqDbRef = fireQuery(
        collection(fireDB, "groupRequest/"),
        where("members", "array-contains", uid)
      );
      onSnapshot(groupReqDbRef, (snapshot) => {
        const groupReqEmptyData = [];
        snapshot.forEach((doc) => {
          groupReqEmptyData.push({ id: doc.id, ...doc.data() });
        });

        setGroupReqData(groupReqEmptyData);
      });
    };

    joinedOrNot();

    console.log(groupReqData);
  }, []);
  return (
    <div className="shadow-lg py-4 px-5 rounded-lg w-full min-w-[477px] scrollbar-thumb-cs-purple/80 scrollbar-track-cs-purple/40 scrollbar-thumb-r font-poppins ">
      <div className="flex justify-between mb-4">
        <p className="text-xl font-semibold "> Group</p>
        <div>
          <button
            // onClick={openModal}
            className="text-sm bg-cs-purple text-white  px-3 py-1 rounded-xl font-semibold font-poppins "
          >
            Create Group
          </button>
        </div>
      </div>

      <div className="overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-thin max-h-[312px] px-2 ">
        {groupData.map((item, i) => {
          return (
            <div key={item?.url || uuid()}>
              <div
                className="flex  mb-3 justify-between items-center"
                key={item?.url || uuid()}
              >
                <div className="flex items-center gap-4">
                  <picture>
                    <img
                      src={item.groupImage}
                      // src={profileImg}
                      alt={item.groupImage}
                      className="w-16 rounded-full"
                    />
                  </picture>
                  <div className="flex flex-col ">
                    <h3 className="text-lg font-semibold font-poppins ">
                      {item?.groupName}
                    </h3>
                    <p className="text-sm text-[#4D4D4D]/75 font-medium font-poppins ">
                      {item?.groupTagName}
                    </p>
                  </div>
                </div>
                <div>
                  {groupReqData?.find((data) => data?.id === item?.id) ? (
                    <button
                      className="bg-cs-purple px-5 py-2 rounded-xl text-white  font-semibold font-poppins "
                      onClick={() => debounce(cancleJoinReq(item), 2000)}
                    >
                      cancle
                    </button>
                  ) : (
                    <button
                      className="bg-cs-purple px-5 py-2 rounded-xl text-white  font-semibold font-poppins "
                      onClick={() => debounce(joinTheGroup(item), 2000)}
                    >
                      join
                    </button>
                  )}
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

export default Group;
