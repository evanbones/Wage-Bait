import React, { useState } from "react";
import { Search } from "lucide-react";
import "./SearchBar.css";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [isExpanded, setExpanded] = useState(false);

  const toggleSearchBar = () => {
    setExpanded(!isExpanded);
    if (isExpanded) {
      setQuery("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Navigating to results for: ${query}`);
  };

  return (
    <div className={`search-bar ${isExpanded ? "expanded" : ""}`}>
      <form onSubmit={handleSubmit} className="search-form">
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
