import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinGameInputField() {
  const navigate = useNavigate();

  const [code, setCode] = useState(["", "", "", "", ""]);

  const handleInputChange = (value, index) => {
    if (value.length > 1) return; // Prevent typing more than one character in a box
    const newCode = [...code];
    newCode[index] = value
    setCode(newCode);

    if (value && index < 4) {
      document.getElementById(`box-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      document.getElementById(`box-${index - 1}`).focus();
    }
  };

  const handleJoin = () => {
    const finalCode = code.join("");
    if (finalCode.length === 5) {
      console.log("Joining game with code:", finalCode);
        navigate(`/game/${finalCode}`);
        
    } else {
      alert("Please enter a 5-letter code.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <label
          htmlFor="join-code"
          className="block text-sm font-medium text-gray-700 mb-4 text-center"
        >
          Enter 5-Letter Lobby Code
        </label>
        <div className="flex space-x-2">
          {code.map((char, index) => (
            <input
              key={index}
              id={`box-${index}`}
              type="text"
              maxLength={1}
              value={char}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 border border-gray-300 rounded-md text-center text-xl font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          ))}
        </div>
        <button
          onClick={handleJoin}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Join Game
        </button>
      </div>
    </div>
  );
}
