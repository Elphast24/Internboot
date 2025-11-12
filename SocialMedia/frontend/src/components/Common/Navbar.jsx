import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import API from '../../utils/api';
import {Bell, Home, MessageSquareMore} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { notifications } = useContext(SocketContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

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
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          SocialApp
        </Link>

        <div className="nav-search">
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
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                >
                  <img src={result.profilePicture} alt={result.username} />
                  <span>{result.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            <Home/> Home
          </Link>
          <Link to="/chat" className="nav-link">
            <MessageSquareMore/> Messages
          </Link>
          <Link to="/notifications" className="nav-link">
            <Bell/> Notifications
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </Link>
          <Link to={`/profile/${user.id}`} className="nav-link">
            <img src={user.profilePicture} alt={user.username} className="nav-avatar" />
          </Link>
          <button onClick={handleLogout} className="nav-link logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;