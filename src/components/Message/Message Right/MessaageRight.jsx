import React, { useState } from "react";
import Profile from "../MessageComponent/Message_Right/Profile";
import MessageSection from "../MessageComponent/Message_Right/MessageSection";
import MessageBox from "../MessageComponent/Message_Right/MessageBox";

function MessaageRight() {
  return (
    <div>
      <Profile />
      <div
        className="flex flex-col px-4 py-4  
      scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar scrollbar-thumb-cs-deepBlue scrollbar-track-slate-300 overflow-y-scroll max-h-[665px] "
      >
        <MessageBox author={true} />
        <MessageBox author={false} />
        <MessageBox author={false} />
        <MessageBox author={false} />
        <MessageBox author={false} />
        <MessageBox author={false} />
        <MessageBox author={false} />
        <MessageBox author={true} />
        <MessageBox author={false} />
        <MessageBox author={false} />
        <MessageBox author={false} />
        <MessageBox author={false} />
      </div>
      <MessageSection />
    </div>
  );
}

export default MessaageRight;
