import React from "react";
import Search from "../../Home/HomeComeponents/Search";
import JoinedGroup from "../MessageComponent/MessageLeft/JoinedGroup";
import Friend from "../../Home/HomeComeponents/Friend/Friend";
function MessageLeft() {
  return (
    <div className="">
      <div className="flex flex-col">
        <Search />
        <div className="">
          <JoinedGroup />
        </div>
        <div className="">
          <Friend friendCompo={true} />
        </div>
      </div>
    </div>
  );
}

export default MessageLeft;
