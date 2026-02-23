import React from "react";
import { Button } from "./Button";
import "./styles/Header.css";
import SearchBar from "./SearchBar";

export const Header = () => {
  return (
    <header className="navbar">
      <div className="container">
        <div className="logo">
          Wage Bait
        </div>
        <div className="search">
            <SearchBar />
        </div>
        <nav className="nav-links">
          <ul>
            <li>
              <Button 
                className="btn-primary" 
                onClick={() => window.location.href = '/login'}
              >
                Login
              </Button>
            </li>
            <li>
              <Button 
                className="btn-primary" 
                onClick={() => window.location.href = '/register'}
              >
                Sign Up
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};