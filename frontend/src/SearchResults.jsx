import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "./components/Header/Header";
import JobDetails from "./components/JobDetails/JobDetails";
import "./SearchResults.css";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoriesParam = searchParams.get("categories") || "";
  const minSalaryParam = searchParams.get("minSalary") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [minSalary, setMinSalary] = useState(minSalaryParam);
  const [selectedCategories, setSelectedCategories] = useState(
    categoriesParam ? categoriesParam.split(",") : []
  );

  const categoriesList = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Hospitality",
    "Retail",
    "Other"
  ];

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.append("q", query);
        if (categoriesParam) params.append("categories", categoriesParam);
        if (minSalaryParam) params.append("minSalary", minSalaryParam);

        const response = await fetch(`http://localhost:8000/api/search?${params.toString()}`);
        const data = await response.json();
        setResults(data);
        if (data.length > 0) {
          setSelectedJobId(data[0]._id);
        } else {
          setSelectedJobId(null);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, categoriesParam, minSalaryParam]);

  const handleCategoryChange = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updated);
    updateURL(updated, minSalary);
  };

  const handleSalaryChange = (value) => {
    setMinSalary(value);
    updateURL(selectedCategories, value);
  };

  const updateURL = (categories, salary) => {
    const params = new URLSearchParams(searchParams);
    if (categories.length > 0) {
      params.set("categories", categories.join(","));
    } else {
      params.delete("categories");
    }
    
    if (salary) {
      params.set("minSalary", salary);
    } else {
      params.delete("minSalary");
    }
    
    setSearchParams(params);
  };

  return (
    <div className="search-results-wrapper">
      <Header />
      <div className="search-toolbar">
        <button 
          className={`toolbar-filter-btn ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
        <div className="results-count">
          {results.length} jobs found
        </div>
      </div>

      <div className="search-container">
        {showFilters && (
          <aside className="search-filters-sidebar">
            <div className="filter-group">
              <label>Min Salary ($)</label>
              <input
                type="number"
                value={minSalary}
                onChange={(e) => handleSalaryChange(e.target.value)}
                placeholder="e.g. 50000"
              />
            </div>
            <div className="filter-group">
              <label>Categories</label>
              <div className="category-checkboxes">
                {categoriesList.map((cat) => (
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

        <div className="results-sidebar">
          {loading ? (
            <p className="padding-20">Loading...</p>
          ) : results.length === 0 ? (
            <p className="no-results">No jobs found matching your criteria.</p>
          ) : (
            <div className="sidebar-list">
              {results.map((job) => (
                <div 
                  key={job._id} 
                  className={`sidebar-item ${selectedJobId === job._id ? 'active' : ''}`}
                  onClick={() => setSelectedJobId(job._id)}
                >
                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
                  <p className="sidebar-category">{job.category}</p>
                  <p className="sidebar-salary">${job.salary.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="details-view">
          {selectedJobId ? (
            <JobDetails jobId={selectedJobId} />
          ) : (
            <div className="no-selection">
              <p>Select a job to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
