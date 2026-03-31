import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useToast } from '../components/ui/Toast';

export default function Register() {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api/auth/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      addToast('Account created successfully! Welcome.', 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      const serverMsg = err.response?.data?.message || 'Failed to register';
      setError(serverMsg);
      addToast(serverMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-bg">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-border/50">
          <div className="text-center mb-8">
            <div className="inline-flex p-3.5 rounded-full bg-primary/10 text-primary mb-4">
              <UserPlus size={28} />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Create Account</h2>
            <p className="text-text-secondary mt-1 text-sm">Join us to view and post notices</p>
          </div>

          <form onSubmit={handleRegister} className="flex flex-col">
            {error && (
              <div className="p-3 bg-error/10 text-error rounded-md mb-6 text-sm font-medium border border-error/20">
                {error}
              </div>
            )}
            
            <Input 
              label="Full Name" 
              type="text" 
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Input 
              label="Email Address" 
              type="email" 
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />

            <div className="mb-6">
              <label className="text-sm font-medium text-text-primary block mb-1.5">
                Profile Avatar (Optional)
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-surface hover:bg-bg transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-text-secondary">
                    <p className="mb-2 text-sm">
                      <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs">PNG, JPG or GIF (max. 2MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => setAvatar(e.target.files[0])}
                  />
                </label>
              </div>
              {avatar && (
                <p className="mt-2 text-xs text-success font-medium flex items-center gap-1">
                  Selected: {avatar.name}
                </p>
              )}
            </div>

            <Button type="submit" fullWidth disabled={loading} className="py-3 text-base">
              {loading ? 'Creating...' : 'Sign Up'}
            </Button>
            
            <div className="text-center mt-8 text-sm">
              <span className="text-text-secondary">Already have an account? </span>
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

