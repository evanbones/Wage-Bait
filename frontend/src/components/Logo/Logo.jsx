import React from "react";
import { Link } from "react-router-dom";
import "./Logo.css";

function Logo({ text }) {
  return (
    <Link to="/" style={{ textDecoration: 'none'}}>
      <span className="logo-text">{text}</span>
    </Link>
  );
}

export default Logo;
