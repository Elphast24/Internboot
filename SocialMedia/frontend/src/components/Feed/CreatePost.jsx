import React, { useState, useContext } from 'react';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { Camera } from 'lucide-react';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
  
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // get the auth token
      if (!token) {
        console.error('No token found. User is not authenticated.');
        setLoading(false);
        return;
      }
  
      const formData = new FormData();
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }
  
      const { data } = await API.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // ← send the token
        },
      });
  
      setContent('');
      setImage(null);
      setPreview(null);
      onPostCreated(data);
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="create-post">
      <div className="create-post-header">
        <img src={user.profilePicture} alt={user.username} className="avatar" />
        <h3>Create Post</h3>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          rows={4}
        />

        {preview && (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <button
              type="button"
              className="remove-image"
              onClick={() => {
                setImage(null);
                setPreview(null);
              }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="create-post-actions">
          <label className="image-upload-btn">
            <Camera/> Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>

          <button type="submit" disabled={loading || !content.trim()} className='post-btn'>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;