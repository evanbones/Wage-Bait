import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Building2, MapPin, DollarSign, Tag, AlignLeft, Globe, ArrowLeft, Save, XCircle } from 'lucide-react';
import Header from '../Header/Header';

const EditJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    category: 'Other',
    description: '',
    remote: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/jobs/${id}`);
        if (!response.ok) throw new Error('Failed to fetch job details');
        const data = await response.json();
        
        const userId = user._id || user.id;
        const postedBy = data.postedBy._id || data.postedBy;
        
        if (postedBy !== userId) {
            navigate('/my-postings');
            return;
        }

        setJobData({
          title: data.title,
          company: data.company,
          location: data.location,
          salary: data.salary,
          category: data.category || 'Other',
          description: data.description,
          remote: data.remote
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8000/api/jobs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...jobData,
          salary: Number(jobData.salary),
          userId: user._id || user.id
        })
      });
      if (!response.ok) throw new Error('Failed to update job');
      navigate('/my-postings');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-background">
        <Header />
        <div className="max-w-7xl mx-auto p-12 flex justify-center">
            <div className="animate-pulse text-brand-secondary font-medium">Loading job details...</div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button 
          onClick={() => navigate('/my-postings')}
          className="flex items-center gap-2 text-brand-secondary hover:text-brand-primary transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to My Postings</span>
        </button>

        <div className="bg-brand-surface rounded-[2.5rem] shadow-2xl shadow-brand-primary/5 border border-brand-secondary/10 overflow-hidden">
            <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-brand-accent-light rounded-2xl flex items-center justify-center text-brand-primary shadow-inner">
                        <Save size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-serif text-brand-primary">Edit Job Listing</h1>
                        <p className="text-brand-secondary font-medium text-sm">Update the details for your position.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Briefcase size={14} className="text-brand-accent" />
                                Job Title
                            </label>
                            <input 
                                required 
                                value={jobData.title} 
                                onChange={e => setJobData({...jobData, title: e.target.value})}
                                className="w-full p-4 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium"
                                placeholder="e.g. Senior Software Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Building2 size={14} className="text-brand-accent" />
                                Company
                            </label>
                            <input 
                                required 
                                value={jobData.company} 
                                onChange={e => setJobData({...jobData, company: e.target.value})}
                                className="w-full p-4 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium"
                                placeholder="e.g. Acme Corp"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                                <MapPin size={14} className="text-brand-accent" />
                                Location
                            </label>
                            <input 
                                required 
                                value={jobData.location} 
                                onChange={e => setJobData({...jobData, location: e.target.value})}
                                className="w-full p-4 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium"
                                placeholder="e.g. New York, NY"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                                <DollarSign size={14} className="text-brand-accent" />
                                Annual Salary ($)
                            </label>
                            <input 
                                type="number" 
                                required 
                                value={jobData.salary} 
                                onChange={e => setJobData({...jobData, salary: e.target.value})}
                                className="w-full p-4 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium"
                                placeholder="e.g. 120000"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Tag size={14} className="text-brand-accent" />
                                Category
                            </label>
                            <select 
                                required 
                                value={jobData.category} 
                                onChange={e => setJobData({...jobData, category: e.target.value})}
                                className="w-full p-4 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium appearance-none"
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
                        <div className="flex items-end pb-4">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="peer sr-only"
                                        checked={jobData.remote} 
                                        onChange={e => setJobData({...jobData, remote: e.target.checked})} 
                                    />
                                    <div className="w-12 h-6 bg-brand-background border border-brand-secondary/20 rounded-full peer peer-checked:bg-brand-accent transition-all"></div>
                                    <div className="absolute left-1 top-1 w-4 h-4 bg-brand-secondary/30 rounded-full transition-all peer-checked:left-7 peer-checked:bg-brand-surface shadow-sm"></div>
                                </div>
                                <span className="text-sm font-bold text-brand-secondary group-hover:text-brand-primary transition-colors flex items-center gap-2">
                                    <Globe size={16} />
                                    Remote Position
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1 flex items-center gap-2">
                            <AlignLeft size={14} className="text-brand-accent" />
                            Job Description
                        </label>
                        <textarea 
                            required 
                            value={jobData.description} 
                            onChange={e => setJobData({...jobData, description: e.target.value})} 
                            rows="6"
                            className="w-full p-4 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium resize-none"
                            placeholder="Describe the role, requirements, and benefits..."
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100">
                            <XCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="flex-1 bg-brand-primary text-brand-surface py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/10 disabled:opacity-70"
                        >
                            {loading ? "Updating..." : "Update Listing"}
                            <Save size={20} />
                        </button>
                        <button 
                            type="button" 
                            onClick={() => navigate('/my-postings')}
                            className="px-10 py-5 bg-brand-background text-brand-secondary rounded-2xl font-bold hover:bg-brand-secondary/10 transition-all border border-brand-secondary/10"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;
