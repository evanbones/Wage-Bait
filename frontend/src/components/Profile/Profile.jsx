import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { X, Camera, Plus, Trash2, Briefcase, GraduationCap, Star, Settings, User } from "lucide-react";
import Header from "../Header/Header";
import ActionButton from "../ActionButton/ActionButton";

const SkillItem = ({ skill, onRemove }) => (
  <div className="flex items-center gap-2 bg-brand-background text-brand-primary px-3 py-1 rounded-full border border-brand-secondary/10 group transition-all hover:border-brand-accent">
    <span className="text-sm font-medium">{skill}</span>
    <X size={14} className="cursor-pointer text-brand-secondary hover:text-red-500 transition-colors" onClick={() => onRemove(skill)} />
  </div>
);

const ExperienceItem = ({ exp, onRemove, index }) => (
  <div className="relative p-6 bg-brand-surface rounded-2xl border border-brand-secondary/5 shadow-sm group">
    <button 
      className="absolute top-4 right-4 p-2 text-brand-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
      onClick={() => onRemove(index)}
    >
      <Trash2 size={18} />
    </button>
    <h4 className="text-lg font-bold text-brand-primary">{exp.role}</h4>
    <p className="text-brand-secondary font-medium mb-3">{exp.company}</p>
    <p className="text-xs text-brand-accent uppercase font-bold tracking-widest mb-3">{exp.startDate} - {exp.endDate}</p>
    <p className="text-sm text-brand-primary/80 leading-relaxed">{exp.description}</p>
  </div>
);

const EducationItem = ({ edu, onRemove, index }) => (
  <div className="relative p-6 bg-brand-surface rounded-2xl border border-brand-secondary/5 shadow-sm group">
    <button 
      className="absolute top-4 right-4 p-2 text-brand-secondary hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
      onClick={() => onRemove(index)}
    >
      <Trash2 size={18} />
    </button>
    <h4 className="text-lg font-bold text-brand-primary">{edu.degree}</h4>
    <p className="text-brand-secondary font-medium">{edu.fieldOfStudy}</p>
    <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-brand-primary font-bold">{edu.school}</span>
        <span className="text-xs text-brand-secondary font-bold uppercase tracking-widest">Class of {edu.graduationYear}</span>
    </div>
  </div>
);

const Profile = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [PFPFile, setPFPFile] = useState(null);
  const [previewPFP, setPreviewPFP] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const [newSkill, setNewSkill] = useState("");
  const [newExp, setNewExp] = useState({ company: "", role: "", startDate: "", endDate: "", description: "" });
  const [newEdu, setNewEdu] = useState({ school: "", degree: "", fieldOfStudy: "", graduationYear: "" });
  const [accountData, setAccountData] = useState({ username: "", email: "", password: "", confirmPassword: "" });

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));

  const openPopup = () => setShowPopup(true);
  const closePopup = () => {
    setShowPopup(false);
    setPreviewPFP(null);
    setPFPFile(null);
  };

  useEffect(() => {
    if (!loggedInUser) {
        navigate("/login");
        return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${loggedInUser._id || loggedInUser.id}`);
        if (!response.ok) throw new Error("Failed to fetch profile");
        const data = await response.json();
        setUser(data);
        setAccountData({ username: data.username, email: data.email, password: "", confirmPassword: "" });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (updatedData) => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${user._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
      });
      if (!response.ok) throw new Error("Update failed");
      const data = await response.json();
      setUser(data);
      if (updatedData.username || updatedData.email) {
        localStorage.setItem("user", JSON.stringify({ ...loggedInUser, ...data }));
      }
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePFPChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Picture must be smaller than 8MB");
        return;
      }
      setPFPFile(file);
      setPreviewPFP(URL.createObjectURL(file));
    }
  };

  const handlePFPUpload = async () => {
    if (!PFPFile) return;
    const reader = new FileReader();
    reader.readAsDataURL(PFPFile);
    reader.onloadend = async () => {
      const photodata = reader.result;
      try {
        await handleUpdate({ profilePic: photodata });
        closePopup();
      } catch (e) {
        console.error("Upload Failed:", e);
      }
    };
  };

  const handleAccountUpdate = (e) => {
    e.preventDefault();
    if (accountData.password && accountData.password !== accountData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    const updates = { username: accountData.username, email: accountData.email };
    if (accountData.password) updates.password = accountData.password;
    handleUpdate(updates);
    setAccountData({ ...accountData, password: "", confirmPassword: "" });
  };

  if (loading) return (
    <div className="min-h-screen bg-brand-background">
        <Header />
        <div className="max-w-7xl mx-auto p-12 flex justify-center">
            <div className="animate-pulse text-brand-secondary font-medium">Loading profile...</div>
        </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-brand-background text-red-500 p-12 text-center">
        Error: {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-brand-surface rounded-3xl p-8 md:p-12 shadow-xl shadow-brand-primary/5 border border-brand-secondary/10 mb-12">
            <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="relative group">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-brand-accent-light flex items-center justify-center text-brand-primary overflow-hidden border-4 border-brand-surface shadow-xl">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={64} className="text-brand-accent" />
                        )}
                    </div>
                    <button 
                        onClick={openPopup}
                        className="absolute -bottom-2 -right-2 bg-brand-primary text-brand-surface p-3 rounded-2xl shadow-lg hover:scale-110 transition-transform group-hover:bg-brand-accent group-hover:text-brand-primary"
                    >
                        <Camera size={20} />
                    </button>
                </div>
                
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-4xl md:text-5xl font-serif text-brand-primary mb-2">{user.username}</h1>
                    <p className="text-brand-secondary font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Active Member
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <Link to="/my-applications">
                            <ActionButton variant="outline" className="text-sm">My Applications</ActionButton>
                        </Link>
                        <Link to="/my-postings">
                            <ActionButton variant="outline" className="text-sm">My Postings</ActionButton>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        {message && (
            <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-100 font-medium text-center animate-in fade-in slide-in-from-top-2">
                {message}
            </div>
        )}

        <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-12">
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Settings className="text-brand-accent" size={24} />
                        <h2 className="text-xl font-bold text-brand-primary uppercase tracking-widest text-sm">Account Settings</h2>
                    </div>
                    <form onSubmit={handleAccountUpdate} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest px-1">Username</label>
                            <input
                                value={accountData.username}
                                onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                                className="w-full p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest px-1">Email</label>
                            <input
                                type="email"
                                value={accountData.email}
                                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                                className="w-full p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none"
                            />
                        </div>
                        <div className="space-y-1 pt-4">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest px-1">Change Password</label>
                            <input
                                type="password"
                                placeholder="New password"
                                value={accountData.password}
                                onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                                className="w-full p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none mb-2"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={accountData.confirmPassword}
                                onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                                className="w-full p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none"
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-brand-primary text-brand-surface rounded-xl font-bold hover:bg-brand-secondary transition-all shadow-md">
                            Update Account
                        </button>
                    </form>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Star className="text-brand-accent" size={24} />
                            <h2 className="text-xl font-bold text-brand-primary uppercase tracking-widest text-sm">Skills</h2>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                        {user.skills.map((skill) => (
                            <SkillItem key={skill} skill={skill} onRemove={(s) => handleUpdate({ skills: user.skills.filter(sk => sk !== s) })} />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add skill..."
                            className="flex-1 p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm"
                        />
                        <button 
                            onClick={() => {
                                if (!newSkill) return;
                                handleUpdate({ skills: [...user.skills, newSkill] });
                                setNewSkill("");
                            }}
                            className="p-3 bg-brand-accent text-brand-primary rounded-xl hover:bg-brand-primary hover:text-brand-surface transition-all"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </section>
            </div>

            <div className="lg:col-span-2 space-y-12">
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Briefcase className="text-brand-accent" size={24} />
                            <h2 className="text-xl font-bold text-brand-primary uppercase tracking-widest text-sm">Experience</h2>
                        </div>
                    </div>
                    
                    <div className="space-y-6 mb-8">
                        {user.experience.map((exp, i) => (
                            <ExperienceItem
                                key={i}
                                index={i}
                                exp={exp}
                                onRemove={(idx) => handleUpdate({ experience: user.experience.filter((_, index) => index !== idx) })}
                            />
                        ))}
                    </div>

                    <div className="bg-brand-background/50 p-8 rounded-3xl border border-dashed border-brand-secondary/30">
                        <h4 className="font-bold text-brand-primary mb-6">Add New Experience</h4>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input placeholder="Company" value={newExp.company} onChange={(e) => setNewExp({...newExp, company: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" />
                                <input placeholder="Role" value={newExp.role} onChange={(e) => setNewExp({...newExp, role: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input placeholder="Start Date" value={newExp.startDate} onChange={(e) => setNewExp({...newExp, startDate: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" />
                                <input placeholder="End Date" value={newExp.endDate} onChange={(e) => setNewExp({...newExp, endDate: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" />
                            </div>
                            <textarea placeholder="Description" value={newExp.description} onChange={(e) => setNewExp({...newExp, description: e.target.value})} className="w-full p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none h-24" />
                            <button 
                                onClick={() => {
                                    handleUpdate({ experience: [...user.experience, newExp] });
                                    setNewExp({ company: "", role: "", startDate: "", endDate: "", description: "" });
                                }}
                                className="w-full py-4 bg-brand-primary text-brand-surface rounded-2xl font-bold hover:bg-brand-secondary transition-all shadow-lg"
                            >
                                Save Experience
                            </button>
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="text-brand-accent" size={24} />
                            <h2 className="text-xl font-bold text-brand-primary uppercase tracking-widest text-sm">Education</h2>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {user.education.map((edu, i) => (
                            <EducationItem
                                key={i}
                                index={i}
                                edu={edu}
                                onRemove={(idx) => handleUpdate({ education: user.education.filter((_, index) => index !== idx) })}
                            />
                        ))}
                    </div>

                    <div className="bg-brand-background/50 p-8 rounded-3xl border border-dashed border-brand-secondary/30">
                        <h4 className="font-bold text-brand-primary mb-6">Add New Education</h4>
                        <div className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <input placeholder="School" value={newEdu.school} onChange={(e) => setNewEdu({...newEdu, school: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" />
                                <input placeholder="Degree" value={newEdu.degree} onChange={(e) => setNewEdu({...newEdu, degree: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input placeholder="Field of Study" value={newEdu.fieldOfStudy} onChange={(e) => setNewEdu({...newEdu, fieldOfStudy: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" />
                                <input placeholder="Graduation Year" value={newEdu.graduationYear} onChange={(e) => setNewEdu({...newEdu, graduationYear: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none" />
                            </div>
                            <button 
                                onClick={() => {
                                    handleUpdate({ education: [...user.education, newEdu] });
                                    setNewEdu({ school: "", degree: "", fieldOfStudy: "", graduationYear: "" });
                                }}
                                className="w-full py-4 bg-brand-primary text-brand-surface rounded-2xl font-bold hover:bg-brand-secondary transition-all shadow-lg"
                            >
                                Save Education
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </main>

      {/* Profile Picture Popup - Custom Modal implementation for better cross-browser compatibility */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={closePopup}>
          <div className="bg-brand-surface rounded-3xl p-8 shadow-2xl max-w-sm w-full outline-none animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="text-center">
                <h3 className="text-xl font-serif mb-6 text-brand-primary">Update Profile Picture</h3>
                
                <div className="relative w-32 h-32 mx-auto mb-8 bg-brand-background rounded-3xl overflow-hidden border border-brand-secondary/10">
                    {previewPFP ? (
                        <img src={previewPFP} alt="Preview" className="w-full h-full object-cover" />
                    ) : user.profilePic ? (
                        <img src={user.profilePic} alt="Current" className="w-full h-full object-cover opacity-50" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-secondary/20">
                            <User size={48} />
                        </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-brand-primary/0 hover:bg-brand-primary/20 transition-colors group">
                        <input type="file" accept="image/*" onChange={handlePFPChange} className="hidden" />
                        <Camera size={24} className="text-brand-surface opacity-0 group-hover:opacity-100 transition-opacity" />
                    </label>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={handlePFPUpload}
                        disabled={!PFPFile}
                        className="w-full py-3 bg-brand-primary text-brand-surface rounded-xl font-bold hover:bg-brand-secondary disabled:opacity-50 transition-all shadow-md"
                    >
                        Upload Photo
                    </button>
                    <button 
                        onClick={closePopup}
                        className="w-full py-3 text-brand-secondary font-bold hover:text-brand-primary transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
