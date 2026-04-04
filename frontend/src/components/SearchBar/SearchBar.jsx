import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative group">
        <input
          type="text"
          placeholder="Search jobs by title, company, or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-brand-background/50 border border-brand-secondary/20 rounded-2xl py-3 pl-5 pr-12 text-brand-primary placeholder:text-brand-secondary/60 focus:bg-brand-surface focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent transition-all outline-none"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-brand-primary text-brand-surface p-2 rounded-xl hover:bg-brand-secondary transition-all transform group-focus-within:scale-105"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
