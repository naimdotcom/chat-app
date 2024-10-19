import { createSlice } from "@reduxjs/toolkit";

export const messageImagesUrlSlice = createSlice({
  name: "messageImagesUrl",
  initialState: {
    urls: [],
  },
  reducers: {
    pushUrls: (state, action) => {
      state.urls.push(action.payload);
    },
  },
});

// Action creators are generated for each case reducer function
export const { pushUrls } = messageImagesUrlSlice.actions;

export default messageImagesUrlSlice.reducer;
