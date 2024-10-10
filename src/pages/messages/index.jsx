import React from "react";
import MessageLeft from "../../components/Message/MessageLeft/MessageLeft.jsx";
import MessaageRight from "../../components/Message/Message Right/MessaageRight.jsx";
function Messages() {
  return (
    <div className="w-full grid grid-cols-3 ">
      <div className="">
        <MessageLeft />
      </div>
      <div className="col-span-2 py-6 px-12">
        <MessaageRight />
      </div>
    </div>
  );
}

export default Messages;
