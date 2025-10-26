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

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    setSelectedChat(null);
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
            onSelectChat={setSelectedChat}
            onLogout={handleLogout}
            selectedChat={selectedChat}
          />
          <ChatWindow chat={selectedChat} user={user} />
        </div>
      </div>
    </SocketProvider>
  );
}

export default App;