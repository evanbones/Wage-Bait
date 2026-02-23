import React from "react";
import "./styles/Button.css";

export const Button = ({ children, onClick, disabled, type = 'button', className }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className} 
    >
      {children}
    </button>
  );
};
