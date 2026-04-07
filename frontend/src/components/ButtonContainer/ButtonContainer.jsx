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
    <div className="flex items-center gap-3">
      {user ? (
        <>
          {user.role === 'admin' && (
            <Link to="/admin-dashboard">
              <ActionButton variant="accent">Admin Dashboard</ActionButton>
            </Link>
          )}
          <Link to="/profile">
            <ActionButton variant="outline">Profile</ActionButton>
          </Link>
          <ActionButton variant="primary" onClick={handleLogout}>Logout</ActionButton>
        </>
      ) : (
        <>
          <Link to="/login">
            <ActionButton variant="outline">Login</ActionButton>
          </Link>
          <Link to="/register">
            <ActionButton variant="primary">Sign Up</ActionButton>
          </Link>
        </>
      )}
    </div>
  );
};

export default ButtonContainer;
