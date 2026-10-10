import { useState, useEffect } from 'react';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" aria-label="Loading..."></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-text">Error: {error}</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
    </div>
  );
};

export default UserProfile;
