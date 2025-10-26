import React, { useState, useEffect } from 'react';
import axios from '../../utils/axios';const Sidebar = ({ user, onSelectChat, onLogout, selectedChat }) => {
const [chats, setChats] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);
const [loading, setLoading] = useState(false);
const [showCreateGroup, setShowCreateGroup] = useState(false);
const [groupName, setGroupName] = useState('');
const [selectedUsers, setSelectedUsers] = useState([]);useEffect(() => {
fetchChats();
}, []);const fetchChats = async () => {
try {
const { data } = await axios.get('/chats');
setChats(data);
} catch (error) {
console.error('Error fetching chats:', error);
}
};const handleSearch = async (query) => {
setSearchQuery(query);
if (query.trim() === '') {
setSearchResults([]);
return;
}setLoading(true);
try {
  const { data } = await axios.get(`/auth/users?search=${query}`);
  setSearchResults(data);
} catch (error) {
  console.error('Error searching users:', error);
} finally {
  setLoading(false);
}
};const accessChat = async (userId) => {
try {
const { data } = await axios.post('/chats', { userId });
if (!chats.find((chat) => chat._id === data._id)) {
setChats([data, ...chats]);
}
onSelectChat(data);
setSearchQuery('');
setSearchResults([]);
} catch (error) {
console.error('Error accessing chat:', error);
}
};const createGroupChat = async () => {
if (!groupName || selectedUsers.length < 2) {
alert('Please enter group name and select at least 2 users');
return;
}try {
  const { data } = await axios.post('/chats/group', {
    name: groupName,
    users: JSON.stringify(selectedUsers.map((user) => user._id)),
  });
  setChats([data, ...chats]);
  setShowCreateGroup(false);
  setGroupName('');
  setSelectedUsers([]);
  setSearchResults([]);
} catch (error) {
  console.error('Error creating group:', error);
}
};const toggleUserSelection = (user) => {
if (selectedUsers.find((u) => u._id === user._id)) {
setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
} else {
setSelectedUsers([...selectedUsers, user]);
}
};const getChatName = (chat) => {
if (chat.isGroupChat) {
return chat.chatName;
}
const otherUser = chat.users.find((u) => u._id !== user._id);
return otherUser?.name || 'Unknown User';
};const getChatAvatar = (chat) => {
if (chat.isGroupChat) {
return chat.groupAvatar || 'https://via.placeholder.com/50';
}
const otherUser = chat.users.find((u) => u._id !== user._id);
return otherUser?.avatar || 'https://via.placeholder.com/50';
};return (
<div className="sidebar">
<div className="sidebar-header">
<div className="user-info">
<img src={user.avatar} alt={user.name} className="avatar" />
<div>
<h3>{user.name}</h3>
<span className="user-status">Online</span>
</div>
</div>
<button className="btn-logout" onClick={onLogout}>
Logout
</button>
</div>  <div className="sidebar-search">
    <input
      type="text"
      placeholder="Search users..."
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
    />
    <button
      className="btn-group"
      onClick={() => setShowCreateGroup(!showCreateGroup)}
    >
      {showCreateGroup ? 'Cancel' : '+ Group'}
    </button>
  </div>  {showCreateGroup && (
    <div className="create-group">
      <input
        type="text"
        placeholder="Group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />
      {selectedUsers.length > 0 && (
        <div className="selected-users">
          {selectedUsers.map((user) => (
            <span key={user._id} className="user-badge">
              {user.name}
              <button onClick={() => toggleUserSelection(user)}>×</button>
            </span>
          ))}
        </div>
      )}
      <button className="btn-create-group" onClick={createGroupChat}>
        Create Group
      </button>
    </div>
  )}  {loading && <div className="loading">Searching...</div>}  {searchResults.length > 0 ? (
    <div className="search-results">
      {searchResults.map((searchUser) => (
        <div
          key={searchUser._id}
          className="search-result-item"
          onClick={() =>
            showCreateGroup
              ? toggleUserSelection(searchUser)
              : accessChat(searchUser._id)
          }
        >
          <img
            src={searchUser.avatar}
            alt={searchUser.name}
            className="avatar-small"
          />
          <div>
            <p className="user-name">{searchUser.name}</p>
            <p className="user-email">{searchUser.email}</p>
          </div>
          {showCreateGroup &&
            selectedUsers.find((u) => u._id === searchUser._id) && (
              <span className="checkmark">✓</span>
            )}
        </div>
      ))}
    </div>
  ) : (
    <div className="chats-list">
      {chats.map((chat) => (
        <div
          key={chat._id}
          className={`chat-item ${
            selectedChat?._id === chat._id ? 'active' : ''
          }`}
          onClick={() => onSelectChat(chat)}
        >
          <img
            src={getChatAvatar(chat)}
            alt={getChatName(chat)}
            className="avatar-small"
          />
          <div className="chat-info">
            <p className="chat-name">{getChatName(chat)}</p>
            {chat.latestMessage && (
              <p className="chat-latest">
                {chat.latestMessage.sender.name}:{' '}
                {chat.latestMessage.content.substring(0, 30)}...
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )}
</div>
);
};export default Sidebar;