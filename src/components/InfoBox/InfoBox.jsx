import React from "react";
import "./InfoBox.css";

export const InfoBox = ({ label, type = "text", value, onChange }) => {
  return (
    <div className="info-box">
      <label className="info-label">{label}</label>
      <br />
      <input type={type} className="field-input" value={value} onChange={onChange}/>
    </div>
  );
};
