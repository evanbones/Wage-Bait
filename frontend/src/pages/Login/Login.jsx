import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, User, Lock, ArrowRight, AlertCircle } from "lucide-react";
import Header from "../../components/Header/Header.jsx";
import ActionButton from "../../components/ActionButton/ActionButton.jsx";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    
    if (!username || !password) {
      setMessage("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      
      if (response.ok && data.message === "Login successful") {
        localStorage.setItem('user', JSON.stringify(data.receivedData));
        navigate("/");
      } else {
        setMessage(data.message || "Invalid credentials");
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
      
      <div className="grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-brand-surface rounded-4xl shadow-2xl shadow-brand-primary/5 border border-brand-secondary/10 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-brand-accent-light rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <LogIn size={32} className="text-brand-primary" />
              </div>
              <h1 className="text-4xl font-serif text-brand-primary mb-2">Welcome Back</h1>
              <p className="text-brand-secondary font-medium">Log in to your Wage Bait account</p>
            </div>

            {message && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100 animate-in shake duration-300">
                <AlertCircle size={18} />
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-brand-secondary uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-secondary/40" size={20} />
                  <input
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
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

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-brand-primary text-brand-surface py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-secondary transition-all shadow-xl shadow-brand-primary/10 group disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Login to Account"}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10 text-center text-sm">
              <span className="text-brand-secondary">Don't have an account?</span>
              <Link to="/register" className="ml-2 font-bold text-brand-primary hover:text-brand-accent transition-colors underline decoration-brand-accent decoration-2 underline-offset-4">
                Create one now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
