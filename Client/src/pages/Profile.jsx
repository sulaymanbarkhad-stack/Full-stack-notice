import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Mail, ShieldCheck, Camera, ArrowLeft } from 'lucide-react';
import { useToast } from '../components/ui/Toast';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (avatar) formData.append('avatar', avatar);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/update/${user._id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      // Update local storage and state
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      addToast('Profile updated successfully!');
      setPassword('');
      
      // Dispatch a storage event to update other components (like Dashboard header)
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="mb-8 flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="p-2.5 rounded-full"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">My Profile</h1>
          <p className="text-text-secondary text-sm mt-1">Manage your account details and security</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Preview & Role */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="flex flex-col items-center py-10">
            <div className="relative mb-6">
              {preview ? (
                <img 
                  src={preview} 
                  alt="Avatar" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-bg ring-1 ring-border shadow-md" 
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-bg border border-border flex items-center justify-center text-text-secondary shadow-inner">
                  <User size={56} strokeWidth={1.5} />
                </div>
              )}
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 p-2.5 bg-surface border border-border rounded-full shadow-lg cursor-pointer hover:bg-bg transition-colors group"
                title="Change Avatar"
              >
                <Camera size={18} className="text-primary group-hover:scale-110 transition-transform" />
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setAvatar(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
            <h3 className="text-xl font-bold text-text-primary">{user.name}</h3>
            <div className="flex items-center gap-2 mt-3 px-3 py-1 bg-bg border border-border rounded-full">
              <ShieldCheck size={16} className={user.role === 'admin' ? "text-success" : "text-text-secondary"} />
              <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">{user.role}</span>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">Account Information</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-text-secondary" />
                <span className="text-text-secondary truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck size={16} className="text-text-secondary" />
                <span className="text-text-secondary">Role: {user.role}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <div className="lg:col-span-2">
          <Card className="p-6 md:p-8">
            <h4 className="text-lg font-bold text-text-primary mb-6">Profile Settings</h4>
            <form onSubmit={handleUpdate} className="space-y-6">
              <Input 
                label="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="max-w-md"
              />
              
              <Input 
                label="Email Address" 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="max-w-md"
              />

              <Input 
                label="New Password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="max-w-md"
              />

              <div className="pt-4 border-t border-border mt-8">
                <Button type="submit" disabled={loading} className="w-full md:w-auto px-10 py-3 text-base">
                  {loading ? 'Saving Changes...' : 'Update Account'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}

