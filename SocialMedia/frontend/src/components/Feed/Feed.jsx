import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import CreatePost from './CreatePost';
import Post from './Post';
import '../../styles/feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get(`/posts/feed?page=${page}`);
      const fetchedPosts = Array.isArray(data)
        ? data
        : Array.isArray(data.posts)
        ? data.posts
        : [];
  
      setPosts(prev => (page === 1 ? fetchedPosts : [...prev, ...fetchedPosts]));
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };
  

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  if (loading && page === 1) {
    return <div className="loader">Loading...</div>;
  }

  return (
    <div className="feed-container">
      <CreatePost onPostCreated={handlePostCreated} />
      
      <div className="posts-list">
        {posts.map(post => (
          <Post key={post._id} post={post} onDelete={handlePostDeleted} />
        ))}
      </div>

      {posts.length > 0 && (
        <button
          className="load-more-btn"
          onClick={() => setPage(page + 1)}
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default Feed;