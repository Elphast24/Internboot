import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const { data } = await API.get('/chats');
      setChats(data);
    } catch (err) {
      console.error('Error fetching chats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loader">Loading chats...</div>;
  }

  return (
    <div className="chat-list">
      <h2>Messages</h2>
      {chats.length === 0 ? (
        <p className="no-chats">No messages yet. Start a conversation!</p>
      ) : (
        <div className="chats">
          {chats.map(chat => {
            const otherUser = chat.participants[0];
            const lastMessage = chat.messages[chat.messages.length - 1];
            
            return (
              <Link
                key={chat._id}
                to={`/chat/${chat._id}`}
                className="chat-item"
              >
                <img src={otherUser.profilePicture} alt={otherUser.username} />
                <div className="chat-info">
                  <h4>{otherUser.username}</h4>
                  <p>{lastMessage?.content || 'No messages yet'}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatList;