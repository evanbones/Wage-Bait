import React from "react";
import ActionButton from "../ActionButton/ActionButton.jsx";
import {Link } from "react-router-dom";

const ButtonContainer = () => {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Link to="/login">
        <ActionButton className="btn-login">Login</ActionButton>
      </Link>
      <Link to="/register">
        <ActionButton className="btn-register">Sign Up</ActionButton>
      </Link>
    </div>
  );
};

export default ButtonContainer;
