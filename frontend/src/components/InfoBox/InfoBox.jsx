import React from "react";

export const InfoBox = ({ label, type = "text", value, onChange }) => {
  return (
    <div className="flex flex-col items-start">
      <label className="text-base font-medium pb-1.5 font-sans">{label}</label>
      <input
        type={type}
        className="w-[270px] px-4 py-1.5 border border-brand-primary rounded-full text-base font-medium focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all font-sans"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
