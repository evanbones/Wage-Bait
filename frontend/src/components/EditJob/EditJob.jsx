import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../Header/Header';
import '../CreateJob/CreateJob.css'; // reusing create styles

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
        
        // ensure current user owns this job
        if (data.postedBy !== (user._id || user.id)) {
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
  }, [id]);

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

  if (loading) return <div>Loading job details...</div>;

  return (
    <>
      <Header />
      <div className="create-job-container">
        <h2>Edit Job Listing</h2>
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
          <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Save Changes'}</button>
          <button type="button" className="btn-cancel" onClick={() => navigate('/my-postings')} style={{ marginTop: '10px', background: '#95a5a6' }}>Cancel</button>
        </form>
      </div>
    </>
  );
};

export default EditJob;
