import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import axios from 'axios';

const Chat = () => {
  const { currentUser, logout } = useAuth();
  const socket = useSocket();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Create axios instance with auth header
  const getApi = () => {
    const token = localStorage.getItem('token');
    return axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  };

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const api = getApi();
        const response = await api.get('/chat');
        setChats(response.data);
      } catch (error) {
        console.error('Error fetching chats:', error);
        if (error.response?.status === 401) {
          // Token is invalid, logout user
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchChats();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  // Fetch messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;

      try {
        const api = getApi();
        const response = await api.get(`/chat/${selectedChat._id}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    socket.on('message received', (newMessage) => {
      if (selectedChat && selectedChat._id === newMessage.chat._id) {
        setMessages(prev => [...prev, newMessage]);
      }
      // Update chat list with latest message
      setChats(prev => prev.map(chat => 
        chat._id === newMessage.chat._id 
          ? { ...chat, latestMessage: newMessage }
          : chat
      ));
    });

    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));

    return () => {
      socket.off('message received');
      socket.off('typing');
      socket.off('stop typing');
    };
  }, [socket, selectedChat]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Search users
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const api = getApi();
        const response = await api.get(`/auth/search?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Create or access personal chat
  const startChat = async (userId) => {
    try {
      const api = getApi();
      const response = await api.post('/chat/personal', {
        userId
      });
      
      // Add to chats if not already there
      if (!chats.find(chat => chat._id === response.data._id)) {
        setChats(prev => [response.data, ...prev]);
      }
      
      setSelectedChat(response.data);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  // Create group chat
  const createGroupChat = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) {
      alert('Group name and at least 2 users are required');
      return;
    }

    try {
      const api = getApi();
      const response = await api.post('/chat/group', {
        chatName: groupName,
        users: selectedUsers.map(user => user._id)
      });

      setChats(prev => [response.data, ...prev]);
      setSelectedChat(response.data);
      setShowGroupModal(false);
      setGroupName('');
      setSelectedUsers([]);
    } catch (error) {
      console.error('Error creating group chat:', error);
    }
  };

  // Rest of your component remains the same...
  // [Keep all the other functions and JSX the same]
  // Toggle user selection for group
  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => 
      prev.find(u => u._id === user._id)
        ? prev.filter(u => u._id !== user._id)
        : [...prev, user]
    );
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const messageData = {
        content: newMessage.trim(),
        chatId: selectedChat._id
      };

      // For now, we'll just emit the socket event
      // In a real app, you'd also save to database
      const messageToSend = {
        _id: Date.now().toString(), // temporary ID
        content: newMessage.trim(),
        chat: selectedChat,
        sender: currentUser,
        createdAt: new Date()
      };

      socket.emit('new message', messageToSend);
      setMessages(prev => [...prev, messageToSend]);
      setNewMessage('');

      // Stop typing
      socket.emit('stop typing', selectedChat._id);
      setTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Handle typing
  const handleTyping = () => {
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }

    // Clear previous timeout
    const timer = setTimeout(() => {
      setTyping(false);
      socket.emit('stop typing', selectedChat._id);
    }, 3000);

    return () => clearTimeout(timer);
  };

  const getChatName = (chat) => {
    if (chat.isGroupChat) {
      return chat.chatName;
    } else {
      const otherUser = chat.users.find(user => user._id !== currentUser.id);
      return otherUser?.username || 'Unknown User';
    }
  };

  const getLastMessage = (chat) => {
    if (chat.latestMessage) {
      const content = chat.latestMessage.content;
      return content.length > 30 ? content.substring(0, 30) + '...' : content;
    }
    return 'No messages yet';
  };

  if (loading) {
    return (
      <div className="loading">
        <div>Loading chats...</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <div className="user-details">
              <div className="user-avatar">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="user-name">{currentUser?.username}</div>
                <div className="user-status">Online</div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          </div>
        </div>

        <button 
          className="new-chat-btn"
          onClick={() => setShowGroupModal(true)}
        >
          + New Group Chat
        </button>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {searchResults.length > 0 && (
          <div className="chat-list">
            {searchResults.map(user => (
              <div
                key={user._id}
                className="chat-item"
                onClick={() => startChat(user._id)}
              >
                <div className="chat-name">{user.username}</div>
                <div className="chat-last-message">Start conversation</div>
              </div>
            ))}
          </div>
        )}

        {searchResults.length === 0 && (
          <div className="chat-list">
            {chats.map(chat => (
              <div
                key={chat._id}
                className={`chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="chat-name">{getChatName(chat)}</div>
                <div className="chat-last-message">{getLastMessage(chat)}</div>
                {chat.isGroupChat && (
                  <div className="chat-type">Group</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        {selectedChat ? (
          <>
            <div className="chat-header">
              <h2>{getChatName(selectedChat)}</h2>
              {selectedChat.isGroupChat ? (
                <div className="chat-subtitle">
                  {selectedChat.users.length} members
                </div>
              ) : (
                <div className="chat-subtitle">Online</div>
              )}
            </div>

            <div className="chat-messages">
              {messages.map((message) => (
                <div
                  key={message._id}
                  className={`message ${message.sender._id === currentUser.id ? 'own' : 'other'}`}
                >
                  {message.sender._id !== currentUser.id && (
                    <div className="message-avatar">
                      {message.sender.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="message-bubble">
                    {message.sender._id !== currentUser.id && (
                      <div className="message-sender">
                        {message.sender.username}
                      </div>
                    )}
                    <div className="message-content">{message.content}</div>
                    <div className="message-time">
                      {new Date(message.createdAt).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="message other">
                  <div className="message-avatar">...</div>
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input-container">
              <form className="message-input-form" onSubmit={sendMessage}>
                <textarea
                  className="message-input"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  rows="1"
                />
                <button
                  type="submit"
                  className="send-btn"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="loading">
            <div>Select a chat to start messaging</div>
          </div>
        )}
      </div>

      {/* Group Chat Modal */}
      {showGroupModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Create Group Chat</h3>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Group name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search users to add..."
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            <div className="selected-users">
              {selectedUsers.map(user => (
                <div key={user._id} className="selected-user">
                  {user.username}
                  <button onClick={() => toggleUserSelection(user)}>×</button>
                </div>
              ))}
            </div>

            <div className="user-list">
              {searchResults.map(user => (
                <div
                  key={user._id}
                  className={`user-item ${selectedUsers.find(u => u._id === user._id) ? 'selected' : ''}`}
                  onClick={() => toggleUserSelection(user)}
                >
                  <div className="user-avatar-small">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-name">{user.username}</div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowGroupModal(false);
                  setSelectedUsers([]);
                  setGroupName('');
                }}
              >
                Cancel
              </button>
              <button 
                className="create-btn"
                onClick={createGroupChat}
                disabled={!groupName.trim() || selectedUsers.length < 2}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;