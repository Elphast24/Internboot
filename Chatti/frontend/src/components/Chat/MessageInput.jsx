import React, { useState, useRef } from 'react';

const MessageInput = ({ onSendMessage, onTyping }) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleChange = (e) => {
    setMessage(e.target.value);

    if (onTyping) {
      onTyping();

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        // Stop typing logic would go here
      }, 3000);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim() || selectedFile) {
      onSendMessage(message, selectedFile);
      setMessage('');
      setSelectedFile(null);
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="message-input-container">
      {(preview || selectedFile) && (
        <div className="file-preview">
          {preview ? (
            <img src={preview} alt="Preview" className="preview-image" />
          ) : (
            <div className="file-info">
              <span>📎 {selectedFile.name}</span>
            </div>
          )}
          <button className="remove-file" onClick={removeFile}>
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="message-input-form">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        />

        <button
          type="button"
          className="btn-attach"
          onClick={() => fileInputRef.current.click()}
        >
          📎
        </button>

        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Type a message..."
          className="message-input"
        />

        <button
          type="submit"
          className="btn-send"
          disabled={!message.trim() && !selectedFile}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;