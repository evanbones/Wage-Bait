import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "./Home.css";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minSalary, setMinSalary] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const navigate = useNavigate();

  const categories = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Hospitality",
    "Retail",
    "Other"
  ];

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append("q", searchTerm);
    if (selectedCategories.length > 0) params.append("categories", selectedCategories.join(","));
    if (minSalary) params.append("minSalary", minSalary);
    
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="home-wrapper">
      <Header />
      <div className={`home-main ${showFilters ? "with-sidebar" : ""}`}>
        {showFilters && (
          <aside className="filters-sidebar">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Min Salary ($)</label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
                placeholder="e.g. 50000"
              />
            </div>
            <div className="filter-group">
              <label>Categories</label>
              <div className="category-checkboxes">
                {categories.map((cat) => (
                  <label key={cat} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
          </aside>
        )}

        <section className="hero-section">
          <h1>Find Your Next Great Opportunity</h1>
          <p>Don't just apply. Negotiate the life you deserve.</p>
          
          <form className="hero-search-form" onSubmit={handleSearch}>
            <div className="search-bar-group">
              <input
                type="text"
                placeholder="Job title, company, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="hero-search-btn">Search</button>
            </div>
            <button 
              type="button" 
              className={`filters-toggle-btn ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </form>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
