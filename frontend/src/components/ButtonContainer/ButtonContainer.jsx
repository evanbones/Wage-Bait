import React from "react";
import ActionButton from "../ActionButton/ActionButton.jsx";
import { Link, useNavigate } from "react-router-dom";

const ButtonContainer = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      {user ? (
        <>
          <Link to="/profile">
            <ActionButton className="btn-login">Profile</ActionButton>
          </Link>
          <ActionButton className="btn-register" onClick={handleLogout}>Logout</ActionButton>
        </>
      ) : (
        <>
          <Link to="/login">
            <ActionButton className="btn-login">Login</ActionButton>
          </Link>
          <Link to="/register">
            <ActionButton className="btn-register">Sign Up</ActionButton>
          </Link>
        </>
      )}
    </div>
  );
};

export default ButtonContainer;
