import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './MyApplications.css';

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
    }, []);

    if (loading) return <div>Loading your applications...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Header />
            <div className="my-applications-container">
                <h1>My Job Applications</h1>
                {applications.length === 0 ? (
                    <p>You haven't applied to any jobs yet.</p>
                ) : (
                    <div className="applications-list">
                        {applications.map(job => (
                            <div key={job._id} className="job-card">
                                <h2>{job.title}</h2>
                                <p className="job-meta">{job.company} • {job.location}</p>
                                
                                <div className="application-details">
                                    <p><strong>Your Minimum Salary:</strong> ${job.myBid?.minimumSalary.toLocaleString()}</p>
                                    <p><strong>Applied on:</strong> {new Date(job.myBid?.createdAt).toLocaleDateString()}</p>
                                    <p><strong>Original Salary Range:</strong> ${job.salary.toLocaleString()}</p>
                                </div>
                                <button className="btn-view" onClick={() => navigate(`/search?q=${job.title}`)}>View Original Posting</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MyApplications;
