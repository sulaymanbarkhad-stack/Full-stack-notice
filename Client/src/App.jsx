import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageNotices from './pages/admin/ManageNotices';
import CreateNotice from './pages/admin/CreateNotice';
import UpdateNotice from './pages/admin/UpdateNotice';
import ManageUsers from './pages/admin/ManageUsers';
import AdminProfile from './pages/admin/AdminProfile';
import Profile from './pages/Profile';
import { ToastProvider } from './components/ui/Toast';
import './App.css';

function App() {
  return (
    <div className="App-Container">
      <ToastProvider>
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="manage" element={<ManageNotices />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="create" element={<CreateNotice />} />
            <Route path="update/:id" element={<UpdateNotice />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
      </ToastProvider>
    </div>
  );
}

export default App;
