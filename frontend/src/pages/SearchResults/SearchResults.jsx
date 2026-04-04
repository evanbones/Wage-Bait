import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, Search, Briefcase, MapPin, DollarSign, ChevronRight, SlidersHorizontal } from "lucide-react";
import Header from "../../components/Header/Header";
import JobDetails from "../../components/JobDetails/JobDetails";

function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoriesParam = searchParams.get("categories") || "";
  const minSalaryParam = searchParams.get("minSalary") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState(null);
  
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
    <div className="flex flex-col h-screen bg-brand-background overflow-hidden">
      <Header />
      
      {/* sub-header / toolbar */}
      <div className="bg-brand-surface border-b border-brand-secondary/10 px-6 py-3 flex items-center justify-between shadow-sm relative z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              showFilters 
              ? "bg-brand-accent text-brand-surface shadow-md shadow-brand-accent/20" 
              : "hover:bg-brand-background text-brand-secondary"
            }`}
          >
            <SlidersHorizontal size={18} />
            <span>Filters</span>
          </button>
          <div className="h-6 w-px bg-brand-secondary/20 hidden md:block" />
          <p className="text-brand-secondary text-sm font-medium hidden md:block">
            {loading ? "Searching..." : `${results.length} positions found`}
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <span className="text-brand-secondary">Sorted by:</span>
          <span className="font-bold text-brand-primary">Relevance</span>
        </div>
      </div>

      <div className="grow flex overflow-hidden">
        {/* filters sidebar */}
        {showFilters && (
          <aside className="w-80 bg-brand-surface border-r border-brand-secondary/10 overflow-y-auto p-6 animate-in slide-in-from-left duration-300">
            <h3 className="text-xl font-serif mb-6">Filter Results</h3>
            
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-bold text-brand-primary mb-3">Min Salary ($)</label>
                <input
                  type="number"
                  value={minSalary}
                  onChange={(e) => handleSalaryChange(e.target.value)}
                  placeholder="e.g. 60000"
                  className="w-full p-3 bg-brand-background rounded-xl border border-brand-secondary/20 focus:ring-2 focus:ring-brand-accent outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-primary mb-3">Job Categories</label>
                <div className="space-y-2">
                  {categoriesList.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 p-2 rounded-lg hover:bg-brand-background cursor-pointer group transition-colors">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-brand-secondary/30 transition-all checked:bg-brand-primary"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => handleCategoryChange(cat)}
                        />
                        <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 peer-checked:opacity-100">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-brand-secondary group-hover:text-brand-primary transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* results list */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-brand-secondary/10 overflow-y-auto bg-brand-background/50 shrink-0">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-32 bg-brand-surface rounded-2xl animate-pulse shadow-sm" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="mx-auto w-12 h-12 text-brand-secondary/30 mb-4" />
              <p className="text-brand-secondary font-medium">No jobs found matching your criteria.</p>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {results.map((job) => (
                <div 
                  key={job._id} 
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${
                    selectedJobId === job._id 
                    ? "bg-brand-surface border-brand-accent shadow-lg shadow-brand-accent/10" 
                    : "bg-brand-surface/70 border-brand-secondary/5 hover:border-brand-secondary/20 hover:bg-brand-surface"
                  }`}
                  onClick={() => setSelectedJobId(job._id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent">
                        {job.category || 'General'}
                    </span>
                    <span className="text-xs font-bold text-brand-primary">
                        ${job.salary?.toLocaleString()}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg text-brand-primary leading-tight mb-1 group-hover:text-brand-accent">
                    {job.title}
                  </h4>
                  <p className="text-sm text-brand-secondary font-medium">{job.company}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* main details view */}
        <div className="grow overflow-y-auto bg-brand-background">
          {selectedJobId ? (
            <JobDetails jobId={selectedJobId} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-40">
              <div className="w-20 h-20 bg-brand-surface rounded-full flex items-center justify-center mb-6 shadow-xl">
                <Briefcase size={40} className="text-brand-accent" />
              </div>
              <h3 className="text-2xl font-serif text-brand-primary mb-2">Ready to get hired?</h3>
              <p className="text-brand-secondary max-w-xs mx-auto">Select a job from the list to view its full description and application details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
