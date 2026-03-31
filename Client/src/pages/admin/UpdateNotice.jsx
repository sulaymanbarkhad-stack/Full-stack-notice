import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useToast } from '../../components/ui/Toast';

export default function UpdateNotice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [isImportant, setIsImportant] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices/notices/${id}`);
      const notice = res.data;
      setTitle(notice.title);
      setDescription(notice.description);
      setCategory(notice.category);
      setIsImportant(notice.isImportant);
      setPreview(notice.image);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch notice details', 'error');
    } finally {
      setFetching(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('isImportant', isImportant);
      if (image) {
        formData.append('image', image);
      }

      await axios.put(`${import.meta.env.VITE_API_URL}/api/notices/update/${id}`, formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      });
      addToast('Notice updated successfully!');
      navigate('/admin/manage');
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to update notice', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-secondary">Loading notice details...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Update Notice</h1>
      <Card style={{ maxWidth: '600px', width: '100%' }} className="p-mobile-4">
        <form onSubmit={handleUpdate} className="flex-col gap-4">
          
          <Input 
            label="Notice Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Description</label>
            <textarea
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--surface)',
                outline: 'none',
                minHeight: '120px',
                resize: 'vertical'
              }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid-mobile-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>Category</label>
              <select 
                style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)', outline: 'none' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="general">General</option>
                <option value="event">Event</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginTop: '1.5rem', gap: '0.5rem' }} className="mb-4">
              <input 
                type="checkbox" 
                id="isImportant"
                checked={isImportant} 
                onChange={(e) => setIsImportant(e.target.checked)} 
                style={{ width: '16px', height: '16px' }}
              />
              <label htmlFor="isImportant" style={{ fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Mark as Important</label>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '0.375rem' }}>
              Current Image
            </label>
            {preview && (
              <img src={preview} alt="Preview" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }} />
            )}
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', display: 'block', marginBottom: '0.375rem' }}>
              Update Image (Optional)
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                setImage(e.target.files[0]);
                if (e.target.files[0]) {
                  setPreview(URL.createObjectURL(e.target.files[0]));
                }
              }}
              style={{ fontSize: '0.875rem' }}
            />
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin/manage')}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Notice'}</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
