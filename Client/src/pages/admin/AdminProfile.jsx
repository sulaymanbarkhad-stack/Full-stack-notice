import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, Mail, ShieldCheck, Camera } from 'lucide-react';
import { useToast } from '../../components/ui/Toast';

export default function AdminProfile() {
  const { addToast } = useToast();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

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
      const res = await axios.put(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api/auth/update/${user._id}`, formData, {
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
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      addToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Profile</h1>
        <p className="text-secondary mt-1">Manage your account details and security</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Column - Preview & Role */}
        <div className="flex-col gap-6">
          <Card style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto 1.5rem auto' }}>
              {preview ? (
                <img src={preview} alt="Avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--bg)' }} />
              ) : (
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={48} color="var(--text-secondary)" />
                </div>
              )}
              <label 
                htmlFor="avatar-upload" 
                style={{ 
                  position: 'absolute', bottom: '0', right: '0', 
                  backgroundColor: 'white', padding: '8px', borderRadius: '50%', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)', cursor: 'pointer', border: '1px solid var(--border)' 
                }}
              >
                <Camera size={16} color="var(--primary)" />
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                style={{ display: 'none' }}
                onChange={(e) => {
                  setAvatar(e.target.files[0]);
                  if (e.target.files[0]) setPreview(URL.createObjectURL(e.target.files[0]));
                }}
              />
            </div>
            <h3 className="text-xl font-bold">{user.name}</h3>
            <div className="flex items-center justify-center gap-2 mt-2 text-secondary">
              <ShieldCheck size={16} color="var(--success)" />
              <span className="text-sm font-medium" style={{ textTransform: 'uppercase' }}>{user.role}</span>
            </div>
          </Card>
        </div>

        {/* Right Column - Edit Form */}
        <Card>
          <form onSubmit={handleUpdate} className="flex-col gap-4">
            <Input 
              label="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <Input 
              label="Email Address" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input 
              label="New Password (Leave blank to keep current)" 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="mt-4">
              <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Updating...' : 'Save Profile Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
