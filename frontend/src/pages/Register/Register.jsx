import React, { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, User, Mail, Lock, Camera, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import Header from "../../components/Header/Header.jsx";

function Register() {
  const dialogRef = useRef(null);
  const [PFPFile, setPFPFile] = useState(null);
  const [previewPFP, setPreviewPFP] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const openPopup = () => dialogRef.current.showModal();
  const closePopup = () => dialogRef.current.close();

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
      setProfilePic(reader.result);
      setPreviewPFP(reader.result);
      setPFPFile(null);
      closePopup();
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!username || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields");
      return;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, profilePic })
      });
      const data = await response.json();
      
      if (response.ok && data.message === "Got yer data and saved it.") {
        localStorage.setItem('user', JSON.stringify(data.receivedData));
        setMessage("Registration successful!");
        setTimeout(() => navigate("/"), 1500);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex flex-col">
      <Header />
      
      <div className="grow flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl bg-brand-surface rounded-[2.5rem] shadow-2xl shadow-brand-primary/5 border border-brand-secondary/10 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-brand-accent-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <UserPlus size={32} className="text-brand-primary" />
              </div>
              <h1 className="text-4xl font-serif text-brand-primary mb-2">Create Account</h1>
              <p className="text-brand-secondary font-medium">Join the Wage Bait community today</p>
            </div>

            {message && (
              <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium border animate-in slide-in-from-top-2 ${
                message.includes("successful") 
                ? "bg-green-50 text-green-600 border-green-100" 
                : "bg-red-50 text-red-600 border-red-100"
              }`}>
                {message.includes("successful") ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex flex-col items-center mb-4">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-3xl bg-brand-background flex items-center justify-center text-brand-secondary overflow-hidden border-2 border-dashed border-brand-secondary/30 group-hover:border-brand-accent transition-colors">
                        {previewPFP ? (
                            <img src={previewPFP} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <User size={32} />
                        )}
                    </div>
                    <button 
                        type="button" 
                        onClick={openPopup}
                        className="absolute -bottom-2 -right-2 bg-brand-primary text-brand-surface p-2.5 rounded-xl shadow-lg hover:scale-110 transition-transform"
                    >
                        <Camera size={16} />
                    </button>
                </div>
                <span className="text-xs font-bold text-brand-secondary uppercase tracking-widest mt-4">Profile Photo</span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary/40" size={20} />
                    <input
                      type="text"
                      placeholder="johndoe"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full p-4 pl-12 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary/40" size={20} />
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 pl-12 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary/40" size={20} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 pl-12 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary/40" size={20} />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-4 pl-12 bg-brand-background border border-brand-secondary/10 rounded-2xl focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent outline-none transition-all font-medium"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary text-brand-surface py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/10 group disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Start Your Journey"}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 text-center text-sm">
              <span className="text-brand-secondary">Already have an account?</span>
              <Link to="/login" className="ml-2 font-bold text-brand-primary hover:text-brand-accent transition-colors underline decoration-brand-accent decoration-2 underline-offset-4">
                Log in instead
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* PFP Modal */}
      <dialog ref={dialogRef} className="bg-brand-surface rounded-3xl p-8 shadow-2xl backdrop:bg-brand-primary/40 backdrop:backdrop-blur-sm max-w-sm w-full outline-none">
        <div className="text-center">
            <h3 className="text-xl font-serif mb-6 text-brand-primary">Upload Profile Picture</h3>
            
            <div className="relative w-32 h-32 mx-auto mb-8 bg-brand-background rounded-3xl overflow-hidden border border-brand-secondary/10">
                {previewPFP ? (
                    <img src={previewPFP} alt="Preview" className="w-full h-full object-cover" />
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
                    Confirm Photo
                </button>
                <button 
                    onClick={() => {
                        setPreviewPFP(null);
                        setPFPFile(null);
                        closePopup();
                    }}
                    className="w-full py-3 text-brand-secondary font-bold hover:text-brand-primary transition-colors"
                >
                    Cancel
                </button>
            </div>
        </div>
      </dialog>
    </div>
  );
}

export default Register;
