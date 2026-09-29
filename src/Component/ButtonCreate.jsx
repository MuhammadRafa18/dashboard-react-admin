import React from "react";

export const ButtonCreate = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 bg-[#4F46E5] text-white py-2.5 px-5 rounded-md cursor-pointer relative overflow-x-auto"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>{text}
    </button>
  );
};
