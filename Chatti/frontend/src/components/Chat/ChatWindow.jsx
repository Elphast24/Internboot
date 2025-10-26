import React, { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';
import { useSocket } from '../../context/SocketContext';
import Message from './Message';
import MessageInput from './MessageInput';

const ChatWindow = ({ chat, user, onBack, showChat }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (chat) {
      fetchMessages();
      if (socket) {
        socket.emit('join chat', chat._id);
      }
    }
  }, [chat]);

  useEffect(() => {
    if (socket) {
      socket.on('message received', (newMessage) => {
        if (!chat || chat._id !== newMessage.chat._id) {
          // Notification logic
        } else {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      socket.on('typing', () => setTyping(true));
      socket.on('stop typing', () => setTyping(false));

      return () => {
        socket.off('message received');
        socket.off('typing');
        socket.off('stop typing');
      };
    }
  }, [socket, chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    if (!chat) return;

    setLoading(true);
    try {
      const { data } = await axios.get(`/messages/${chat._id}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (content, file) => {
    try {
      const formData = new FormData();
      formData.append('chatId', chat._id);
      formData.append('content', content);

      if (file) {
        formData.append('file', file);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('/messages', formData, config);

      if (socket) {
        socket.emit('new message', data);
      }

      setMessages([...messages, data]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleTyping = () => {
    if (socket && chat) {
      socket.emit('typing', chat._id);
    }
  };

  const getChatName = () => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    const otherUser = chat.users.find((u) => u._id !== user._id);
    return otherUser?.name || 'Unknown User';
  };

  const getChatAvatar = () => {
    if (chat.isGroupChat) {
      return chat.groupAvatar || 'https://api.dicebear.com/9.x/initials/svg?seed=' + encodeURIComponent(chat.chatName);
    }
    const otherUser = chat.users.find((u) => u._id !== user._id);
    return otherUser?.avatar || 'https://api.dicebear.com/9.x/avataaars/svg?seed=Unknown';
  };

  if (!chat) {
    return (
      <div className={`chat-window ${showChat ? 'chat-window-visible' : 'chat-window-hidden'}`}>
        <div className="chat-window-empty">
          <h2>Welcome to Chat App</h2>
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`chat-window ${showChat ? 'chat-window-visible' : 'chat-window-hidden'}`}>
      <div className="chat-header">
        <button className="btn-back" onClick={onBack}>
          ← Back
        </button>
        <img src={getChatAvatar()} alt={getChatName()} className="chat-header-avatar" />
        <div className="chat-header-info">
          <h3>{getChatName()}</h3>
          {chat.isGroupChat && (
            <span className="group-members">
              {chat.users.length} members
            </span>
          )}
        </div>
      </div>

      <div className="messages-container">
        {loading ? (
          <div className="loading">Loading messages...</div>
        ) : (
          <>
            {messages.map((message) => (
              <Message
                key={message._id}
                message={message}
                isOwn={message.sender._id === user._id}
              />
            ))}
            {typing && <div className="typing-indicator">Typing...</div>}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <MessageInput onSendMessage={sendMessage} onTyping={handleTyping} />
    </div>
  );
};

export default ChatWindow;
