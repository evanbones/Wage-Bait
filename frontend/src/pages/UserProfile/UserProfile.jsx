import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Briefcase, GraduationCap, Star, User, Activity, Mail, ArrowLeft } from "lucide-react";
import Header from "../../components/Header/Header";

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

const SkillItem = ({ skill }) => (
  <div className="flex items-center gap-2 bg-brand-background text-brand-primary px-3 py-1.5 rounded-xl border border-brand-secondary/10 transition-all hover:border-brand-accent hover:shadow-sm cursor-default">
    <span className="text-sm font-medium">{skill}</span>
  </div>
);

const ExperienceItem = ({ exp }) => (
  <div className="p-5 bg-brand-background/50 rounded-2xl border border-brand-secondary/5 transition-colors hover:bg-brand-background">
    <h4 className="text-base font-bold text-brand-primary">{exp.role}</h4>
    <p className="text-brand-secondary text-sm font-medium mb-2">{exp.company}</p>
    <div className="inline-block px-2 py-1 bg-brand-surface rounded-md text-xs text-brand-primary font-bold tracking-wider mb-3 shadow-sm border border-brand-secondary/5">
        {exp.startDate} - {exp.endDate}
    </div>
    <p className="text-sm text-brand-primary/80 leading-relaxed">{exp.description}</p>
  </div>
);

const EducationItem = ({ edu }) => (
  <div className="p-5 bg-brand-background/50 rounded-2xl border border-brand-secondary/5 transition-colors hover:bg-brand-background">
    <h4 className="text-base font-bold text-brand-primary">{edu.degree}</h4>
    <p className="text-brand-secondary text-sm font-medium mb-3">{edu.fieldOfStudy}</p>
    <div className="flex items-center justify-between pt-3 border-t border-brand-secondary/10">
        <span className="text-sm text-brand-primary font-bold">{edu.school}</span>
        <span className="text-xs text-brand-secondary font-bold uppercase tracking-widest bg-brand-surface px-2 py-1 rounded-md">Class of {edu.graduationYear}</span>
    </div>
  </div>
);

const UserProfile = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/username/${username}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-brand-background">
        <Header />
        <div className="max-w-7xl mx-auto p-12 flex justify-center">
            <div className="text-brand-secondary font-medium flex flex-col items-center gap-4">
                <Activity className="w-8 h-8 animate-spin text-brand-accent" />
                Loading profile...
            </div>
        </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-brand-background">
        <Header />
        <div className="text-red-500 p-12 text-center font-bold">
            User not found or an error occurred.
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-background pb-12">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* back button */}
        <Link to={-1} className="inline-flex items-center gap-2 text-sm font-bold text-brand-secondary hover:text-brand-primary transition-colors mb-6">
            <ArrowLeft size={16} /> Back
        </Link>

        {/* main header widget */}
        <div className="bg-brand-surface rounded-3xl p-8 shadow-sm border border-brand-secondary/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden mb-8">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent-light rounded-full blur-3xl opacity-30 -mr-20 -mt-20 pointer-events-none"></div>
            
            <div className="relative group shrink-0 z-10">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-brand-accent-light flex items-center justify-center text-brand-primary overflow-hidden border-4 border-brand-surface shadow-xl">
                    {user.profilePic ? (
                        <img src={user.profilePic} alt={user.username} className="w-full h-full object-cover" />
                    ) : (
                        <User size={56} className="text-brand-accent" />
                    )}
                </div>
            </div>
            
            <div className="text-center md:text-left flex-1 z-10">
                <h1 className="text-3xl md:text-4xl font-serif text-brand-primary mb-3">{user.username}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                    <span className={`text-sm font-bold px-3 py-1 rounded-lg flex items-center gap-1.5 border ${user.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span> 
                        {user.isActive ? 'Active Member' : 'Inactive Member'}
                    </span>
                    <a href={`mailto:${user.email}`} className="flex items-center gap-2 text-sm text-brand-secondary font-medium hover:text-brand-primary transition-colors bg-brand-background px-3 py-1 rounded-lg border border-brand-secondary/10">
                        <Mail size={14} /> Contact
                    </a>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* left column */}
            <div className="space-y-6">
                <WidgetCard title="Skills & Expertise" icon={Star}>
                    {user.skills && user.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {user.skills.map((skill) => (
                                <SkillItem key={skill} skill={skill} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-brand-background/50 rounded-xl border border-dashed border-brand-secondary/20">
                            <p className="text-brand-secondary italic text-sm">No skills listed yet.</p>
                        </div>
                    )}
                </WidgetCard>
            </div>

            {/* right column */}
            <div className="lg:col-span-2 space-y-6">
                
                <WidgetCard title="Work Experience" icon={Briefcase}>
                    {user.experience && user.experience.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.experience.map((exp, i) => (
                                <ExperienceItem key={i} exp={exp} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-brand-background/50 rounded-2xl border border-dashed border-brand-secondary/20">
                            <p className="text-brand-secondary italic text-sm">No experience listed yet.</p>
                        </div>
                    )}
                </WidgetCard>

                <WidgetCard title="Education History" icon={GraduationCap}>
                    {user.education && user.education.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.education.map((edu, i) => (
                                <EducationItem key={i} edu={edu} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-brand-background/50 rounded-2xl border border-dashed border-brand-secondary/20">
                            <p className="text-brand-secondary italic text-sm">No education listed yet.</p>
                        </div>
                    )}
                </WidgetCard>
                
            </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;