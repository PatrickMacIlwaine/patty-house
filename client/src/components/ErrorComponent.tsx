import React from "react";
import { useNavigate } from "react-router-dom";

export default function ErrorComponent(props: any) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen p-10">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-10 relative flex flex-col space-y-4 items-center">
        <h1 className="text-error text-2xl font-bold">Error: </h1>
        <p>{props.error}</p>
        <button
          onClick={handleClick}
          className="w-full sm:w-64 h-16 sm:h-20 bg-secondary text-base-100 text-lg sm:text-xl font-semibold rounded-lg p-4 hover:bg-secondary-dark transition-all"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
