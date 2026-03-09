import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./components/Header/Header";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8000/api/search?q=${query}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <>
    <Header />
    <div className="search-results-page" style={{ padding: '20px' }}>
      <h2>Search Results for: "{query}"</h2>

      {loading ? (
        <p>Loading results...</p>
      ) : results.length === 0 ? (
        <p style={{ color: "red" }}>No results found.</p>
      ) : (
        <ul className="results-list">
          {results.map((item, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <strong>{item.title}</strong> - {item.company} (${item.salary})
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}

export default SearchResults;