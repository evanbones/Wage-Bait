import React from "react";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";

const LogoPhoto = () => {
  return (
    <Link to="/">
      <img className="w-[65px] h-[60px] mr-5" src={logo} alt="Wage-Bait Logo" />
    </Link>
  );
};
export default LogoPhoto;
