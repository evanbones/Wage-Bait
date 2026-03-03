import React from "react";
import ActionButton from "../ActionButton/ActionButton.jsx";

const ButtonContainer = () => {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <ActionButton
        className="btn-login"
        onClick={() => (window.location.href = "/login")}
      >
        Login
      </ActionButton>
      <ActionButton
        className="btn-register"
        onClick={() => (window.location.href = "/register")}
      >
        Sign Up
      </ActionButton>
    </div>
  );
};

export default ButtonContainer;