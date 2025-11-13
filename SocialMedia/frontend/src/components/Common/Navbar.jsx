// ========================================
// FILE: src/components/Common/Navbar.jsx
// RESPONSIVE VERSION WITH LUCIDE ICONS
// ========================================
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import API from '../../utils/api';
import { Bell, Home, MessageSquareMore, LogOut, Menu, X, Search } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { notifications } = useContext(SocketContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const { data } = await API.get(`/users/search?query=${query}`);
        setSearchResults(data);
      } catch (err) {
        console.error('Error searching:', err);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeAll = () => {
    setSearchQuery('');
    setSearchResults([]);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo" onClick={closeAll}>
          SocialApp
        </Link>

        {/* Desktop Search */}
        <div className="nav-search desktop-search">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(result => (
                <Link
                  key={result._id}
                  to={`/profile/${result._id}`}
                  className="search-result-item"
                  onClick={closeAll}
                >
                  <img src={result.profilePicture} alt={result.username} />
                  <span>{result.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Search Button */}
        <button 
          className="mobile-search-btn"
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Toggle search"
        >
          <Search size={20} />
        </button>

        {/* Hamburger Menu */}
        <button
          className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation Links */}
        <div className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
          <Link to="/" className="nav-link" onClick={closeAll}>
            <Home size={20} />
            <span className="link-text">Home</span>
          </Link>
          
          <Link to="/chat" className="nav-link" onClick={closeAll}>
            <MessageSquareMore size={20} />
            <span className="link-text">Messages</span>
          </Link>
          
          <Link to="/notifications" className="nav-link" onClick={closeAll}>
            <Bell size={20} />
            <span className="link-text">Notifications</span>
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </Link>
          
          <Link to={`/profile/${user.id}`} className="nav-link profile-link" onClick={closeAll}>
            <img src={user.profilePicture} alt={user.username} className="nav-avatar" />
            <span className="link-text">{user.username}</span>
          </Link>
          
          <button onClick={handleLogout} className="nav-link logout-btn">
            <LogOut size={20} />
            <span className="link-text">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="mobile-search-overlay">
          <div className="mobile-search-container">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              autoFocus
            />
            <button onClick={() => setSearchOpen(false)} className="close-search-btn">
              <X size={20} />
            </button>
          </div>
          {searchResults.length > 0 && (
            <div className="search-results">
              {searchResults.map(result => (
                <Link
                  key={result._id}
                  to={`/profile/${result._id}`}
                  className="search-result-item"
                  onClick={closeAll}
                >
                  <img src={result.profilePicture} alt={result.username} />
                  <span>{result.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div className="mobile-overlay" onClick={() => setMobileMenuOpen(false)} />}
    </nav>
  );
};

export default Navbar;