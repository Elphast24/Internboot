import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { Trash2 } from 'lucide-react';

const Post = ({ post, onDelete }) => {
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const { user } = useContext(AuthContext);

  const isLiked = likes.includes(user.id);

  const handleLike = async () => {
    try {
      const { data } = await API.put(`/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const { data } = await API.post(`/posts/${post._id}/comment`, {
        text: commentText,
      });
      setComments(data.comments);
      setCommentText('');
    } catch (err) {
      console.error('Error commenting:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${post._id}`);
        onDelete(post._id);
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <div className="post">
      <div className="post-header">
        <Link to={`/profile/${post.author._id}`} className="post-author">
          <img src={post.author.profilePicture} alt={post.author.username} />
          <div>
            <h4>{post.author.username}</h4>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </Link>
        
        {post.author._id === user.id && (
          <button className="delete-btn" onClick={handleDelete}>
            <Trash2/>
          </button>
        )}
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.image && (
          <img src={post.image} alt="Post" className="post-image" />
        )}
      </div>

      <div className="post-stats">
        <span>{likes.length} likes</span>
        <span>{comments.length} comments</span>
      </div>

      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          {isLiked ? '❤️' : '🤍'} Like
        </button>
        <button
          className="action-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 Comment
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <img src={user.profilePicture} alt={user.username} />
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" className='post-btn'>Post</button>
          </form>

          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment._id} className="comment">
                <img src={comment.user.profilePicture} alt={comment.user.username} />
                <div className="comment-content">
                  <Link to={`/profile/${comment.user._id}`}>
                    <strong>{comment.user.username}</strong>
                  </Link>
                  <p>{comment.text}</p>
                  <span className="comment-time">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;