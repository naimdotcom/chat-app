import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../features/counter/counteSlice";
import messageImagesUrlReducer from "../../features/messageImagesUrl/messageImagesUrlSlice";
export default configureStore({
  reducer: {
    counter: counterReducer,
    messageImagesUrl: messageImagesUrlReducer,
  },
});
