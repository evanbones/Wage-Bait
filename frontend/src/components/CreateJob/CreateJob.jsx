import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import { Briefcase, Building2, MapPin, DollarSign, Tag, FileText, Globe } from 'lucide-react';

const CreateJob = () => {
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    category: 'Technology',
    description: '',
    remote: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) {
        setError("You must be logged in to post a job.");
        setLoading(false);
        return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...jobData,
          salary: Number(jobData.salary),
          postedBy: user._id || user.id
        })
      });
      if (!response.ok) throw new Error('Failed to create job');
      navigate('/search?q=' + jobData.title);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const inputClasses = "w-full p-3 border border-gray-200 rounded-xl font-sans focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all";
  const labelClasses = "flex items-center gap-2 text-sm font-medium text-brand-secondary mb-1.5 ml-1";

  return (
    <div className="min-h-screen bg-brand-background pb-12">
      <Header />
      <div className="max-w-2xl mx-auto mt-10 px-4">
        <div className="bg-brand-surface rounded-3xl shadow-soft p-8 border border-gray-100">
          <h2 className="text-3xl font-serif text-brand-primary mb-8 text-center">Post a New Job Listing</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClasses}>
                <Briefcase className="w-4 h-4" /> Job Title
              </label>
              <input 
                required 
                className={inputClasses}
                placeholder="e.g. Senior Frontend Developer"
                value={jobData.title} 
                onChange={e => setJobData({...jobData, title: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>
                  <Building2 className="w-4 h-4" /> Company
                </label>
                <input 
                  required 
                  className={inputClasses}
                  placeholder="e.g. Acme Corp"
                  value={jobData.company} 
                  onChange={e => setJobData({...jobData, company: e.target.value})} 
                />
              </div>
              <div>
                <label className={labelClasses}>
                  <MapPin className="w-4 h-4" /> Location
                </label>
                <input 
                  required 
                  className={inputClasses}
                  placeholder="e.g. New York, NY"
                  value={jobData.location} 
                  onChange={e => setJobData({...jobData, location: e.target.value})} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>
                  <DollarSign className="w-4 h-4" /> Salary (Annual)
                </label>
                <input 
                  type="number" 
                  required 
                  className={inputClasses}
                  placeholder="e.g. 120000"
                  value={jobData.salary} 
                  onChange={e => setJobData({...jobData, salary: e.target.value})} 
                />
              </div>
              <div>
                <label className={labelClasses}>
                  <Tag className="w-4 h-4" /> Category
                </label>
                <select 
                  required 
                  className={inputClasses}
                  value={jobData.category} 
                  onChange={e => setJobData({...jobData, category: e.target.value})}
                >
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Hospitality">Hospitality</option>
                  <option value="Retail">Retail</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>
                <FileText className="w-4 h-4" /> Description
              </label>
              <textarea 
                required 
                className={`${inputClasses} resize-none`}
                placeholder="Describe the role, requirements, and benefits..."
                value={jobData.description} 
                onChange={e => setJobData({...jobData, description: e.target.value})} 
                rows="5" 
              />
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={jobData.remote} 
                  onChange={e => setJobData({...jobData, remote: e.target.checked})} 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
              </label>
              <label className="text-sm font-medium text-brand-primary flex items-center gap-2">
                <Globe className="w-4 h-4" /> Remote Position
              </label>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center font-medium bg-red-50 py-3 rounded-xl border border-red-100">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-brand-primary text-brand-surface rounded-2xl font-sans font-bold text-lg hover:bg-brand-secondary transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
