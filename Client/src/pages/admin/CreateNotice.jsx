import { useToast } from '../../components/ui/Toast';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import axios from 'axios';

export default function CreateNotice() {
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [isImportant, setIsImportant] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('createdBy', user._id);
      formData.append('category', category);
      formData.append('isImportant', isImportant);
      if (image) {
        formData.append('image', image);
      }

      await axios.post(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api/notices/create`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      addToast('Notice published successfully!');
      navigate('/admin/manage');
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to create notice', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary tracking-tight">Create New Notice</h1>
        <p className="text-text-secondary mt-1">Broadcast an announcement to the entire board.</p>
      </div>

      <Card className="p-0 overflow-hidden border-none shadow-xl shadow-primary/5">
        <form onSubmit={handleCreate} className="flex flex-col">
          <div className="p-8 space-y-6">
            <Input 
              label="Notice Title" 
              placeholder="e.g., Annual Staff Meeting"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg font-bold"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-text-primary ml-1">Description</label>
              <textarea
                className="w-full p-4 rounded-xl border border-border bg-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all min-h-[160px] resize-none text-sm leading-relaxed"
                placeholder="What is this notice about? Provide clear details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-text-primary ml-1">Category</label>
                <select 
                  className="w-full p-3 rounded-xl border border-border bg-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm font-medium appearance-none cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="general">General Announcement</option>
                  <option value="event">Upcoming Event</option>
                  <option value="urgent">Urgent / Action Required</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-3 bg-bg/50 rounded-xl border border-dashed border-border hover:border-primary transition-colors cursor-pointer group">
                <input 
                  type="checkbox" 
                  id="isImportant"
                  checked={isImportant} 
                  onChange={(e) => setIsImportant(e.target.checked)} 
                  className="w-5 h-5 rounded-md border-border text-primary focus:ring-primary transition-all cursor-pointer"
                />
                <label htmlFor="isImportant" className="text-sm font-bold text-text-primary cursor-pointer select-none group-hover:text-primary transition-colors">
                  Priority Announcement
                </label>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-text-primary ml-1 block">
                Cover Image
              </label>
              
              {!previewUrl ? (
                <div className="relative group">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center gap-3 group-hover:border-primary group-hover:bg-primary/5 transition-all duration-300">
                    <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center text-text-secondary group-hover:text-primary transition-colors">
                      <Upload size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-text-primary">Click to upload or drag and drop</p>
                      <p className="text-xs text-text-secondary mt-1">PNG, JPG or WEBP (Max. 5MB)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-border bg-bg group">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="absolute inset-0 bg-text-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      type="button" 
                      onClick={removeImage}
                      className="bg-error text-white p-3 rounded-full shadow-xl hover:scale-110 transition-transform"
                      title="Remove image"
                    >
                      <X size={20} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border text-[10px] font-black uppercase tracking-widest text-text-primary flex items-center gap-2">
                    <ImageIcon size={12} className="text-primary" />
                    Image Preview
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="p-8 bg-bg/50 border-t border-border flex items-center justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin/manage')}
              className="px-6 border-none text-text-secondary hover:text-text-primary hover:bg-transparent"
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-8 shadow-lg shadow-primary/25 relative overflow-hidden group"
            >
              <span className={loading ? 'opacity-0' : 'opacity-100 transition-opacity'}>
                Publish Notice
              </span>
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

