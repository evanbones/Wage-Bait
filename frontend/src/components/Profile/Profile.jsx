import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../Header/Header';
import './Profile.css';
import { useRef} from 'react';
import { InfoBox } from '../InfoBox/InfoBox';

const SkillItem = ({ skill, onRemove }) => (
  <div className="skill-tag">
    {skill} <button onClick={() => onRemove(skill)}>x</button>
  </div>
);

const ExperienceItem = ({ exp, onRemove, index }) => (
  <div className="profile-item">
    <h4>{exp.role} at {exp.company}</h4>
    <p>{exp.startDate} - {exp.endDate}</p>
    <p>{exp.description}</p>
    <button className="remove-btn" onClick={() => onRemove(index)}>Remove</button>
  </div>
);

const EducationItem = ({ edu, onRemove, index }) => (
  <div className="profile-item">
    <h4>{edu.degree} in {edu.fieldOfStudy}</h4>
    <p>{edu.school}, {edu.graduationYear}</p>
    <button className="remove-btn" onClick={() => onRemove(index)}>Remove</button>
  </div>
);

const Profile = () => {

  const dialogRef = useRef(null);

  const openPopup = () => dialogRef.current.showModal();
  const closePopup = () => dialogRef.current.close();
  const [PFPFile, setPFPFile] = useState(null);
  const [previewPFP, setPreviewPFP] = useState(null);
  
  const handlePFPChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Picture must be smaller than 8MB");
        e.target.value = null;
        return;
      }
      setPFPFile(file);
      setPreviewPFP(URL.createObjectURL(file));
    }
  };

 const handlePFPUpload = async () => {
 
  
  console.log('handlePFPUpload called');
  console.log('PFPFile:', PFPFile);


  if (!PFPFile) return;

  const reader = new FileReader();
  reader.readAsDataURL(PFPFile);
  reader.onloadend = async () => {
    console.log('onloadend fired');
    console.log('reader.result length:', reader.result?.length);
    const photodata = reader.result;
    try {
      await handleUpdate({ profilePic: photodata });
      setPreviewPFP(null);
      setPFPFile(null);
      closePopup();
    } catch (e) {
      console.error("Upload Failed:", e);
    }
 }

 }

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  
  // new item states
  const [newSkill, setNewSkill] = useState('');
  const [newExp, setNewExp] = useState({ company: '', role: '', startDate: '', endDate: '', description: '' });
  const [newEdu, setNewEdu] = useState({ school: '', degree: '', fieldOfStudy: '', graduationYear: '' });

  // account settings states
  const [accountData, setAccountData] = useState({ username: '', email: '', password: '', confirmPassword: '' });

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${loggedInUser._id || loggedInUser.id}`);
        if (!response.ok) throw new Error('Failed to fetch profile');
        const data = await response.json();
        setUser(data);
        setAccountData({ username: data.username, email: data.email, password: '', confirmPassword: '' });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (!response.ok) throw new Error('Update failed');
      const data = await response.json();
      setUser(data);
      // update local storage if username/email changed
      if (updatedData.username || updatedData.email) {
        localStorage.setItem('user', JSON.stringify({ ...loggedInUser, ...data }));
      }
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAccountUpdate = (e) => {
    e.preventDefault();
    if (accountData.password && accountData.password !== accountData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    const updates = {
      username: accountData.username,
      email: accountData.email
    };

    if (accountData.password) {
      updates.password = accountData.password;
    }

    handleUpdate(updates);
    setAccountData({ ...accountData, password: '', confirmPassword: '' });
  };

  const addSkill = () => {
    if (!newSkill) return;
    const updatedSkills = [...user.skills, newSkill];
    handleUpdate({ skills: updatedSkills });
    setNewSkill('');
  };

  const removeSkill = (skillToRemove) => {
    const updatedSkills = user.skills.filter(s => s !== skillToRemove);
    handleUpdate({ skills: updatedSkills });
  };

  const addExperience = () => {
    const updatedExp = [...user.experience, newExp];
    handleUpdate({ experience: updatedExp });
    setNewExp({ company: '', role: '', startDate: '', endDate: '', description: '' });
  };

  const removeExperience = (index) => {
    const updatedExp = user.experience.filter((_, i) => i !== index);
    handleUpdate({ experience: updatedExp });
  };

  const addEducation = () => {
    const updatedEdu = [...user.education, newEdu];
    handleUpdate({ education: updatedEdu });
    setNewEdu({ school: '', degree: '', fieldOfStudy: '', graduationYear: '' });
  };

  const removeEducation = (index) => {
    const updatedEdu = user.education.filter((_, i) => i !== index);
    handleUpdate({ education: updatedEdu });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <Header />
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-pic-mock">
          {user.profilePic ? <img src={user.profilePic} alt="Profile" /> : "No Photo"}
          <button onClick={openPopup} className="upload-btn">Upload Photo (Mock)</button>
          <dialog ref={dialogRef} className="pfp-popup">
            <p> Upload Profile Picture</p>

            <input type="file" accept="image/*" onChange={handlePFPChange} className="pfp-input" />

            {previewPFP && <img src={previewPFP} alt="Preview" className="pfp-preview" />}
            <div>
              <button onClick={handlePFPUpload}> Upload</button>
              <button onClick={() => {
                if (previewPFP){
                  URL.revokeObjectURL(previewPFP);
                }
                setPreviewPFP(null);
                setPFPFile(null);
                closePopup();
              }}>Cancel</button>
            </div>
          </dialog>
        </div>
        <div className="user-info-main">
          <h2>{user.username}</h2>
        </div>
      </div>

      {message && <div className="success-banner">{message}</div>}

      <section className="profile-section">
        <h3>Account Settings</h3>
        <form onSubmit={handleAccountUpdate} className="add-item-form vertical">
          <div className="form-group">
            <label>Username</label>
            <input 
              value={accountData.username} 
              onChange={e => setAccountData({...accountData, username: e.target.value})} 
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={accountData.email} 
              onChange={e => setAccountData({...accountData, email: e.target.value})} 
              required
            />
          </div>
          <div className="row">
            <div className="form-group">
              <label>New Password</label>
              <input 
                type="password" 
                value={accountData.password} 
                onChange={e => setAccountData({...accountData, password: e.target.value})} 
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password</label>
              <input 
                type="password" 
                value={accountData.confirmPassword} 
                onChange={e => setAccountData({...accountData, confirmPassword: e.target.value})} 
                placeholder="Confirm password"
              />
            </div>
          </div>
          <button type="submit" className="save-account-btn">Save Account Changes</button>
        </form>
      </section>

      <section className="profile-section">
        <h3>Skills</h3>
        <div className="skills-list">
          {user.skills.map(skill => (
            <SkillItem key={skill} skill={skill} onRemove={removeSkill} />
          ))}
        </div>
        <div className="add-item-form">
          <input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill" />
          <button onClick={addSkill}>Add</button>
        </div>
      </section>

      <section className="profile-section">
        <h3>Experience</h3>
        {user.experience.map((exp, i) => (
          <ExperienceItem key={i} index={i} exp={exp} onRemove={removeExperience} />
        ))}
        <div className="add-item-form vertical">
          <input placeholder="Company" value={newExp.company} onChange={e => setNewExp({...newExp, company: e.target.value})} />
          <input placeholder="Role" value={newExp.role} onChange={e => setNewExp({...newExp, role: e.target.value})} />
          <div className="row">
            <input placeholder="Start Date" value={newExp.startDate} onChange={e => setNewExp({...newExp, startDate: e.target.value})} />
            <input placeholder="End Date" value={newExp.endDate} onChange={e => setNewExp({...newExp, endDate: e.target.value})} />
          </div>
          <textarea placeholder="Description" value={newExp.description} onChange={e => setNewExp({...newExp, description: e.target.value})} />
          <button onClick={addExperience}>Add Experience</button>
        </div>
      </section>

      <section className="profile-section">
        <h3>Education</h3>
        {user.education.map((edu, i) => (
          <EducationItem key={i} index={i} edu={edu} onRemove={removeEducation} />
        ))}
        <div className="add-item-form vertical">
          <input placeholder="School" value={newEdu.school} onChange={e => setNewEdu({...newEdu, school: e.target.value})} />
          <input placeholder="Degree" value={newEdu.degree} onChange={e => setNewEdu({...newEdu, degree: e.target.value})} />
          <input placeholder="Field of Study" value={newEdu.fieldOfStudy} onChange={e => setNewEdu({...newEdu, fieldOfStudy: e.target.value})} />
          <input placeholder="Graduation Year" value={newEdu.graduationYear} onChange={e => setNewEdu({...newEdu, graduationYear: e.target.value})} />
          <button onClick={addEducation}>Add Education</button>
        </div>
      </section>

      <div className="profile-footer-links">
          <h3>Jobs & Postings</h3>
          <div className="footer-link-group">
            <Link to="/my-applications" className="btn-footer">Jobs I've Applied To</Link>
            <Link to="/my-postings" className="btn-footer secondary">My Job Postings</Link>
            <Link to="/create-job" className="btn-footer accent">Post a New Job</Link>
          </div>
      </div>
    </div>
    </>
  );
};

export default Profile;
