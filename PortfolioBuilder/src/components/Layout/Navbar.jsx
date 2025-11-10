import React from 'react';
import { Briefcase, User, Settings, Eye, LogOut } from 'lucide-react';
import { logout } from '../../services/auth.service';
import '../../styles/navbar.css';

const Navbar = ({ activeTab, setActiveTab, onPreview }) => {
  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">Portfolio Builder</div>
      <div className="nav-menu">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          <Briefcase size={18} /> Dashboard
        </button>
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => setActiveTab('profile')}
        >
          <User size={18} /> Profile
        </button>
        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          <Settings size={18} /> Projects
        </button>
        <button onClick={onPreview}>
          <Eye size={18} /> Preview
        </button>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;