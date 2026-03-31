import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, ClipboardList, AlertCircle, Bookmark } from 'lucide-react';
import { Card } from '../../components/ui/Card';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalNotices: 0,
    urgentNotices: 0,
    importantNotices: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon: Icon, variant }) => {
    const variants = {
      primary: 'bg-primary/10 text-primary',
      success: 'bg-success/10 text-success',
      error: 'bg-error/10 text-error',
      warning: 'bg-warning/10 text-warning',
    };

    return (
      <Card className="flex items-center gap-5 p-6 hover:shadow-md transition-shadow">
        <div className={`flex items-center justify-center w-14 h-14 rounded-xl shrink-0 ${variants[variant]}`}>
          <Icon size={28} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">{title}</p>
          <h3 className="text-3xl font-black mt-1 text-text-primary">{value}</h3>
        </div>
      </Card>
    );
  };

  const StatSkeleton = () => (
    <Card className="flex items-center gap-5 p-6 skeleton-pulse h-[116px] border-none shadow-none" />
  );

  if (loading) {
    return (
      <div className="p-4 space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-8 w-48 bg-border rounded-md" />
          <div className="h-4 w-64 bg-border rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <StatSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight text-text-primary">System Overview</h1>
        <p className="text-text-secondary mt-2 text-sm">Real-time statistics for your notice board</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          variant="primary" 
        />
        <StatCard 
          title="Total Notices" 
          value={stats.totalNotices} 
          icon={ClipboardList} 
          variant="success" 
        />
        <StatCard 
          title="Urgent Alerts" 
          value={stats.urgentNotices} 
          icon={AlertCircle} 
          variant="error" 
        />
        <StatCard 
          title="Important" 
          value={stats.importantNotices} 
          icon={Bookmark} 
          variant="warning" 
        />
      </div>

      <div className="mt-12">
        <Card className="p-16 flex flex-col items-center justify-center border-dashed border-2 border-border bg-transparent shadow-none group hover:border-primary/50 transition-colors">
          <div className="p-4 rounded-full bg-bg text-text-secondary mb-4 group-hover:text-primary transition-colors">
            <ClipboardList size={40} strokeWidth={1} />
          </div>
          <h4 className="text-lg font-bold text-text-primary">Advanced Analytics</h4>
          <p className="text-text-secondary mt-2 text-sm max-w-sm text-center">
            Insights on user engagement and notice reach are currently being processed. Full report coming soon.
          </p>
        </Card>
      </div>
    </div>
  );
}

