import React, { useState } from "react";

function SearchBar() {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", query);
    // Logic for loading a new page will go here
    alert(`Navigating to results for: ${query}`);
  };

  return (
    <div style={{ marginTop: '20px', padding: '10px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="Search jobs..." 
          value={query}
          onChange={e => setQuery(e.target.value)} 
          style={{ padding: '8px', fontSize: '16px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}>
          Search
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
