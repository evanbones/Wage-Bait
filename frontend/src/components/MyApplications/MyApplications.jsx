import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Calendar, ArrowRight, Search } from 'lucide-react';
import Header from '../Header/Header';

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/${user._id || user.id}/applications`);
                if (!response.ok) throw new Error('Failed to fetch your applications');
                const data = await response.json();
                setApplications(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchApplications();
    }, [user, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-brand-background">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
                <div className="animate-pulse text-brand-secondary font-medium">Loading your applications...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-brand-background">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-500">
                Error: {error}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-background">
            <Header />
            <div className="max-w-5xl mx-auto px-4 py-12">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-serif text-brand-primary mb-4">My Job Applications</h1>
                    <p className="text-brand-secondary font-medium">Track and manage the roles you've applied for.</p>
                </div>

                {applications.length === 0 ? (
                    <div className="bg-brand-surface rounded-3xl p-12 text-center border border-brand-secondary/10 shadow-xl shadow-brand-primary/5">
                        <Search className="w-16 h-16 text-brand-secondary/20 mx-auto mb-4" />
                        <p className="text-xl text-brand-secondary mb-6 font-serif">You haven't applied to any jobs yet.</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-brand-primary text-brand-surface px-8 py-3 rounded-2xl font-bold hover:bg-brand-secondary transition-all"
                        >
                            Explore Jobs
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {applications.map(job => (
                            <div key={job._id} className="bg-brand-surface rounded-3xl p-8 border border-brand-secondary/10 shadow-lg shadow-brand-primary/5 hover:shadow-xl transition-shadow group">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="flex-1">
                                        <h2 className="text-2xl font-serif text-brand-primary mb-2 group-hover:text-brand-accent transition-colors">{job.title}</h2>
                                        <div className="flex flex-wrap gap-4 text-sm text-brand-secondary font-medium mb-6">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase size={16} className="text-brand-accent/70" />
                                                <span>{job.company}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={16} className="text-brand-accent/70" />
                                                <span>{job.location}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid sm:grid-cols-2 gap-4 bg-brand-background p-4 rounded-2xl border border-brand-secondary/5">
                                            <div>
                                                <div className="text-[10px] uppercase font-bold tracking-widest text-brand-secondary mb-1">Your Min Salary</div>
                                                <div className="text-lg font-bold text-brand-primary flex items-center gap-1">
                                                    <DollarSign size={18} className="text-brand-accent" />
                                                    {job.myBid?.minimumSalary.toLocaleString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] uppercase font-bold tracking-widest text-brand-secondary mb-1">Applied On</div>
                                                <div className="text-lg font-bold text-brand-primary flex items-center gap-1">
                                                    <Calendar size={18} className="text-brand-accent" />
                                                    {new Date(job.myBid?.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center md:items-end md:pl-8 md:border-l border-brand-secondary/10">
                                        <button 
                                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-brand-primary text-brand-surface px-6 py-3 rounded-2xl font-bold hover:bg-brand-secondary transition-all shadow-lg shadow-brand-primary/10"
                                            onClick={() => navigate(`/jobs/${job._id}`)}
                                        >
                                            View Posting
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyApplications;
