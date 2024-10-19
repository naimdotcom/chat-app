import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  decrement,
  increment,
  multiply,
  division,
} from "../../features/counter/counteSlice";

function Notification() {
  const [userInput, setUserInput] = useState(0);
  const count = useSelector((state) => state.counter.value);

  const dispatch = useDispatch();
  return (
    <div className="w-full grid items-center">
      <div className="flex flex-col items-center space-y-4 p-6">
        {/* Output */}
        <div className="w-80 h-16 bg-gray-100 flex items-center justify-center text-xl rounded-lg shadow-md">
          {count}
        </div>

        {/* Input */}
        <input
          type="number"
          className="w-80 h-16 bg-gray-100 px-4 text-lg rounded-lg shadow-md"
          placeholder="Enter value"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />

        {/* Functions */}
        <div className="grid grid-cols-4 gap-4">
          <button
            className="w-16 h-16 bg-blue-500 text-white text-2xl rounded-lg shadow-md"
            onClick={() => dispatch(increment(Number(userInput)))}
          >
            +
          </button>
          <button
            className="w-16 h-16 bg-green-500 text-white text-2xl rounded-lg shadow-md"
            onClick={() => dispatch(decrement(Number(userInput)))}
          >
            -
          </button>
          <button
            className="w-16 h-16 bg-yellow-500 text-white text-2xl rounded-lg shadow-md"
            onClick={() => dispatch(multiply(Number(userInput)))}
          >
            *
          </button>
          <button
            className="w-16 h-16 bg-red-500 text-white text-2xl rounded-lg shadow-md"
            onClick={() => dispatch(division(Number(userInput)))}
          >
            /
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notification;
