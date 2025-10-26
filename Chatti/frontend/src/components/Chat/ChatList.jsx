import React from 'react';

const ChatList = ({ chats, onSelectChat, selectedChat, currentUser }) => {
  const getChatName = (chat) => {
    if (chat.isGroupChat) {
      return chat.chatName;
    }
    const otherUser = chat.users.find((u) => u._id !== currentUser._id);
    return otherUser?.name || 'Unknown User';
  };

  const getChatAvatar = (chat) => {
    if (chat.isGroupChat) {
      return chat.groupAvatar || 'https://via.placeholder.com/50';
    }
    const otherUser = chat.users.find((u) => u._id !== currentUser._id);
    return otherUser?.avatar || 'https://via.placeholder.com/50';
  };

  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`chat-list-item ${
            selectedChat?._id === chat._id ? 'active' : ''
          }`}
          onClick={() => onSelectChat(chat)}
        >
          <img
            src={getChatAvatar(chat)}
            alt={getChatName(chat)}
            className="chat-avatar"
          />
          <div className="chat-details">
            <h4>{getChatName(chat)}</h4>
            {chat.latestMessage && (
              <p className="latest-message">
                {chat.latestMessage.sender.name}:{' '}
                {chat.latestMessage.content.substring(0, 30)}
                {chat.latestMessage.content.length > 30 ? '...' : ''}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;