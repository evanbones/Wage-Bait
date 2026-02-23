import React from "react";
import { Button } from "./Button";
import "./styles/Header.css";

export const Header = () => {
  return (
    <header className="navbar">
      <div className="container">
        <div className="logo">
          Wage Bait
        </div>
        <div className="search">
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