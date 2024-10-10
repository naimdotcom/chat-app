import React from "react";

function MessageBox({ author = true }) {
  return (
    <div className="flex flex-col gap-y-8">
      <div
        className={` w-[30%] flex flex-col ${
          author ? "self-end" : "self-start"
        }`}
      >
        <div
          className={`  w-full py-5 text-center rounded-xl ${
            author ? " box_Right  bg-cs-purple" : " box_left bg-[#F1F1F1]"
          }`}
        >
          <h3
            className={`font-poppins font-medium text-[16px] leading-[24px]  z-30 ${
              author ? "text-white" : "text-black"
            }`}
          >
            Hey There !
          </h3>
        </div>
        <div className={`${author ? "self-end" : "self-start"}`}>
          <p
            className={`font-poppins font-medium text-[12px] leading-[18px] text-black/25 w-full ml-auto `}
          >
            Today, 2:01pm
          </p>
        </div>
      </div>
    </div>
  );
}

export default MessageBox;

/**
 * 
 * 

position: absolute;
width: 409px;
height: 50px;
left: 794px;
top: 659px;

background: #F1F1F1;
border-radius: 10px;

polygon(10% 0%, 100% 0%, 100% 85%, 80% 85%, 80% 100%, 10% 85%, 0% 85%, 0% 0%


position: absolute;
width: 67.76px;
height: 28px;
left: 769px;
top: 688px;

background: #F1F1F1;
border-radius: 2px;

 */
