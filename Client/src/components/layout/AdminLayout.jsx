import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, LogOut, Users, User as UserIcon, Menu, X, FileText } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-bg">
        <div className="text-center p-8 bg-surface rounded-xl shadow-lg border border-border max-w-sm">
          <div className="w-16 h-16 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={32} />
          </div>
          <h1 className="text-2xl font-black text-text-primary mb-2 tracking-tight">Access Denied</h1>
          <p className="text-text-secondary mb-6">Unauthorized access detected. Please return to safety.</p>
          <button 
            onClick={() => navigate('/')} 
            className="w-full py-2.5 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => 
    `flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 group ${
      isActive 
      ? 'bg-primary text-white shadow-md shadow-primary/20' 
      : 'text-text-secondary hover:bg-bg hover:text-primary'
    }`;

  return (
    <div className="flex flex-col md:flex-row h-screen bg-bg overflow-hidden">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-surface border-b border-border z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <FileText size={18} strokeWidth={2.5} />
          </div>
          <span className="font-black text-lg tracking-tighter text-text-primary uppercase">NoticeBoard</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 border border-border rounded-lg bg-bg hover:bg-surface transition-colors"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-text-primary/40 backdrop-blur-sm z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 w-[280px] bg-surface border-r border-border flex flex-col z-45 transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
              <FileText size={22} strokeWidth={2.5} />
            </div>
            <span className="font-black text-xl tracking-tighter text-text-primary">NOTICE BOARD</span>
          </div>
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.2em] opacity-50 ml-1">Management Portal</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavLink to="/admin" end className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
            <LayoutDashboard size={20} strokeWidth={2} /> 
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/manage" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
            <List size={20} strokeWidth={2} /> 
            <span>Manage Notices</span>
          </NavLink>
          <NavLink to="/admin/create" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
            <PlusCircle size={20} strokeWidth={2} /> 
            <span>Create Notice</span>
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClass} onClick={() => setIsSidebarOpen(false)}>
            <Users size={20} strokeWidth={2} /> 
            <span>Manage Users</span>
          </NavLink>
          
          <div className="my-6 pt-6 border-t border-border">
            <label className="px-4 text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-4 opacity-50">Quick Links</label>
            <NavLink to="/" className={navLinkClass}>
              <FileText size={20} strokeWidth={2} className="opacity-60" /> 
              <span>View Live Site</span>
            </NavLink>
          </div>
        </nav>

        <div className="p-6 bg-bg/50 border-t border-border mt-auto">
          <NavLink 
            to="/admin/profile" 
            onClick={() => setIsSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 mb-6 px-2 p-2 rounded-xl transition-all duration-200 group ${
              isActive ? 'bg-surface shadow-sm ring-1 ring-border' : 'hover:bg-surface/50'
            }`}
          >
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-surface object-cover shadow-sm group-hover:border-primary/20 transition-colors" 
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-secondary font-bold shadow-inner group-hover:border-primary/20 transition-colors">
                <UserIcon size={20} />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-sm text-text-primary truncate group-hover:text-primary transition-colors">{user.name}</p>
              <p className="text-[10px] font-bold text-success uppercase tracking-widest">Admin Access</p>
            </div>
          </NavLink>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-sm text-error hover:bg-error/10 transition-colors group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> 
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-bg custom-scrollbar">
        <div className="max-w-[1200px] mx-auto p-6 md:p-10 lg:p-14">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

