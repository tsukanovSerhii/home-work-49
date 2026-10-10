import { useState, useEffect } from 'react';

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=3');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" aria-label="Loading posts..."></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">Posts Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="post-list card">
      <h2>Recent Posts</h2>
      <div className="posts-container">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostList;
