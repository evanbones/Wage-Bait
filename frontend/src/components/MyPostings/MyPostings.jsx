import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './MyPostings.css';

const ApplicantModal = ({ applicant, onClose }) => {
    if (!applicant) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="close-modal" onClick={onClose}>&times;</button>
                <div className="applicant-header">
                    <div className="applicant-pic-mock">
                        {applicant.profilePic ? <img src={applicant.profilePic} alt="Profile" /> : "No Photo"}
                    </div>
                    <div>
                        <h2>{applicant.username}</h2>
                        <p>{applicant.email}</p>
                    </div>
                </div>

                <div className="applicant-details-grid">
                    <section>
                        <h3>Skills</h3>
                        <div className="skills-tags">
                            {applicant.skills?.length > 0 ? 
                                applicant.skills.map(s => <span key={s} className="skill-tag-small">{s}</span>) 
                                : <p>No skills listed</p>}
                        </div>
                    </section>

                    <section>
                        <h3>Experience</h3>
                        {applicant.experience?.length > 0 ? 
                            applicant.experience.map((exp, i) => (
                                <div key={i} className="detail-item-small">
                                    <strong>{exp.role}</strong> at {exp.company}
                                    <p>{exp.startDate} - {exp.endDate}</p>
                                </div>
                            )) : <p>No experience listed</p>}
                    </section>

                    <section>
                        <h3>Education</h3>
                        {applicant.education?.length > 0 ? 
                            applicant.education.map((edu, i) => (
                                <div key={i} className="detail-item-small">
                                    <strong>{edu.degree}</strong>
                                    <p>{edu.school}, {edu.graduationYear}</p>
                                </div>
                            )) : <p>No education listed</p>}
                    </section>
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
    }, []);

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

    if (loading) return <div>Loading your postings...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Header />
            <div className="my-postings-container">
                <div className="postings-header">
                    <h1>My Job Postings</h1>
                    <button className="btn-create-small" onClick={() => navigate('/create-job')}>+ New Job</button>
                </div>
                
                {postings.length === 0 ? (
                    <p>You haven't posted any jobs yet.</p>
                ) : (
                    <div className="postings-list">
                        {postings.map(job => (
                            <div key={job._id} className="job-card">
                                <div className="job-card-header">
                                    <div className="title-group">
                                        <h2>{job.title}</h2>
                                        <p className="job-meta">{job.company} • {job.location}</p>
                                    </div>
                                    <div className="job-actions">
                                        <button className="btn-edit" onClick={() => handleEdit(job._id)}>Edit</button>
                                        <button className="btn-delete" onClick={() => handleDelete(job._id)}>Delete</button>
                                    </div>
                                </div>
                                
                                <div className="bids-section">
                                    <h3>Responses ({job.bids.length})</h3>
                                    {job.bids.length === 0 ? (
                                        <p className="no-bids">No one has applied yet.</p>
                                    ) : (
                                        <ul className="bids-list">
                                            {job.bids.map((bid, index) => (
                                                <li key={index} className="bid-item">
                                                    <div className="bidder-info">
                                                        <strong 
                                                            className="clickable-name" 
                                                            onClick={() => setSelectedApplicant(bid.userId)}
                                                        >
                                                            {bid.userId?.username || 'Unknown User'}
                                                        </strong>
                                                        <span>({bid.userId?.email})</span>
                                                    </div>
                                                    <div className="bid-amount">
                                                        Min Salary: <strong>${bid.minimumSalary.toLocaleString()}</strong>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
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
        </>
    );
};

export default MyPostings;
