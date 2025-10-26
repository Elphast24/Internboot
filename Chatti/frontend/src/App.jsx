import React, { useState, useEffect } from 'react';
import { SocketProvider } from './context/SocketContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/Chat/ChatWindow';
import './App.css';
import './styles/Auth.css';
import './styles/Chat.css';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  // Handle chat selection - hide sidebar on mobile
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    // Hide sidebar on mobile when chat is selected
    if (window.innerWidth <= 768) {
      setShowSidebar(false);
    }
  };

  // Handle back to chats - show sidebar on mobile
  const handleBackToChats = () => {
    setShowSidebar(true);
    // Optionally deselect chat on mobile
    if (window.innerWidth <= 768) {
      setSelectedChat(null);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setSelectedChat(null);
    setShowSidebar(true);
  };

  if (!user) {
    return (
      <div className="app">
        {showLogin ? (
          <Login
            onSuccess={handleLoginSuccess}
            switchToRegister={() => setShowLogin(false)}
          />
        ) : (
          <Register
            onSuccess={handleLoginSuccess}
            switchToLogin={() => setShowLogin(true)}
          />
        )}
      </div>
    );
  }

  return (
    <SocketProvider>
      <div className="app">
        <div className="chat-container">
          <Sidebar
            user={user}
            onSelectChat={handleSelectChat}
            onLogout={handleLogout}
            selectedChat={selectedChat}
            showSidebar={showSidebar}
          />
          <ChatWindow 
            chat={selectedChat} 
            user={user}
            onBack={handleBackToChats}
            showChat={!showSidebar || window.innerWidth > 768}
          />
        </div>
      </div>
    </SocketProvider>
  );
}

export default App;
