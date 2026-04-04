import React from "react";
import SearchBar from "../SearchBar/SearchBar.jsx";
import ButtonContainer from "../ButtonContainer/ButtonContainer.jsx";
import LogoPhoto from "../LogoPhoto/LogoPhoto.jsx";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-brand-surface/80 backdrop-blur-md border-b border-brand-secondary/10 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoPhoto />
            <h1 className="text-2xl font-serif font-bold tracking-tight text-brand-primary">
              Wage <span className="text-brand-accent">Bait</span>
            </h1>
          </div>
          
          <div className="flex-1 max-w-xl w-full">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            <ButtonContainer />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
