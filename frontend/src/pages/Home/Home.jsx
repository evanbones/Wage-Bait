import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, X, ChevronRight, Briefcase, TrendingUp, Users } from "lucide-react";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import WaveBackground from "./WaveBackground.jsx";

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
  <div className="flex flex-col min-h-screen bg-brand-background relative">
    <WaveBackground />
    <Header />

    <main className="grow relative z-10">
      {/* hero section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h1 className="text-6xl md:text-7xl font-serif text-brand-primary mb-6 leading-tight">
                Find Your Next <span className="text-brand-accent italic">Great</span> Opportunity
              </h1>
              <p className="text-xl text-brand-secondary font-medium mb-10">
                Don't just apply. Negotiate the life you deserve.
              </p>

              <div className="bg-brand-surface p-2 rounded-3xl shadow-2xl shadow-brand-primary/10 border border-brand-secondary/10">
                <form className="flex flex-col md:flex-row gap-2" onSubmit={handleSearch}>
                  <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary/50 group-focus-within:text-brand-accent transition-colors" />
                    <input
                      type="text"
                      placeholder="Job title, company, or keywords..."
                      className="w-full py-4 pl-12 pr-4 rounded-2xl bg-brand-background/50 border-none focus:ring-2 focus:ring-brand-accent outline-none font-medium transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
                        showFilters 
                        ? "bg-brand-accent-light text-brand-primary" 
                        : "bg-brand-background text-brand-secondary hover:bg-brand-secondary/10"
                    }`}
                  >
                    <Filter size={20} />
                    <span>Filters</span>
                  </button>
                  <button 
                    type="submit" 
                    className="bg-brand-primary text-brand-surface px-10 py-4 rounded-2xl font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/20"
                  >
                    Search Jobs
                  </button>
                </form>

                {/* filters dropdown/sidebar */}
                {showFilters && (
                  <div className="mt-4 p-6 border-t border-brand-secondary/10 text-left animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-sm font-bold text-brand-primary mb-3">Minimum Annual Salary ($)</label>
                        <input
                          type="number"
                          value={minSalary}
                          onChange={(e) => setMinSalary(e.target.value)}
                          placeholder="e.g. 80000"
                          className="w-full p-3 bg-brand-background rounded-xl border border-brand-secondary/20 focus:ring-2 focus:ring-brand-accent outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-brand-primary mb-3">Popular Categories</label>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => handleCategoryChange(cat)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                selectedCategories.includes(cat)
                                  ? "bg-brand-primary text-brand-surface"
                                  : "bg-brand-background text-brand-secondary hover:bg-brand-secondary/20 border border-brand-secondary/10"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* feature cards */}
            <div className="grid md:grid-cols-3 gap-8 mt-20">
              {[
                { icon: Briefcase, title: "Verified Listings", desc: "Every job posting is definitely super real and verified to ensure quality." },
                { icon: TrendingUp, title: "Profile Insights", desc: "Compare your profile with other real users from our community." },
                { icon: Users, title: "Community Driven", desc: "Join thousands of other wage baiters searching for new experiences!" }
              ].map((feature, i) => (
                <div key={i} className="bg-brand-surface/50 backdrop-blur-sm p-8 rounded-3xl border border-brand-secondary/10 hover:border-brand-accent/50 transition-colors group">
                  <div className="bg-brand-surface w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-primary/5 mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="text-brand-accent w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-primary mb-3">{feature.title}</h3>
                  <p className="text-brand-secondary leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
        </section>

        {/* categories grid */}
        <section className="py-20 bg-brand-surface/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-serif text-brand-primary mb-4">Browse by Category</h2>
                <p className="text-brand-secondary">Explore opportunities across different industries.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/search?categories=${cat}`)}
                  className="bg-brand-surface p-6 rounded-2xl text-center border border-brand-secondary/5 hover:border-brand-accent hover:shadow-xl hover:shadow-brand-primary/5 transition-all group"
                >
                  <div className="font-bold text-brand-primary group-hover:text-brand-accent transition-colors">{cat}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
