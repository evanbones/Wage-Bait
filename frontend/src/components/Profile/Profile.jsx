import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { X, Camera, Plus, Trash2, Briefcase, GraduationCap, Star, Settings, User, Eye, Activity, CheckCircle } from "lucide-react";
import Header from "../Header/Header";
import ActionButton from "../ActionButton/ActionButton";

const WidgetCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-brand-surface rounded-3xl p-6 md:p-8 shadow-sm border border-brand-secondary/10 flex flex-col ${className}`}>
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-brand-secondary/10">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-accent-light rounded-xl text-brand-primary">
                    <Icon size={20} />
                </div>
                <h2 className="text-lg font-bold text-brand-primary">{title}</h2>
            </div>
        </div>
        <div className="flex-1">
            {children}
        </div>
    </div>
);

const SkillItem = ({ skill, onRemove }) => (
  <div className="flex items-center gap-2 bg-brand-background text-brand-primary px-3 py-1.5 rounded-xl border border-brand-secondary/10 group transition-all hover:border-brand-accent hover:shadow-sm">
    <span className="text-sm font-medium">{skill}</span>
    <X size={14} className="cursor-pointer text-brand-secondary hover:text-red-500 transition-colors" onClick={() => onRemove(skill)} />
  </div>
);

const ExperienceItem = ({ exp, onRemove, index }) => (
  <div className="relative p-5 bg-brand-background/50 rounded-2xl border border-brand-secondary/5 group transition-colors hover:bg-brand-background">
    <button 
      className="absolute top-4 right-4 p-1.5 text-brand-secondary hover:bg-red-50 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
      onClick={() => onRemove(index)}
    >
      <Trash2 size={16} />
    </button>
    <h4 className="text-base font-bold text-brand-primary pr-8">{exp.role}</h4>
    <p className="text-brand-secondary text-sm font-medium mb-2">{exp.company}</p>
    <div className="inline-block px-2 py-1 bg-brand-surface rounded-md text-xs text-brand-primary font-bold tracking-wider mb-3 shadow-sm border border-brand-secondary/5">
        {exp.startDate} - {exp.endDate}
    </div>
    <p className="text-sm text-brand-primary/80 leading-relaxed">{exp.description}</p>
  </div>
);

const EducationItem = ({ edu, onRemove, index }) => (
  <div className="relative p-5 bg-brand-background/50 rounded-2xl border border-brand-secondary/5 group transition-colors hover:bg-brand-background">
    <button 
      className="absolute top-4 right-4 p-1.5 text-brand-secondary hover:bg-red-50 hover:text-red-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
      onClick={() => onRemove(index)}
    >
      <Trash2 size={16} />
    </button>
    <h4 className="text-base font-bold text-brand-primary pr-8">{edu.degree}</h4>
    <p className="text-brand-secondary text-sm font-medium mb-3">{edu.fieldOfStudy}</p>
    <div className="flex items-center justify-between pt-3 border-t border-brand-secondary/10">
        <span className="text-sm text-brand-primary font-bold">{edu.school}</span>
        <span className="text-xs text-brand-secondary font-bold uppercase tracking-widest bg-brand-surface px-2 py-1 rounded-md">Class of {edu.graduationYear}</span>
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

  const getCompletionPercentage = () => {
      if(!user) return 0;
      let score = 0;
      if (user.profilePic) score += 25;
      if (user.skills && user.skills.length > 0) score += 25;
      if (user.experience && user.experience.length > 0) score += 25;
      if (user.education && user.education.length > 0) score += 25;
      return score;
  }

  if (loading) return (
    <div className="min-h-screen bg-brand-background">
        <Header />
        <div className="max-w-7xl mx-auto p-12 flex justify-center">
            <div className="animate-pulse text-brand-secondary font-medium flex flex-col items-center gap-4">
                <Activity className="w-8 h-8 animate-spin" />
                Loading your dashboard...
            </div>
        </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-brand-background text-red-500 p-12 text-center font-bold">
        Error: {error}
    </div>
  );

  const completionRate = getCompletionPercentage();

  return (
    <div className="min-h-screen bg-brand-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* main header / stats dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3 bg-brand-surface rounded-3xl p-8 shadow-sm border border-brand-secondary/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent-light rounded-full blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none"></div>
                
                <div className="relative group shrink-0 z-10">
                    <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-brand-accent-light flex items-center justify-center text-brand-primary overflow-hidden border-4 border-brand-surface shadow-xl">
                        {user.profilePic ? (
                            <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={56} className="text-brand-accent" />
                        )}
                    </div>
                    <button 
                        onClick={openPopup}
                        className="absolute -bottom-3 -right-3 bg-brand-primary text-brand-surface p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform group-hover:bg-brand-accent group-hover:text-brand-primary"
                    >
                        <Camera size={18} />
                    </button>
                </div>
                
                <div className="text-center md:text-left flex-1 z-10">
                    <h1 className="text-3xl md:text-4xl font-serif text-brand-primary mb-2">{user.username}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                        <span className="text-sm font-bold px-3 py-1 bg-green-50 text-green-600 rounded-lg flex items-center gap-1.5 border border-green-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                        </span>
                        <span className="text-sm text-brand-secondary font-medium">
                            {user.email}
                        </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                        <Link to={`/user/${user.username}`}>
                            <button className="flex items-center gap-2 px-4 py-2 bg-brand-background hover:bg-brand-secondary/10 border border-brand-secondary/20 rounded-xl text-sm font-bold text-brand-primary transition-colors">
                                <Eye size={16} /> Public View
                            </button>
                        </Link>
                        <Link to="/my-applications">
                            <ActionButton variant="outline" className="text-sm py-2">My Applications</ActionButton>
                        </Link>
                        <Link to="/my-postings">
                            <ActionButton variant="primary" className="text-sm py-2">My Postings</ActionButton>
                        </Link>
                    </div>
                </div>
            </div>

            {/* completion widget */}
            <div className="bg-brand-surface rounded-3xl p-8 shadow-sm border border-brand-secondary/10 flex flex-col justify-center items-center text-center">
                <h3 className="text-sm font-bold text-brand-secondary uppercase tracking-widest mb-4">Profile Strength</h3>
                <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-brand-background stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className={`${completionRate === 100 ? 'text-green-500' : 'text-brand-accent'} stroke-current`} strokeWidth="3" strokeDasharray={`${completionRate}, 100`} strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="absolute text-xl font-bold text-brand-primary">{completionRate}%</div>
                </div>
                <p className="text-xs text-brand-secondary font-medium">
                    {completionRate === 100 ? "All set! Looking great." : "Complete your profile to stand out!"}
                </p>
            </div>
        </div>

        {message && (
            <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-2xl border border-green-200 font-medium text-center flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
                <CheckCircle size={18} /> {message}
            </div>
        )}

        {/* dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* left column */}
            <div className="space-y-6">
                <WidgetCard title="Account Details" icon={Settings}>
                    <form onSubmit={handleAccountUpdate} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Username</label>
                            <input
                                value={accountData.username}
                                onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                                className="w-full p-3 bg-brand-background border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Email</label>
                            <input
                                type="email"
                                value={accountData.email}
                                onChange={(e) => setAccountData({ ...accountData, email: e.target.value })}
                                className="w-full p-3 bg-brand-background border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 pt-3 border-t border-brand-secondary/10">
                            <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest">Change Password</label>
                            <input
                                type="password"
                                placeholder="New password"
                                value={accountData.password}
                                onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                                className="w-full p-3 bg-brand-background border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all mb-2"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={accountData.confirmPassword}
                                onChange={(e) => setAccountData({ ...accountData, confirmPassword: e.target.value })}
                                className="w-full p-3 bg-brand-background border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all"
                            />
                        </div>
                        <button type="submit" className="w-full mt-2 py-3 bg-brand-primary text-brand-surface rounded-xl font-bold hover:bg-brand-secondary transition-all shadow-sm text-sm">
                            Save Changes
                        </button>
                    </form>
                </WidgetCard>

                <WidgetCard title="Skills" icon={Star}>
                    <div className="flex flex-wrap gap-2 mb-5">
                        {user.skills.length === 0 ? (
                            <span className="text-sm text-brand-secondary italic">No skills added yet.</span>
                        ) : (
                            user.skills.map((skill) => (
                                <SkillItem key={skill} skill={skill} onRemove={(s) => handleUpdate({ skills: user.skills.filter(sk => sk !== s) })} />
                            ))
                        )}
                    </div>
                    <div className="flex gap-2 relative">
                        <input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && newSkill) {
                                    handleUpdate({ skills: [...user.skills, newSkill] });
                                    setNewSkill("");
                                }
                            }}
                            placeholder="Type a skill and press enter..."
                            className="flex-1 p-3 bg-brand-background border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all pr-12"
                        />
                        <button 
                            onClick={() => {
                                if (!newSkill) return;
                                handleUpdate({ skills: [...user.skills, newSkill] });
                                setNewSkill("");
                            }}
                            className="absolute right-1 top-1 bottom-1 p-2 bg-brand-accent text-brand-primary rounded-lg hover:bg-brand-primary hover:text-brand-surface transition-all"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </WidgetCard>
            </div>

            {/* right column */}
            <div className="lg:col-span-2 space-y-6">
                
                <WidgetCard title="Work Experience" icon={Briefcase}>
                    {user.experience.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {user.experience.map((exp, i) => (
                                <ExperienceItem
                                    key={i}
                                    index={i}
                                    exp={exp}
                                    onRemove={(idx) => handleUpdate({ experience: user.experience.filter((_, index) => index !== idx) })}
                                />
                            ))}
                        </div>
                    )}

                    <div className="bg-brand-background/30 p-5 rounded-2xl border border-dashed border-brand-secondary/30">
                        <h4 className="text-sm font-bold text-brand-primary mb-4">Add New Role</h4>
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input placeholder="Company Name" value={newExp.company} onChange={(e) => setNewExp({...newExp, company: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all" />
                                <input placeholder="Job Title" value={newExp.role} onChange={(e) => setNewExp({...newExp, role: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input placeholder="Start Date (e.g. 2020)" value={newExp.startDate} onChange={(e) => setNewExp({...newExp, startDate: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all" />
                                <input placeholder="End Date (e.g. Present)" value={newExp.endDate} onChange={(e) => setNewExp({...newExp, endDate: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all" />
                            </div>
                            <textarea placeholder="Brief description of your responsibilities..." value={newExp.description} onChange={(e) => setNewExp({...newExp, description: e.target.value})} className="w-full p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm h-20 resize-none transition-all" />
                            <button 
                                onClick={() => {
                                    if(!newExp.company || !newExp.role) return alert("Company and Role are required.");
                                    handleUpdate({ experience: [...user.experience, newExp] });
                                    setNewExp({ company: "", role: "", startDate: "", endDate: "", description: "" });
                                }}
                                className="w-full sm:w-auto px-6 py-2.5 bg-brand-secondary/10 hover:bg-brand-primary text-brand-primary hover:text-brand-surface rounded-xl font-bold transition-all text-sm"
                            >
                                Add Experience
                            </button>
                        </div>
                    </div>
                </WidgetCard>

                <WidgetCard title="Education History" icon={GraduationCap}>
                    {user.education.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {user.education.map((edu, i) => (
                                <EducationItem
                                    key={i}
                                    index={i}
                                    edu={edu}
                                    onRemove={(idx) => handleUpdate({ education: user.education.filter((_, index) => index !== idx) })}
                                />
                            ))}
                        </div>
                    )}

                    <div className="bg-brand-background/30 p-5 rounded-2xl border border-dashed border-brand-secondary/30">
                        <h4 className="text-sm font-bold text-brand-primary mb-4">Add Institution</h4>
                        <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input placeholder="School / University" value={newEdu.school} onChange={(e) => setNewEdu({...newEdu, school: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all" />
                                <input placeholder="Degree (e.g. BS, BA)" value={newEdu.degree} onChange={(e) => setNewEdu({...newEdu, degree: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <input placeholder="Field of Study" value={newEdu.fieldOfStudy} onChange={(e) => setNewEdu({...newEdu, fieldOfStudy: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all" />
                                <input placeholder="Graduation Year" value={newEdu.graduationYear} onChange={(e) => setNewEdu({...newEdu, graduationYear: e.target.value})} className="p-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none text-sm transition-all" />
                            </div>
                            <button 
                                onClick={() => {
                                    if(!newEdu.school || !newEdu.degree) return alert("School and Degree are required.");
                                    handleUpdate({ education: [...user.education, newEdu] });
                                    setNewEdu({ school: "", degree: "", fieldOfStudy: "", graduationYear: "" });
                                }}
                                className="w-full sm:w-auto px-6 py-2.5 bg-brand-secondary/10 hover:bg-brand-primary text-brand-primary hover:text-brand-surface rounded-xl font-bold transition-all text-sm"
                            >
                                Add Education
                            </button>
                        </div>
                    </div>
                </WidgetCard>
            </div>
        </div>
      </main>

      {showPopup && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-brand-primary/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={closePopup}>
          <div className="bg-brand-surface rounded-3xl p-8 shadow-2xl max-w-sm w-full outline-none animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="text-center">
                <h3 className="text-xl font-serif mb-6 text-brand-primary">Update Picture</h3>
                
                <div className="relative w-32 h-32 mx-auto mb-8 bg-brand-background rounded-3xl overflow-hidden border border-brand-secondary/10 shadow-inner">
                    {previewPFP ? (
                        <img src={previewPFP} alt="Preview" className="w-full h-full object-cover" />
                    ) : user.profilePic ? (
                        <img src={user.profilePic} alt="Current" className="w-full h-full object-cover opacity-50" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-secondary/20">
                            <User size={48} />
                        </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-brand-primary/0 hover:bg-brand-primary/30 transition-colors group">
                        <input type="file" accept="image/*" onChange={handlePFPChange} className="hidden" />
                        <Camera size={28} className="text-brand-surface opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                    </label>
                </div>

                <div className="space-y-3">
                    <button 
                        onClick={handlePFPUpload}
                        disabled={!PFPFile}
                        className="w-full py-3 bg-brand-primary text-brand-surface rounded-xl font-bold hover:bg-brand-secondary disabled:opacity-50 transition-all shadow-md text-sm"
                    >
                        Save Photo
                    </button>
                    <button 
                        onClick={closePopup}
                        className="w-full py-3 text-brand-secondary font-bold hover:bg-brand-background rounded-xl transition-colors text-sm"
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