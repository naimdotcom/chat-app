import React, { useEffect, useState } from "react";
import profileImage from "../../../../assets/ProfilePic/Asset 5.webp";
import { v4 as uuid } from "uuid";
import { getAuth } from "firebase/auth";
import { child, get, getDatabase, ref } from "firebase/database";
import {
  getFirestore,
  query as fireQuery,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";
function JoinedGroup() {
  // state's

  const [GroupData, setGroupDatas] = useState([]);

  // firebase config
  const auth = getAuth();
  const uid = auth?.currentUser?.uid;
  const db = getDatabase();
  const fireDB = getFirestore();

  useEffect(() => {
    const groupDbRef = fireQuery(
      collection(fireDB, "groups"),
      where("groupMembersUID", "array-contains", uid)
    );
    const fetchGroupData = () => {
      onSnapshot(groupDbRef, (snapshot) => {
        const groupEmptyData = [];
        snapshot.forEach((doc) => {
          groupEmptyData.push({ id: doc.id, ...doc.data() });
        });

        setGroupDatas(groupEmptyData);
      });
    };

    fetchGroupData();

    // onSnapshot(groupDbRef, (snapshot) => {
    //   const unsubscribe = onSnapshot(groupDbRef, async (snapshot) => {
    //     const groupEmptyData = [];

    //     for (const doc of snapshot.docs) {
    //       const groupMembersUID = doc.data().groupMembersUID;

    //       // Fetch group members' data using Promise.all
    //       const groupMembers = await Promise.all(
    //         groupMembersUID.map(async (item) => {
    //           const userRef = ref(db, `users/${item}`);
    //           try {
    //             const userSnapshot = await get(userRef);

    //             return userSnapshot.val(); // Return user data
    //           } catch (err) {
    //             console.log(err);
    //             return null; // Handle errors and return null or fallback value
    //           }
    //         })
    //       );

    //       const groupDataObj = {
    //         id: doc.id,
    //         ...doc.data(),
    //         groupMembers: groupMembers.filter((member) => member !== null), // Filter out failed fetches
    //       };

    //       groupEmptyData.push(groupDataObj);
    //     }

    //     setGroupDatas(groupEmptyData);
    //   });

    //   // Clean up the listener on component unmount
    //   return () => unsubscribe();
    // });
  }, [uid]);

  return (
    <div className="">
      <div className="shadow-lg py-4 px-5 rounded-lg w-full min-w-[477px] scrollbar-thumb-cs-purple/80 scrollbar-track-cs-purple/40 scrollbar-thumb-r font-poppins h-full min-h-[418px]">
        <div className="flex justify-between mb-4">
          <p className="text-xl font-semibold ">Group</p>
          <div>
            <button className="text-sm bg-cs-purple text-white  px-3 py-1 rounded-xl font-semibold font-poppins ">
              Create Group
            </button>
          </div>
        </div>

        <div className="overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-thin max-h-[312px] px-2 ">
          {GroupData.map((item, i) => {
            return (
              <div key={item?.url || uuid()}>
                <div
                  className="flex  mb-3 justify-between items-center"
                  key={item?.url || uuid()}
                >
                  <div className="flex items-center gap-4">
                    <picture>
                      <img
                        src={item?.groupImage || profileImage}
                        // src={profileImg}
                        alt={item?.groupImage || profileImage}
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
                    <button className="bg-cs-purple px-5 py-2 rounded-xl text-white  font-semibold font-poppins ">
                      join
                    </button>
                  </div>
                </div>
                <hr className="mb-2" key={item?.url || uuid()} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default JoinedGroup;
