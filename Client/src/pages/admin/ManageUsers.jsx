import { useEffect, useState } from 'react';
import axios from 'axios';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Trash2, User as UserIcon, Shield } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export default function ManageUsers() {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api/auth/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      addToast('Failed to fetch users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api/auth/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      addToast(err.response?.data?.message || 'Failed to delete user', 'error');
    }
  };

  const handlePromote = async (id) => {
    if (!window.confirm("Are you sure you want to promote this user to Admin?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api/auth/promote/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('User promoted to Admin successfully');
      fetchUsers();
    } catch (err) {
      console.error('Failed to promote user:', err);
      addToast(err.response?.data?.message || 'Failed to promote user', 'error');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-text-secondary font-medium animate-pulse">Loading directory...</p>
    </div>
  );

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-text-primary">Manage Users</h1>
        <p className="text-text-secondary mt-2 text-sm">View and manage all registered accounts</p>
      </div>

      <Card className="p-0 overflow-hidden border-border/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-bg border-b border-border">
                <th className="p-5 text-xs font-bold text-text-secondary uppercase tracking-wider">User</th>
                <th className="p-5 text-xs font-bold text-text-secondary uppercase tracking-wider">Email</th>
                <th className="p-5 text-xs font-bold text-text-secondary uppercase tracking-wider">Role</th>
                <th className="p-5 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-bg/40 transition-colors group">
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover border border-border group-hover:border-primary/50 transition-colors" 
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-border/40 flex items-center justify-center text-text-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <UserIcon size={20} />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-text-primary">{user.name}</p>
                        <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tight">UID: {user._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5 text-sm text-text-secondary font-medium">{user.email}</td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${user.role === 'admin' 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'bg-bg text-text-secondary border border-border'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      {user.role !== 'admin' && (
                        <Button 
                          variant="outline" 
                          onClick={() => handlePromote(user._id)} 
                          className="p-2 bg-success/5 border-success/20 hover:bg-success/10 group/btn"
                          title="Promote to Admin"
                        >
                          <Shield size={16} className="text-success group-hover/btn:scale-110 transition-transform" />
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={() => handleDelete(user._id)} 
                        className="p-2 bg-error/5 border-error/20 hover:bg-error/10 group/btn"
                        disabled={user.role === 'admin'}
                        title="Delete User"
                      >
                        <Trash2 size={16} className="text-error group-hover/btn:scale-110 transition-transform" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

