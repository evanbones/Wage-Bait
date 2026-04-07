import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, FileText, Activity, Search, Trash2, Power, PowerOff, Mail, ShieldCheck } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [jobSearch, setJobSearch] = useState('');
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'jobs'

    const currentUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!currentUser || currentUser.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [usersRes, jobsRes] = await Promise.all([
                fetch(`http://localhost:8000/api/admin/users?q=${userSearch}`),
                fetch(`http://localhost:8000/api/search?q=${jobSearch}`)
            ]);
            
            if (usersRes.ok && jobsRes.ok) {
                const usersData = await usersRes.json();
                const jobsData = await jobsRes.json();
                setUsers(usersData);
                setJobs(jobsData);
            }
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // refetch users when search changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (currentUser?.role === 'admin') {
                fetchUsers();
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [userSearch]);

    // refetch jobs when search changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (currentUser?.role === 'admin') {
                fetchJobs();
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [jobSearch]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/admin/users?q=${userSearch}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data);
            }
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchJobs = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/search?q=${jobSearch}`);
            if (res.ok) {
                const data = await res.json();
                setJobs(data);
            }
        } catch (err) {
            console.error("Error fetching jobs:", err);
        }
    };

    const toggleUserStatus = async (userId) => {
        const adminId = currentUser._id || currentUser.id;
        console.log("Toggling status for user:", userId, "by admin:", adminId);
        try {
            const response = await fetch(`http://localhost:8000/api/admin/users/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, adminId })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log("User status updated successfully:", updatedUser);
                // Asynchronously update UI without refresh
                setUsers(users.map(u => u._id === userId ? { ...u, isActive: updatedUser.isActive } : u));
            } else {
                const errorData = await response.json();
                console.error("Failed to toggle user status:", errorData.message);
                alert(errorData.message);
            }
        } catch (err) {
            console.error("Error toggling user status:", err);
        }
    };

    const deleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job posting?")) return;
        const adminId = currentUser._id || currentUser.id;
        console.log("Deleting job:", jobId, "by admin:", adminId);

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: adminId })
            });

            if (response.ok) {
                console.log("Job deleted successfully");
                // Asynchronously update UI without refresh
                setJobs(jobs.filter(j => j._id !== jobId));
            } else {
                const errorData = await response.json();
                console.error("Failed to delete job:", errorData.message);
                alert(errorData.message);
            }
        } catch (err) {
            console.error("Error deleting job:", err);
        }
    };

    if (isLoading && users.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading Admin Controls...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="w-10 h-10 text-brand-accent" />
                    <h1 className="text-4xl font-serif font-bold text-brand-primary">Admin Dashboard</h1>
                </div>
                <div className="flex bg-brand-surface p-1 rounded-xl border border-brand-secondary/10">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2 rounded-lg transition-all ${activeTab === 'users' ? 'bg-brand-primary text-brand-surface shadow-md' : 'text-brand-secondary hover:text-brand-primary'}`}
                    >
                        Users
                    </button>
                    <button 
                        onClick={() => setActiveTab('jobs')}
                        className={`px-6 py-2 rounded-lg transition-all ${activeTab === 'jobs' ? 'bg-brand-primary text-brand-surface shadow-md' : 'text-brand-secondary hover:text-brand-primary'}`}
                    >
                        Jobs
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-brand-surface p-6 rounded-2xl border border-brand-secondary/10 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <Users className="w-6 h-6 text-brand-secondary" />
                        <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">Total Users</span>
                    </div>
                    <p className="text-3xl font-bold text-brand-primary">{users.length}</p>
                </div>
                <div className="bg-brand-surface p-6 rounded-2xl border border-brand-secondary/10 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <FileText className="w-6 h-6 text-brand-secondary" />
                        <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">Total Jobs</span>
                    </div>
                    <p className="text-3xl font-bold text-brand-primary">{jobs.length}</p>
                </div>
                <div className="bg-brand-surface p-6 rounded-2xl border border-brand-secondary/10 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <Activity className="w-6 h-6 text-brand-secondary" />
                        <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">System Status</span>
                    </div>
                    <p className="text-xl font-bold text-green-600">Active</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-8 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-secondary" />
                <input 
                    type="text"
                    placeholder={activeTab === 'users' ? "Search users by name or email..." : "Search jobs by title or company..."}
                    value={activeTab === 'users' ? userSearch : jobSearch}
                    onChange={(e) => activeTab === 'users' ? setUserSearch(e.target.value) : setJobSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none"
                />
            </div>

            {/* Content Table */}
            <div className="bg-brand-surface rounded-3xl border border-brand-secondary/10 shadow-sm overflow-hidden">
                {activeTab === 'users' ? (
                    <table className="w-full text-left">
                        <thead className="bg-brand-primary/5">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-brand-primary">User</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-primary">Role</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-primary">Status</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-primary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-secondary/10">
                            {users.map(user => (
                                <tr key={user._id || user.id} className="hover:bg-brand-primary/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {user.profilePic ? (
                                                <img src={user.profilePic} className="w-10 h-10 rounded-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-brand-primary">
                                                    {user.username[0].toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-brand-primary">{user.username}</p>
                                                <p className="text-sm text-brand-secondary flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center gap-1 text-sm ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {user.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                                            {user.isActive ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={(e) => toggleUserStatus(user._id || user.id)}
                                            disabled={(user._id || user.id) === (currentUser._id || currentUser.id)}
                                            className={`p-2 rounded-lg transition-all ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'} disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer relative z-10`}
                                            title={user.isActive ? "Disable User" : "Enable User"}
                                        >
                                            {user.isActive ? <PowerOff className="w-5 h-5 pointer-events-none" /> : <Power className="w-5 h-5 pointer-events-none" />}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-brand-primary/5">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-brand-primary">Job Posting</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-primary">Company</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-primary">Salary</th>
                                <th className="px-6 py-4 text-sm font-bold text-brand-primary text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-secondary/10">
                            {jobs.map(job => (
                                <tr key={job._id} className="hover:bg-brand-primary/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-brand-primary">{job.title}</p>
                                        <p className="text-sm text-brand-secondary">{job.location}</p>
                                    </td>
                                    <td className="px-6 py-4 text-brand-primary">{job.company}</td>
                                    <td className="px-6 py-4 font-mono text-brand-accent">${job.salary.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => deleteJob(job._id)}
                                            className="p-2 text-brand-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            title="Remove Posting"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {(activeTab === 'users' ? users.length : jobs.length) === 0 && (
                    <div className="p-12 text-center text-brand-secondary italic">
                        No results found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
