import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import Post from '../Feed/Post';
import '../../styles/profile.css';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const isOwnProfile = currentUser.id === id;

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get(`/users/${id}`);
      setProfile(data);
      setIsFollowing(data.followers.some(f => f._id === currentUser.id));
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const { data } = await API.get(`/posts/feed`);
      const userPosts = data.filter(post => post.author._id === id);
      setPosts(userPosts);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handleFollow = async () => {
    try {
      const { data } = await API.put(`/users/${id}/follow`);
      setIsFollowing(data.following);
      fetchProfile();
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (!profile) {
    return <div className="error">Profile not found</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={profile.profilePicture}
          alt={profile.username}
          className="profile-picture"
        />
        
        <div className="profile-info">
          <div className="profile-top">
            <h1>{profile.username}</h1>
            {isOwnProfile ? (
              <Link to="/edit-profile" className="btn-secondary">
                Edit Profile
              </Link>
            ) : (
              <button
                className={`btn-${isFollowing ? 'secondary' : 'primary'}`}
                onClick={handleFollow}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          <div className="profile-stats">
            <div>
              <strong>{posts.length}</strong> posts
            </div>
            <div>
              <strong>{profile.followers.length}</strong> followers
            </div>
            <div>
              <strong>{profile.following.length}</strong> following
            </div>
          </div>

          <p className="profile-bio">{profile.bio || 'No bio yet.'}</p>
        </div>
      </div>

      <div className="profile-posts">
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p className="no-posts">No posts yet.</p>
        ) : (
          posts.map(post => (
            <Post key={post._id} post={post} onDelete={() => fetchUserPosts()} />
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;