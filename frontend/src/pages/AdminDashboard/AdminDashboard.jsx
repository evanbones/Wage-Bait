import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Users, FileText, Activity, Search, Trash2, Power, PowerOff, Mail, TrendingUp, DollarSign, Briefcase, Globe, UserPlus, PlusCircle, MessageCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend } from 'recharts';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [insights, setInsights] = useState(null);
    const [userSearch, setUserSearch] = useState('');
    const [jobSearch, setJobSearch] = useState('');
    const [activeTab, setActiveTab] = useState('users'); // 'users', 'jobs', or 'insights'

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
            const adminId = currentUser._id || currentUser.id;
            const [usersRes, jobsRes, insightsRes] = await Promise.all([
                fetch(`http://localhost:8000/api/admin/users?q=${userSearch}`),
                fetch(`http://localhost:8000/api/search?q=${jobSearch}`),
                fetch(`http://localhost:8000/api/admin/insights?adminId=${adminId}`)
            ]);
            
            if (usersRes.ok && jobsRes.ok && insightsRes.ok) {
                const usersData = await usersRes.json();
                const jobsData = await jobsRes.json();
                const insightsData = await insightsRes.json();
                setUsers(usersData);
                setJobs(jobsData);
                setInsights(insightsData);
            }
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'insights' && !insights) {
            fetchInsights();
        }
    }, [activeTab]);

    const fetchInsights = async () => {
        try {
            const adminId = currentUser._id || currentUser.id;
            const res = await fetch(`http://localhost:8000/api/admin/insights?adminId=${adminId}`);
            if (res.ok) {
                const data = await res.json();
                setInsights(data);
            }
        } catch (err) {
            console.error("Error fetching insights:", err);
        }
    };

    // refetch users when search changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (currentUser?.role === 'admin' && activeTab === 'users') {
                fetchUsers();
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [userSearch]);

    // refetch jobs when search changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (currentUser?.role === 'admin' && activeTab === 'jobs') {
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
        try {
            const response = await fetch(`http://localhost:8000/api/admin/users/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, adminId })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setUsers(users.map(u => u._id === userId ? { ...u, isActive: updatedUser.isActive } : u));
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (err) {
            console.error("Error toggling user status:", err);
        }
    };

    const deleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job posting?")) return;
        const adminId = currentUser._id || currentUser.id;

        try {
            const response = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: adminId })
            });

            if (response.ok) {
                setJobs(jobs.filter(j => j._id !== jobId));
            } else {
                const errorData = await response.json();
                alert(errorData.message);
            }
        } catch (err) {
            console.error("Error deleting job:", err);
        }
    };

    if (isLoading && users.length === 0) return <div className="min-h-screen flex items-center justify-center">Loading Admin Controls...</div>;

    const renderInsights = () => {
        if (!insights) return <div className="p-12 text-center">Loading insights...</div>;

        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Stats Grid 1 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-brand-secondary">
                            <TrendingUp className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Salary Gap</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">
                            ${Math.abs(insights.overall.salaryGap).toLocaleString()}
                        </p>
                        <p className="text-xs text-brand-secondary mt-1">
                            {insights.overall.salaryGap > 0 ? 'Offer > Request' : 'Request > Offer'}
                        </p>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-brand-secondary">
                            <Briefcase className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Bid Density</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">
                            {insights.overall.bidDensity.toFixed(1)}
                        </p>
                        <p className="text-xs text-brand-secondary mt-1">Avg bids per job</p>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-brand-secondary">
                            <Globe className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Remote Ratio</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">
                            {insights.overall.remoteRatio.toFixed(0)}%
                        </p>
                        <p className="text-xs text-brand-secondary mt-1">Remote listings</p>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-brand-secondary">
                            <DollarSign className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Avg. Bid</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">
                            ${Math.round(insights.overall.avgRequestedSalary).toLocaleString()}
                        </p>
                        <p className="text-xs text-brand-secondary mt-1">User expectations</p>
                    </div>
                </div>

                {/* Stats Grid 2: (Recent Activity) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-brand-secondary">
                            <UserPlus className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">New Users</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">
                            {insights.overall.newUsersThisWeek}
                        </p>
                        <p className="text-xs text-brand-secondary mt-1">Joined this week</p>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-brand-secondary">
                            <PlusCircle className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">New Jobs</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">
                            {insights.overall.newJobsToday}
                        </p>
                        <p className="text-xs text-brand-secondary mt-1">Posted today</p>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-brand-secondary">
                            <FileText className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">New Bids</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">
                            {insights.overall.newApplicationsToday}
                        </p>
                        <p className="text-xs text-brand-secondary mt-1">Submitted today</p>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center gap-3 mb-4 text-brand-secondary">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-wider">Discussions</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">
                            {insights.overall.newCommentsToday}
                        </p>
                        <p className="text-xs text-brand-secondary mt-1">Active today</p>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-brand-surface p-8 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <h3 className="text-xl font-serif font-bold text-brand-primary mb-6">Salary Market Trend (7 Days)</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={insights.timeSeries}>
                                    <defs>
                                        <linearGradient id="colorOffered" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorRequested" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                        formatter={(val) => [`$${Math.round(val).toLocaleString()}`, '']}
                                    />
                                    <Legend verticalAlign="top" height={36}/>
                                    <Area type="monotone" dataKey="avgOffered" name="Avg. Offered" stroke="#1e293b" fillOpacity={1} fill="url(#colorOffered)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="avgRequested" name="Avg. Requested" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRequested)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-brand-surface p-8 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <h3 className="text-xl font-serif font-bold text-brand-primary mb-6">Category Performance</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={insights.categories} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                                    <XAxis type="number" xAxisId="salary" hide />
                                    <XAxis type="number" xAxisId="bids" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#1e293b', fontWeight: 'bold', fontSize: 11}} width={100} />
                                    <Tooltip 
                                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                        formatter={(val, name) => [name === 'avgSalary' ? `$${Math.round(val).toLocaleString()}` : val, name === 'avgSalary' ? 'Avg. Salary' : 'Total Bids']}
                                    />
                                    <Legend verticalAlign="top" height={36}/>
                                    <Bar dataKey="avgSalary" xAxisId="salary" name="Avg. Salary" fill="#1e293b" radius={[0, 4, 4, 0]} barSize={20} />
                                    <Bar dataKey="bidCount" xAxisId="bids" name="Total Bids" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={10} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="w-10 h-10 text-brand-accent" />
                    <h1 className="text-4xl font-serif font-bold text-brand-primary">Admin Dashboard</h1>
                </div>
                <div className="flex bg-brand-surface p-1 rounded-2xl border border-brand-secondary/10 shadow-sm">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2 rounded-xl transition-all font-bold text-sm ${activeTab === 'users' ? 'bg-brand-primary text-brand-surface shadow-md' : 'text-brand-secondary hover:text-brand-primary'}`}
                    >
                        Users
                    </button>
                    <button 
                        onClick={() => setActiveTab('jobs')}
                        className={`px-6 py-2 rounded-xl transition-all font-bold text-sm ${activeTab === 'jobs' ? 'bg-brand-primary text-brand-surface shadow-md' : 'text-brand-secondary hover:text-brand-primary'}`}
                    >
                        Jobs
                    </button>
                    <button 
                        onClick={() => setActiveTab('insights')}
                        className={`px-6 py-2 rounded-xl transition-all font-bold text-sm ${activeTab === 'insights' ? 'bg-brand-primary text-brand-surface shadow-md' : 'text-brand-secondary hover:text-brand-primary'}`}
                    >
                        Insights
                    </button>
                </div>
            </div>

            {activeTab !== 'insights' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-6 h-6 text-brand-secondary" />
                            <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">Total Users</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">{users.length}</p>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <FileText className="w-6 h-6 text-brand-secondary" />
                            <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">Total Jobs</span>
                        </div>
                        <p className="text-3xl font-bold text-brand-primary">{jobs.length}</p>
                    </div>
                    <div className="bg-brand-surface p-6 rounded-3xl border border-brand-secondary/10 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <Activity className="w-6 h-6 text-brand-secondary" />
                            <span className="text-xs font-bold text-brand-accent uppercase tracking-wider">System Status</span>
                        </div>
                        <p className="text-xl font-bold text-green-600">Active</p>
                    </div>
                </div>
            )}

            {/* Search Bar (Hide on insights) */}
            {activeTab !== 'insights' && (
                <div className="relative mb-8 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-secondary" />
                    <input 
                        type="text"
                        placeholder={activeTab === 'users' ? "Search users by name or email..." : "Search jobs by title or company..."}
                        value={activeTab === 'users' ? userSearch : jobSearch}
                        onChange={(e) => activeTab === 'users' ? setUserSearch(e.target.value) : setJobSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-brand-surface border border-brand-secondary/20 rounded-xl focus:ring-2 focus:ring-brand-accent outline-none shadow-sm"
                    />
                </div>
            )}

            {/* Main Content Area */}
            {activeTab === 'insights' ? renderInsights() : (
                <div className="bg-brand-surface rounded-[2rem] border border-brand-secondary/10 shadow-sm overflow-hidden">
                    {activeTab === 'users' ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-brand-primary/[0.02]">
                                    <tr>
                                        <th className="px-6 py-5 text-sm font-bold text-brand-primary">User</th>
                                        <th className="px-6 py-5 text-sm font-bold text-brand-primary">Role</th>
                                        <th className="px-6 py-5 text-sm font-bold text-brand-primary">Status</th>
                                        <th className="px-6 py-5 text-sm font-bold text-brand-primary text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-secondary/10">
                                    {users.map(user => (
                                        <tr key={user._id || user.id} className="hover:bg-brand-primary/[0.01] transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {user.profilePic ? (
                                                        <img src={user.profilePic} className="w-10 h-10 rounded-full object-cover border border-brand-secondary/10" alt="" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-brand-accent-light flex items-center justify-center text-brand-primary font-bold">
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
                                                <span className={`flex items-center gap-1 text-sm font-bold ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                                    {user.isActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                                                    {user.isActive ? 'Active' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => toggleUserStatus(user._id || user.id)}
                                                    disabled={(user._id || user.id) === (currentUser._id || currentUser.id)}
                                                    className={`p-2 rounded-xl transition-all ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'} disabled:opacity-20 cursor-pointer`}
                                                    title={user.isActive ? "Disable User" : "Enable User"}
                                                >
                                                    {user.isActive ? <PowerOff className="w-5 h-5" /> : <Power className="w-5 h-5" />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-brand-primary/[0.02]">
                                    <tr>
                                        <th className="px-6 py-5 text-sm font-bold text-brand-primary">Job Posting</th>
                                        <th className="px-6 py-5 text-sm font-bold text-brand-primary">Company</th>
                                        <th className="px-6 py-5 text-sm font-bold text-brand-primary">Salary</th>
                                        <th className="px-6 py-5 text-sm font-bold text-brand-primary text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-brand-secondary/10">
                                    {jobs.map(job => (
                                        <tr key={job._id} className="hover:bg-brand-primary/[0.01] transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-brand-primary">{job.title}</p>
                                                <p className="text-sm text-brand-secondary">{job.location}</p>
                                            </td>
                                            <td className="px-6 py-4 text-brand-primary font-medium">{job.company}</td>
                                            <td className="px-6 py-4 font-bold text-brand-accent">${job.salary.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => deleteJob(job._id)}
                                                    className="p-2 text-brand-secondary hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Remove Posting"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {(activeTab === 'users' ? users.length : jobs.length) === 0 && (
                        <div className="p-20 text-center text-brand-secondary italic font-serif">
                            No results found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
