import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Plus, FileText, Search, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { formatRelativeTime } from '../utils/formatDate';

export default function Dashboard() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
    fetchNotices();
  }, [navigate]);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/notices/notices`);
      setNotices(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
      addToast('Failed to load notices. Please check your connection.', 'error');
      setNotices([]);
    } finally {
      // Simulate slightly longer load for premium feel of skeletons
      setTimeout(() => setLoading(false), 800);
    }
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    addToast('Logged out successfully');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="bg-surface border-b border-border sticky top-0 z-10 p-4">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 font-bold text-xl cursor-pointer"
            onClick={() => navigate('/')}
          >
            <FileText className="text-primary" /> 
            <span className="hidden md:block">NoticeBoard</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-2 cursor-pointer group" 
              onClick={() => navigate('/profile')}
              title="View my profile"
            >
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-border group-hover:border-primary transition-colors" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-[12px] font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="font-medium text-sm hidden md:block">{user.name}</span>
            </div>
            <Button variant="outline" onClick={handleLogout} className="px-3 py-1.5 text-xs">
              <LogOut size={14} className="hidden md:block" /> Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary">Board Notices</h1>
            <p className="text-text-secondary text-sm mt-1">Stay updated with latest announcements</p>
          </div>
          {user.role === 'admin' && (
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={() => navigate('/admin/manage')} className="flex-1 md:flex-none">
                Manage
              </Button>
              <Button onClick={() => navigate('/admin/create')} className="flex-1 md:flex-none">
                <Plus size={18} /> New
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filter Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondaryPointer" />
            <input 
              type="text" 
              placeholder="Search notices..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter size={16} className="text-text-secondary shrink-0" />
            <div className="flex gap-1 bg-surface p-1 rounded-lg border border-border shrink-0">
              {['all', 'general', 'event', 'urgent'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-all duration-200
                    ${selectedCategory === cat 
                      ? 'bg-bg text-primary shadow-sm' 
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg/50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
          </div>
        ) : filteredNotices.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="p-5 rounded-full bg-bg text-text-secondary mb-4">
              <Search size={40} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold text-text-primary">No notices found</h3>
            <p className="text-text-secondary mt-2 max-w-sm">
              We couldn't find any notices matching your criteria. Try adjusting your search or filters.
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <Button 
                variant="outline" 
                className="mt-6" 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              >
                Clear all filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotices.map((notice) => (
              <Card key={notice._id} className="flex flex-col h-full group hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide
                    ${notice.category === 'urgent' 
                      ? 'bg-error/10 text-error' 
                      : 'bg-primary/10 text-primary'}`}
                  >
                    {notice.category}
                  </span>
                  {notice.isImportant && (
                    <span className="text-[10px] font-bold text-warning uppercase">Important</span>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{notice.title}</h3>
                <p className="text-text-secondary text-sm mb-4 line-clamp-3 flex-grow">{notice.description}</p>
                
                {notice.image && (
                  <div className="mb-4 overflow-hidden rounded-md h-40">
                    <img 
                      src={notice.image} 
                      alt={notice.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                )}
                
                <div className="mt-auto pt-4 border-t border-border/50 text-[11px] font-medium text-text-secondary flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-border" />
                  {formatRelativeTime(notice.createdAt)}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

