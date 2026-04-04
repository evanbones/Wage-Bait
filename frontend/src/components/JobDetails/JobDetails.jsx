import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Building2, ChevronLeft } from 'lucide-react';
import Comments from '../Comments/Comments';

const JobDetails = ({ jobId: propJobId }) => {
    const { id: urlJobId } = useParams();
    const id = propJobId || urlJobId;
    
    const [job, setJob] = useState(null);
    const [minSalary, setMinSalary] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;
        
        const fetchJob = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8000/api/jobs/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch job details');
                }
                const data = await response.json();
                setJob(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchJob();
    }, [id]);

    const handleApply = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!user) {
            alert('Please log in to apply.');
            navigate('/login');
            return;
        }

        if (!minSalary || isNaN(minSalary)) {
            alert('Please enter a valid minimum salary.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/api/jobs/bid', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId: id,
                    userId: user._id || user.id,
                    minimumSalary: Number(minSalary)
                }),
            });

            if (response.ok) {
                setMessage('Application and minimum salary requirement submitted successfully!');
                setMinSalary('');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to submit bid.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-background">
            <div className="animate-pulse text-brand-secondary">Loading job details...</div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-background text-red-500">
            Error: {error}
        </div>
    );
    
    if (!job) return (
        <div className="min-h-screen flex items-center justify-center bg-brand-background text-brand-secondary">
            Job not found.
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-background px-4 py-8 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* back button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-brand-secondary hover:text-brand-primary transition-colors mb-6 group"
                >
                    <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    <span>Back to search</span>
                </button>

                <div className="bg-brand-surface rounded-3xl shadow-xl shadow-brand-primary/5 p-8 md:p-12">
                    {/* header */}
                    <div className="mb-8">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="bg-brand-accent-light text-brand-primary px-3 py-1 rounded-full text-sm font-bold">
                                {job.category || 'General'}
                            </span>
                            {job.remote && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                    Remote Available
                                </span>
                            )}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-serif text-brand-primary mb-4 leading-tight">
                            {job.title}
                        </h1>
                        <div className="flex flex-wrap gap-6 text-brand-secondary font-medium">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-brand-accent" />
                                <span>{job.company}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-brand-accent" />
                                <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-brand-accent" />
                                <span className="text-brand-primary font-bold">
                                    ${job.salary.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* main content */}
                        <div className="md:col-span-2">
                            <h3 className="text-2xl font-serif mb-4 pb-2 border-b border-brand-secondary/10">
                                Description
                            </h3>
                            <div className="text-brand-primary/80 leading-relaxed whitespace-pre-wrap">
                                {job.description}
                            </div>
                        </div>

                        {/* apply sidebar */}
                        <div className="bg-brand-background rounded-2xl p-6 h-fit border border-brand-secondary/10">
                            <h3 className="text-xl font-bold mb-4">Interested in this role?</h3>
                            <p className="text-sm text-brand-secondary mb-6">
                                Enter your required minimum salary to apply for this position.
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="minSalary" className="block text-sm font-bold mb-2">
                                        Your Min Salary ($)
                                    </label>
                                    <input 
                                        type="number" 
                                        id="minSalary" 
                                        value={minSalary} 
                                        onChange={(e) => setMinSalary(e.target.value)}
                                        placeholder="e.g. 55000"
                                        className="w-full p-3 bg-brand-surface border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-brand-accent outline-none"
                                    />
                                </div>
                                <button 
                                    className="w-full bg-brand-primary text-brand-surface py-4 rounded-xl font-bold hover:bg-brand-secondary transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-primary/10"
                                    onClick={handleApply}
                                >
                                    Apply Now
                                </button>
                                {message && (
                                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-top-1">
                                        {message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* comments section */}
                    <Comments 
                        jobId={id} 
                        comments={job.comments} 
                        onCommentAdded={(newComments) => setJob({...job, comments: newComments})}
                    />
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
