import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Users, Plus, Edit2, Trash2, X, Mail, GraduationCap, History, Star } from 'lucide-react';
import Header from '../Header/Header';

const ApplicantModal = ({ applicant, onClose }) => {
    if (!applicant) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="bg-brand-surface w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                <div className="relative p-8 md:p-12">
                    <button 
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-brand-background transition-colors text-brand-secondary"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
                        <div className="w-24 h-24 rounded-3xl bg-brand-accent-light flex items-center justify-center text-brand-primary overflow-hidden shadow-inner border-2 border-brand-surface">
                            {applicant.profilePic ? (
                                <img src={applicant.profilePic} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <Users size={40} />
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-serif text-brand-primary mb-2">{applicant.username}</h2>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-brand-secondary">
                                <Mail size={16} />
                                <span className="font-medium">{applicant.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <section>
                            <div className="flex items-center gap-2 mb-4 text-brand-primary">
                                <Star size={20} className="text-brand-accent" />
                                <h3 className="font-bold uppercase tracking-widest text-xs">Skills</h3>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {applicant.skills?.length > 0 ? 
                                    applicant.skills.map(s => (
                                        <span key={s} className="px-3 py-1 bg-brand-background text-brand-secondary text-sm font-medium rounded-lg border border-brand-secondary/10">
                                            {s}
                                        </span>
                                    )) 
                                    : <p className="text-sm text-brand-secondary italic">No skills listed</p>}
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-2 mb-4 text-brand-primary">
                                <History size={20} className="text-brand-accent" />
                                <h3 className="font-bold uppercase tracking-widest text-xs">Experience</h3>
                            </div>
                            <div className="space-y-4">
                                {applicant.experience?.length > 0 ? 
                                    applicant.experience.map((exp, i) => (
                                        <div key={i} className="text-sm">
                                            <div className="font-bold text-brand-primary">{exp.role}</div>
                                            <div className="text-brand-secondary font-medium">{exp.company}</div>
                                            <div className="text-[10px] text-brand-secondary/60 mt-1 uppercase">{exp.startDate} - {exp.endDate}</div>
                                        </div>
                                    )) : <p className="text-sm text-brand-secondary italic">No experience listed</p>}
                            </div>
                        </section>

                        <section className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4 text-brand-primary">
                                <GraduationCap size={20} className="text-brand-accent" />
                                <h3 className="font-bold uppercase tracking-widest text-xs">Education</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {applicant.education?.length > 0 ? 
                                    applicant.education.map((edu, i) => (
                                        <div key={i} className="bg-brand-background p-4 rounded-2xl border border-brand-secondary/5 text-sm">
                                            <div className="font-bold text-brand-primary">{edu.degree}</div>
                                            <div className="text-brand-secondary font-medium">{edu.school}</div>
                                            <div className="text-[10px] text-brand-secondary/60 mt-1 uppercase">Class of {edu.graduationYear}</div>
                                        </div>
                                    )) : <p className="text-sm text-brand-secondary italic">No education listed</p>}
                            </div>
                        </section>
                    </div>
                </div>
                <div className="bg-brand-background p-6 text-center">
                    <button 
                        onClick={onClose}
                        className="bg-brand-primary text-brand-surface px-8 py-3 rounded-2xl font-bold hover:bg-brand-secondary transition-all w-full md:w-auto"
                    >
                        Close Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyPostings = () => {
    const [postings, setPostings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        fetchPostings();
    }, [user, navigate]);

    const fetchPostings = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/users/${user._id || user.id}/postings`);
            if (!response.ok) throw new Error('Failed to fetch your postings');
            const data = await response.json();
            setPostings(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job listing?")) return;

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id || user.id })
            });

            if (response.ok) {
                setPostings(postings.filter(job => job._id !== jobId));
            } else {
                const data = await response.json();
                alert(data.message || "Failed to delete job.");
            }
        } catch (err) {
            alert("Error deleting job: " + err.message);
        }
    };

    const handleEdit = (jobId) => {
        navigate(`/edit-job/${jobId}`);
    };

    if (loading) return (
        <div className="min-h-screen bg-brand-background">
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-12 flex justify-center">
                <div className="animate-pulse text-brand-secondary font-medium">Loading your postings...</div>
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
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-serif text-brand-primary mb-2">My Job Postings</h1>
                        <p className="text-brand-secondary font-medium">Manage your active listings and view applicants.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/create-job')}
                        className="flex items-center gap-2 bg-brand-accent text-brand-primary px-8 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-brand-accent/20 transition-all"
                    >
                        <Plus size={20} />
                        <span>Create New Job</span>
                    </button>
                </div>
                
                {postings.length === 0 ? (
                    <div className="bg-brand-surface rounded-3xl p-16 text-center border border-brand-secondary/10 shadow-xl shadow-brand-primary/5">
                        <Briefcase className="w-16 h-16 text-brand-secondary/20 mx-auto mb-4" />
                        <p className="text-xl text-brand-secondary font-serif">You haven't posted any jobs yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {postings.map(job => (
                            <div key={job._id} className="bg-brand-surface rounded-3xl overflow-hidden border border-brand-secondary/10 shadow-lg shadow-brand-primary/5">
                                <div className="p-8 border-b border-brand-secondary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div>
                                        <h2 className="text-2xl font-serif text-brand-primary mb-2">{job.title}</h2>
                                        <div className="flex flex-wrap gap-4 text-sm text-brand-secondary font-medium">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase size={16} className="text-brand-accent/70" />
                                                <span>{job.company}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={16} className="text-brand-accent/70" />
                                                <span>{job.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(job._id)}
                                            className="p-3 bg-brand-background text-brand-secondary rounded-xl hover:bg-brand-primary hover:text-brand-surface transition-all shadow-sm"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(job._id)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="p-8 bg-brand-background/30">
                                    <div className="flex items-center gap-2 mb-6">
                                        <Users className="text-brand-accent w-5 h-5" />
                                        <h3 className="font-bold text-brand-primary">Applicants ({job.bids.length})</h3>
                                    </div>
                                    
                                    {job.bids.length === 0 ? (
                                        <p className="text-brand-secondary italic text-sm">No applications received yet.</p>
                                    ) : (
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            {job.bids.map((bid, index) => (
                                                <div 
                                                    key={index} 
                                                    className="flex items-center justify-between p-4 bg-brand-surface rounded-2xl border border-brand-secondary/5 hover:border-brand-accent/50 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                                                    onClick={() => setSelectedApplicant(bid.userId)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-brand-accent-light flex items-center justify-center text-brand-primary font-bold overflow-hidden">
                                                            {bid.userId?.profilePic ? <img src={bid.userId.profilePic} className="w-full h-full object-cover" alt="" /> : <Users size={16} />}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-brand-primary group-hover:text-brand-accent transition-colors">
                                                                {bid.userId?.username || 'Unknown User'}
                                                            </div>
                                                            <div className="text-[10px] text-brand-secondary font-medium">{bid.userId?.email}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] text-brand-secondary uppercase font-bold tracking-widest">Min Salary</div>
                                                        <div className="text-sm font-bold text-brand-primary flex items-center gap-0.5 justify-end">
                                                            <DollarSign size={14} className="text-brand-accent" />
                                                            {bid.minimumSalary.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ApplicantModal 
                applicant={selectedApplicant} 
                onClose={() => setSelectedApplicant(null)} 
            />
        </div>
    );
};

export default MyPostings;
