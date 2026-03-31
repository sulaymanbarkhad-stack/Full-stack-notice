import { Edit2, Trash2, Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../components/ui/Toast';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatRelativeTime } from '../../utils/formatDate';

export default function ManageNotices() {
  const { addToast } = useToast();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api/notices/notices`);
      setNotices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      addToast('Failed to fetch notices', 'error');
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this notice?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_URL?.replace(/\/$/, '')}/api/notices/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      addToast('Notice deleted successfully');
      fetchNotices();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete notice', 'error');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-text-secondary font-medium animate-pulse">Scanning notices...</p>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-text-primary">Manage Notices</h1>
          <p className="text-text-secondary mt-2 text-sm">Organize and refine the notice board content</p>
        </div>
        <Button onClick={() => navigate('/admin/create')} className="w-full md:w-auto shadow-md">
          <Plus size={18} /> Create New
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-3 mb-8 flex flex-col md:flex-row gap-4 items-center bg-surface border-border/50">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search by title..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-border bg-bg/30 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <Filter size={16} className="text-text-secondary hidden md:block" />
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 rounded-lg border border-border bg-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm font-medium cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="event">Event</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden border-border/50 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-bg border-b border-border">
                <th className="p-5 text-xs font-bold text-text-secondary uppercase tracking-wider">Notice Details</th>
                <th className="p-5 text-xs font-bold text-text-secondary uppercase tracking-wider">Category</th>
                <th className="p-5 text-xs font-bold text-text-secondary uppercase tracking-wider">Media</th>
                <th className="p-5 text-xs font-bold text-text-secondary uppercase tracking-wider">Timeline</th>
                <th className="p-5 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredNotices.map((notice) => (
                <tr key={notice._id} className="hover:bg-bg/40 transition-colors group">
                  <td className="p-5">
                    <div className="font-bold text-text-primary group-hover:text-primary transition-colors">{notice.title}</div>
                    {notice.isImportant && (
                      <span className="inline-flex mt-1 text-[9px] font-black bg-error/10 text-error px-1.5 py-0.5 rounded uppercase tracking-tighter">
                        Priority Alert
                      </span>
                    )}
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                      ${notice.category === 'urgent' 
                        ? 'bg-error/10 text-error border border-error/20' 
                        : 'bg-primary/10 text-primary border border-primary/20'}`}
                    >
                      {notice.category}
                    </span>
                  </td>
                  <td className="p-5">
                    {notice.image ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-border shadow-sm">
                        <img src={notice.image} alt="thumb" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-bg border border-border flex items-center justify-center text-[10px] text-text-secondary font-bold uppercase p-2 text-center leading-tight">
                        No Media
                      </div>
                    )}
                  </td>
                  <td className="p-5 text-sm text-text-secondary font-medium italic">
                    {formatRelativeTime(notice.createdAt)}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/admin/update/${notice._id}`)} 
                        className="p-2 border-border hover:border-primary/50 group/btn"
                        title="Edit Notice"
                      >
                        <Edit2 size={16} className="text-primary group-hover/btn:scale-110 transition-transform" />
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleDelete(notice._id)} 
                        className="p-2 bg-error/5 border-error/20 hover:bg-error/10 group/btn"
                        title="Delete Notice"
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
        
        {filteredNotices.length === 0 && (
          <div className="p-20 flex flex-col items-center justify-center text-center">
            <div className="p-5 bg-bg rounded-full text-text-secondary mb-4">
              <Search size={40} strokeWidth={1} />
            </div>
            <p className="text-text-primary font-bold text-lg">No matching results</p>
            <p className="text-text-secondary text-sm mt-1 max-w-xs">We couldn't find any notices that match your current search or filter.</p>
            {(searchQuery || selectedCategory !== 'all') && (
              <Button 
                variant="outline" 
                className="mt-6" 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

