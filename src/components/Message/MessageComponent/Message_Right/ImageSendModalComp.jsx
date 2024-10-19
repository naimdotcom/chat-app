import React, { useState } from "react";
import {
  getStorage,
  ref as fbStorageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { InfoToast, SuccesfullToast } from "../../../../Utils/toast";
import { pushUrls } from "../../../../features/messageImagesUrl/messageImagesUrlSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "firebase/auth";

function ImageSendModalComp({ closeModalForCamera }) {
  const auth = getAuth();
  const storage = getStorage();
  const [inputFiles, setInputFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [urls, setUrls] = useState([]);
  const [uploading, setUploading] = useState(true);
  const [progress, setProgress] = useState(null);
  const messageUrls = useSelector((state) => state.messageImagesUrl.urls);
  const dispatch = useDispatch();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setFiles((prevFiles) => prevFiles.concat(fileArray));
      // Free up memory for old object URLs
      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
    }
    console.log("====================================");
    console.log(e.target.files);
    console.log("====================================");
    setInputFiles(e.target.files);
  };
  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Uploads files to storage and updates the state with the download URLs.
   */
  /******  8e8a30d1-22be-4820-a7d6-36be52dc4870  *******/
  const uploadFiles = (files) => {
    setUploading(true);
    let completedUploads = 0;

    Array.from(files).forEach((file) => {
      const fileName = file.name.match(/(.+?)(\.[^.]*$|$)/)[1]; // Extracts file name without extension
      const fileExtension = file.name.match(/\.([^.]+)$/)?.[1];
      const storageRef = fbStorageRef(
        storage,
        `message_image/${fileName}_${auth.currentUser.uid}.${fileExtension}`
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle progress here
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          console.error("Upload failed", error);
        },
        () => {
          // Get the download URL once the upload is complete
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUrls((prevUrls) => [...prevUrls, downloadURL]); // Add download URL to state
            dispatch(pushUrls(downloadURL));
            console.log("====================================");
            console.log(messageUrls);
            console.log("====================================");
            // Track uploads and close modal when all uploads complete
            completedUploads += 1;
            if (completedUploads === files.length) {
              setUploading(false);
              SuccesfullToast("Images uploaded successfully 😊", "top-center");

              // Reset state after uploading
              setUrls([]);
              setInputFiles([]);
              setFiles([]);
              setProgress(0);

              closeModalForCamera();
            }
          });
        }
      );
    });
  };

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {files.length > 0 ? (
          files.map((file) => (
            <picture key={file} className="">
              <img
                src={file}
                alt={`Preview ${file}`}
                className="w-24 h-auto object-cover rounded-sm"
              />
            </picture>
          ))
        ) : (
          <p>No images selected</p>
        )}
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Large file input
        </label>
        <input
          className="block w-full text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="large_size"
          type="file"
          multiple
          onChange={handleFileChange}
        />
      </div>

      <button
        onClick={() => uploadFiles(inputFiles)}
        className="py-2 px-4 w-full mt-4 bg-cs-purple text-white rounded-lg"
      >
        send
      </button>

      {uploading && (
        <p className="text-center">Uploading {Math.round(progress)}%</p>
      )}
    </div>
  );
}

export default ImageSendModalComp;
