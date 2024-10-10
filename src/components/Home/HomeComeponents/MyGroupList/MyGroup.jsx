import React, { useEffect, useState, createRef } from "react";
import profileImg from "../../../../assets/ProfilePic/Asset 5.webp";
import ModalComponent from "../modalComponent/ModalComponent";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import defaultImage from "../../../../assets/Login/img here.png";
import { getAuth } from "firebase/auth";
import { getDatabase, onValue, push, query, ref, set } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  addDoc,
  onSnapshot,
  query as fireQuery,
  where,
} from "firebase/firestore";

import {
  getStorage,
  ref as ourStroageRef,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { SuccesfullToast } from "../../../../Utils/toast";
import { GetTimeNow } from "../../../../Utils/moment";
import appDB from "../../../../FirebaseConfig/FireBaseDBConnection";
import { BiLogoBlogger } from "react-icons/bi";
import GroupRequestModal from "../ComponentsForHome/GroupRequestModal/GroupRequestModal";

function MyGroup() {
  const auth = getAuth();
  const db = getDatabase();
  const fireDB = getFirestore(appDB);
  const storage = getStorage();
  const [imgs, setImgs] = useState([]);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenForReq, setIsOpenForReq] = useState(false);
  const defaultSrc =
    "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";
  const [image, setImage] = useState(defaultImage);
  const [cropData, setCropData] = useState("");
  const [group, setGroup] = useState([]);
  const [groupData, setGroupData] = useState({
    groupName: "",
    groupTagName: "",
    description: "",
  });
  const [requiredData, setRequiredData] = useState({
    groupName: "",
    groupTagName: "",
    description: "",
    groupImage: "",
  });
  const cropperRef = createRef();
  const onChange = (e) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      setCropData(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());
    }
  };

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  function openModalForReq() {
    setIsOpenForReq(true);
  }

  function closeModalForReq() {
    setIsOpenForReq(false);
  }

  /*************  ✨ Codeium Command 🌟  *************/
  const handleStateChange = (e) => {
    setGroupData({ ...groupData, [e.target.id]: e.target.value });
  };
  /******  906175dd-bc26-429b-ac13-dadb8d14ee4f  *******/

  const handleSubmit = async () => {
    let errors = {};

    if (!groupData.groupName.trim()) {
      errors.groupName = "Group Name is required";
    }

    if (!groupData.groupTagName.trim()) {
      errors.groupTagName = "Group Tag Name is required";
    }

    if (!groupData.description.trim()) {
      errors.description = "Description is required";
    }

    // You can add advanced image validation here (optional)
    if (!cropData || cropData.trim() === "") {
      errors.groupImage = "Group Image is required";
    }

    if (Object.keys(errors).length > 0) {
      setRequiredData(errors);
      return false;
    } else {
      setRequiredData({
        ...requiredData,
        groupName: "",
        groupTagName: "",
        description: "",
      });

      const storageRef = ourStroageRef(storage, `groupImage_${uuidv4()}`);

      uploadString(storageRef, cropData, "data_url")
        .then((snapshot) => {
          SuccesfullToast("Group Created Successfully");
          return snapshot.metadata.fullPath;
        })
        .then((url) => {
          return getDownloadURL(ourStroageRef(storage, url));
        })
        .then(async (url) => {
          await addDoc(collection(fireDB, "groups"), {
            groupName: groupData.groupName,
            groupTagName: groupData.groupTagName,
            description: groupData.description,
            groupImage: url,
            createdAt: GetTimeNow(),
            groupMembers: [
              {
                uid: auth.currentUser.uid,
                invitedBy: auth.currentUser.uid,
                joinedAt: GetTimeNow(),
              },
            ],
            groupMembersUID: [auth.currentUser.uid],
            creator: auth.currentUser.uid,
          });
        })
        .catch((err) => {
          console.log("error in creating image", err);
        })
        .finally(() => {
          setGroupData({
            groupName: "",
            groupTagName: "",
            description: "",
            groupImage: "",
          });
          closeModal();
        });
    }
  };

  useEffect(() => {
    const groupRef = collection(fireDB, "groups");
    const q = fireQuery(
      groupRef,
      where("groupMembersUID", "array-contains", auth.currentUser.uid)
    );

    const unsubscribe = () =>
      onSnapshot(q, (snapshot) => {
        const groupsEmpty = [];
        snapshot.forEach((doc) => {
          const groupData = doc.data();
          groupsEmpty.push({ id: doc.id, ...groupData });
        });
        setGroup(groupsEmpty);
      });
    unsubscribe();

    // console.log(group);

    // onValue(groupRef, (snapshot) => {
    //   const groupsEmpty = [];
    //   snapshot.forEach((childSnapshot) => {
    //     const groupData = childSnapshot.val();
    //     // Check if current user is in the groupMembers
    //     const isMember = groupData.groupMembers.some(
    //       (member) => member.uid === auth.currentUser.uid
    //     );

    //     if (isMember) {
    //       groupsEmpty.push({ id: childSnapshot.key, ...groupData });
    //     }
    //   });
    //   setGroup(groupsEmpty);
    // });
  }, []);

  return (
    <div className="shadow-lg py-4 px-5 rounded-lg w-full min-w-[477px] scrollbar-thumb-cs-purple/80 scrollbar-track-cs-purple/40 scrollbar-thumb-r font-poppins ">
      <div className="flex justify-between mb-4">
        <p className="text-xl font-semibold ">My Group</p>
        <div>
          <button
            onClick={openModal}
            className="text-sm bg-cs-purple text-white  px-3 py-1 rounded-xl font-semibold font-poppins "
          >
            Create Group
          </button>
        </div>
      </div>
      <div className="overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-thin max-h-[312px] px-2 ">
        {group.length === 0 ? (
          <p className="text-lg font-semibold font-poppins " key={uuidv4()}>
            join or create a group
          </p>
        ) : (
          group.map((item, i) => {
            return (
              <div key={item?.url || uuidv4()}>
                <div
                  className="flex mb-3 justify-between items-center"
                  key={item?.url || uuidv4()}
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
                        {item.groupName}
                      </h3>
                      <p className="text-sm text-[#4D4D4D]/75 font-medium font-poppins ">
                        {item.groupTagName}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      className="bg-cs-purple px-5 py-2 rounded-xl text-white text-md font-semibold font-poppins "
                      onClick={() => {
                        setIsOpenForReq(true);
                      }}
                    >
                      Requests
                    </button>
                  </div>
                </div>
                {group.length > 1 && (
                  <hr className="mb-2" key={item?.url || uuidv4()} />
                )}

                <ModalComponent
                  openModal={openModalForReq}
                  closeModal={closeModalForReq}
                  modalIsOpen={modalIsOpenForReq}
                  key={item?.url || uuidv4()}
                  classname={" w-[40vw] max-h-[90vh] "}
                  appElement={document.getElementById("root")}
                >
                  <GroupRequestModal groupID={item?.id} />
                </ModalComponent>
              </div>
            );
          })
        )}
      </div>

      <div className="">
        <ModalComponent
          openModal={openModal}
          closeModal={closeModal}
          modalIsOpen={modalIsOpen}
          classname={" w-[90vw] max-h-[90vh] "}
          appElement={document.getElementById("root")}
        >
          <h3 className="text-lg font-semibold text-cs-deepBlue mb-6">
            Create a Group
          </h3>
          <form
            action=""
            className="flex flex-col gap-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-medium text-sm text-cs-blue/55"
              >
                Groupname
              </label>
              <input
                className="py-3 focus-within:outline-none border-b-[1px] border-cs-gray/20 px-1 font-semibold text-xl text-cs-blue placeholder:text-cs-blue/50 w-[90vw]"
                type="text"
                id="groupName"
                placeholder="Groupname"
                onChange={handleStateChange}
                autoComplete="Groupname"
                value={groupData.groupName}
              />
              {requiredData.groupName && (
                <p className="text-red-500">{requiredData.groupName}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="font-medium text-sm text-cs-blue/55"
              >
                Group Tag Name
              </label>
              <input
                className="py-3 focus-within:outline-none border-b-[1px] border-cs-gray/20 w-[90vw] px-1 font-semibold text-xl text-cs-blue placeholder:text-cs-blue/50"
                type="text"
                id="groupTagName"
                onChange={handleStateChange}
                placeholder="tags"
                autoComplete="Groupname"
                value={groupData.groupTagName}
              />
              {requiredData.groupTagName && (
                <p className="text-red-500">{requiredData.groupTagName}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="text"
                className="font-medium text-sm text-cs-blue/55"
              >
                Description
              </label>
              <input
                className="py-3 focus-within:outline-none border-b-[1px] border-cs-gray/20 w-[90vw] px-1 font-semibold text-xl text-cs-blue placeholder:text-cs-blue/50"
                type="text"
                value={groupData.description}
                id="description"
                placeholder="description"
                autoComplete="Groupname"
                onChange={handleStateChange}
              />
              {requiredData.description && (
                <p className="text-red-500">{requiredData.description}</p>
              )}
            </div>

            {/*react cropper */}

            <div>
              <div className="w-[30%] my-10">
                <input type="file" onChange={onChange} />
              </div>
              <div className="flex justify-between relative ">
                <div className="w-[30%] ">
                  <Cropper
                    ref={cropperRef}
                    style={{ height: 365, width: "100%" }}
                    zoomTo={0.5}
                    initialAspectRatio={1}
                    preview=".img-preview"
                    src={image}
                    viewMode={1}
                    minCropBoxHeight={10}
                    minCropBoxWidth={10}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                    guides={true}
                  />
                </div>
                <div className="w-[30%] ">
                  <h1 className="bg-green-500 absolute left-[36%] px-10 py-2  text-white -top-[50px]">
                    Preview
                  </h1>
                  <div className="box  bg-blue-500 h-[365px] overflow-hidden">
                    <div className="img-preview w-[100%] h-[365px]" />
                  </div>
                </div>
                <div className="w-[30%] ">
                  <button
                    className="w-40 h-10 absolute left-[62%] bg-red-500 -top-[60px]"
                    onClick={getCropData}
                  >
                    Crop Image
                  </button>
                  <div className="box bg-red-500 h-[365px]">
                    <img
                      className="w-full h-[365px]"
                      src={cropData}
                      alt="cropped"
                    />
                  </div>
                </div>
              </div>
              {requiredData.groupImage && (
                <p className="text-red-500">{requiredData.groupImage}</p>
              )}
            </div>

            {/* react cropper */}

            <button
              className="w-full mb-8 rounded-md h-10 bg-cs-purple active:bg-cs-purple/80 text-white"
              onClick={handleSubmit}
            >
              Create Group
            </button>
          </form>
        </ModalComponent>
      </div>
    </div>
  );
}

export default MyGroup;
