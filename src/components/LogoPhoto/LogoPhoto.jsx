import React from "react";
import logo from "../../assets/images/logo.png";
import "./LogoPhoto.css";
import { Link } from "react-router-dom";

const LogoPhoto = () => {
  return (
    <Link to="/">
      <img className="logo" src={logo} alt="Wage-Bait Logo" />
    </Link>
  );
};
export default LogoPhoto;
