import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../utils/api';
import { SocketContext } from '../../context/SocketContext';
import { AuthContext } from '../../context/AuthContext';
import '../../styles/chat.css';

const ChatWindow = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState(null);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchChat();
    
    if (socket) {
      socket.emit('chat:join', chatId);
      
      socket.on('chat:newMessage', (message) => {
        setMessages(prev => [...prev, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off('chat:newMessage');
      }
    };
  }, [chatId, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChat = async () => {
    try {
      const { data } = await API.get(`/chats/${chatId}`);
      setMessages(data.messages);
      setOtherUser(data.participants.find(p => p._id !== user.id));
    } catch (err) {
      console.error('Error fetching chat:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    socket.emit('chat:message', {
      chatId,
      senderId: user.id,
      content: newMessage,
    });

    setNewMessage('');
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        {otherUser && (
          <>
            <img src={otherUser.profilePicture} alt={otherUser.username} />
            <h3>{otherUser.username}</h3>
          </>
        )}
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`message ${message.sender._id === user.id ? 'sent' : 'received'}`}
          >
            <img
              src={message.sender.profilePicture}
              alt={message.sender.username}
            />
            <div className="message-content">
              <p>{message.content}</p>
              <span className="message-time">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="message-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWindow;