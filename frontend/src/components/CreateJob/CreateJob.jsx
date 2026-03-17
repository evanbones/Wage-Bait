import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import './CreateJob.css';

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

  return (
    <>
    <Header />
    <div className="create-job-container">
      <h2>Post a New Job Listing</h2>
      <form onSubmit={handleSubmit} className="create-job-form">
        <div className="form-group">
          <label>Job Title</label>
          <input required value={jobData.title} onChange={e => setJobData({...jobData, title: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Company</label>
          <input required value={jobData.company} onChange={e => setJobData({...jobData, company: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input required value={jobData.location} onChange={e => setJobData({...jobData, location: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Salary (Annual)</label>
          <input type="number" required value={jobData.salary} onChange={e => setJobData({...jobData, salary: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Category (Industry)</label>
          <select 
            required 
            value={jobData.category} 
            onChange={e => setJobData({...jobData, category: e.target.value})}
            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ddd' }}
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
        <div className="form-group">
          <label>Description</label>
          <textarea required value={jobData.description} onChange={e => setJobData({...jobData, description: e.target.value})} rows="5" />
        </div>
        <div className="form-group checkbox">
          <input type="checkbox" checked={jobData.remote} onChange={e => setJobData({...jobData, remote: e.target.checked})} />
          <label>Remote Position</label>
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</button>
      </form>
    </div>
    </>
  );
};

export default CreateJob;
