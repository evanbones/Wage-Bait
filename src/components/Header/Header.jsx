import React from "react";
import "./Header.css";
import SearchBar from "../SearchBar/SearchBar.jsx";
import ButtonContainer from "../ButtonContainer/ButtonContainer.jsx";
import Logo from "../Logo/Logo.jsx";
import LogoPhoto from "../LogoPhoto/LogoPhoto.jsx";

function Header() {
  return (
    <header className="navbar">
      <div className="container">
        <div className="logo">
          <LogoPhoto />
          <Logo text="Wage Bait" />
        </div>
        
        <div className="search">
          <SearchBar />
        </div>

        <div className="action-buttons">
          <ButtonContainer />
        </div>
      </div>
    </header>
  );
}

export default Header;
