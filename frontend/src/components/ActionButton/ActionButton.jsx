import React from "react";

const ActionButton = ({ children, onClick, disabled, type = 'button', className = '', variant = 'outline' }) => {
  const baseStyles = "px-6 py-2 rounded-full font-sans font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    outline: "bg-brand-surface text-brand-primary border border-brand-primary hover:bg-gray-100",
    primary: "bg-brand-primary text-brand-surface border border-brand-primary hover:bg-brand-secondary hover:border-brand-secondary",
    accent: "bg-brand-accent text-brand-primary border border-brand-accent hover:bg-opacity-80",
  };

  const variantClass = variants[variant] || variants.outline;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantClass} ${className}`} 
    >
      {children}
    </button>
  );
};

export default ActionButton;