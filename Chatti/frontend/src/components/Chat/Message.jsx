import React from 'react';

const Message = ({ message, isOwn }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = () => {
    if (message.fileType === 'image') {
      return (
        <div className="message-image">
          <img src={message.fileUrl} alt={message.fileName} />
          {message.content !== 'Sent a file' && (
            <p className="image-caption">{message.content}</p>
          )}
        </div>
      );
    } else if (message.fileType === 'file') {
      return (
        <div className="message-file">
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="file-link"
          >
        {message.fileName}
          </a>
          {message.content !== 'Sent a file' && <p>{message.content}</p>}
        </div>
      );
    } else {
      return <p className="message-text">{message.content}</p>;
    }
  };

  return (
    <div className={`message ${isOwn ? 'message-own' : 'message-other'}`}>
      {!isOwn && (
        <img
          src={message.sender.avatar}
          alt={message.sender.name}
          className="message-avatar"
        />
      )}
      <div className="message-content">
        {!isOwn && <span className="message-sender">{message.sender.name}</span>}
        {renderContent()}
        <span className="message-time">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
};

export default Message;