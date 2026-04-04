import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import { Users, Mail, Code, Briefcase } from 'lucide-react';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="p-8 text-center text-brand-secondary font-sans">Loading users...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-sans font-medium">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-brand-background pb-12">
      <Header />
      <div className="max-w-5xl mx-auto mt-10 px-4">
        <div className="bg-brand-surface rounded-3xl shadow-soft p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <Users className="w-8 h-8 text-brand-primary" />
            <h2 className="text-3xl font-serif text-brand-primary">Registered Users</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 px-4 font-serif text-brand-secondary font-medium uppercase text-xs tracking-wider">Username</th>
                  <th className="py-4 px-4 font-serif text-brand-secondary font-medium uppercase text-xs tracking-wider">Email</th>
                  <th className="py-4 px-4 font-serif text-brand-secondary font-medium uppercase text-xs tracking-wider">Skills</th>
                  <th className="py-4 px-4 font-serif text-brand-secondary font-medium uppercase text-xs tracking-wider text-center">Experience</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-5 px-4 font-sans text-brand-primary font-medium">{user.username}</td>
                    <td className="py-5 px-4 font-sans text-brand-secondary flex items-center gap-2">
                      <Mail className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {user.email}
                    </td>
                    <td className="py-5 px-4 font-sans text-brand-secondary">
                      <div className="flex flex-wrap gap-1">
                        {user.skills.length > 0 ? (
                          user.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-0.5 bg-brand-accent-light text-brand-primary text-xs rounded-full">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 italic text-sm">No skills added</span>
                        )}
                      </div>
                    </td>
                    <td className="py-5 px-4 font-sans text-brand-primary text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm">
                        {user.experience.length}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
