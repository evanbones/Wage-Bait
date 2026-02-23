import React, { useState } from "react";
import { Button } from "./Button";

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic for loading a new page will go here
    alert(`Navigating to results for: ${query}`);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "8px", justifyContent: "center" }}
      >
        <input
          type="text"
          placeholder="Search jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          className="btn-primary"
          type="submit"
          onClick={() => (window.location.href = "/submit")}
        >
          Search
        </Button>
      </form>
    </div>
  );
}

export default SearchBar;
