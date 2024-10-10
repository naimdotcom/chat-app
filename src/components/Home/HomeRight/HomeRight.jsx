import React from "react";
import Search from "../HomeComeponents/Search";
import MyGroup from "../HomeComeponents/MyGroupList/MyGroup.jsx";
import UserList from "../HomeComeponents/UserList/index.jsx";
import FriendReq from "../HomeComeponents/FriendReq/FriendReq.jsx";
import Friend from "../HomeComeponents/Friend/Friend.jsx";
import Block from "../HomeComeponents/Block/index.jsx";
import Group from "../HomeComeponents/GroupList/Group.jsx";

function HomeRight() {
  return (
    <div className="grid grid-cols-3 gap-6 w-full">
      <div>
        <Search />
        <div className="grid grid-rows-2 gap-2 h-full">
          {/* <Group /> */}
          <UserList />
          <FriendReq />
        </div>
      </div>
      <div className="grid grid-rows-2  gap-2 ">
        <Friend />
        <Block />
      </div>
      <div className="grid grid-rows-2  gap-2 ">
        <MyGroup />
        <Group />
      </div>
    </div>
  );
}

export default HomeRight;
