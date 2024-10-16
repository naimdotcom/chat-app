import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../../features/counter/counteSlice";

export default configureStore({
  reducer: {
    counter: counterReducer,
  },
});
