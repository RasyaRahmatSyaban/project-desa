import React from "react";

export default function CardTemlpate({ children }) {
  return (
    <div
      className="shadow-lg p-6 bg-white rounded-lg w-[20rem] h-[22rem] 
        flex justify-center items-center text-center
        transition-all duration-300 ease-in-out transform 
        hover:shadow-xl hover:-translate-y-2 hover:scale-105"
      style={{ fontFamily: "poppins" }}
    >
      {children}
    </div>
  );
}
