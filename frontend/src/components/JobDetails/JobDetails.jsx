import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './JobDetails.css';

const JobDetails = ({ jobId: propJobId }) => {
    const { id: urlJobId } = useParams();
    const id = propJobId || urlJobId; // use prop if passed, otherwise use URL parameter
    
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

    if (loading) return <div className="job-details-loading">Loading...</div>;
    if (error) return <div className="job-details-error">Error: {error}</div>;
    if (!job) return <div className="job-details-notfound">Job not found.</div>;

    return (
        <div className="job-details-container" style={{ margin: '0', maxWidth: '100%' }}>
            <h1>{job.title}</h1>
            <div className="job-info">
                <p><strong>Company:</strong> {job.company}</p>
                <p><strong>Industry:</strong> {job.category || 'Other'}</p>
                <p><strong>Location:</strong> {job.location} {job.remote ? '(Remote)' : ''}</p>
                <p><strong>Salary:</strong> ${job.salary.toLocaleString()}</p>
            </div>
            <div className="job-description">
                <h3>Description</h3>
                <p>{job.description}</p>
            </div>
            
            {message && <p className="success-message">{message}</p>}

            <div className="apply-section">
                <div className="bid-input-group">
                    <label htmlFor="minSalary">Your Min Salary ($):</label>
                    <input 
                        type="number" 
                        id="minSalary" 
                        value={minSalary} 
                        onChange={(e) => setMinSalary(e.target.value)}
                        placeholder="e.g. 55000"
                    />
                </div>
                <button className="apply-button" onClick={handleApply}>
                    Apply Now
                </button>
            </div>
        </div>
    );
};

export default JobDetails;
