import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

   navigate(`/search?q=${encodeURIComponent(query)}`);

   setQuery("");
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button" aria-label="Search">
          <Search size={20} />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
