import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';

const Profile = ({ onUpdate }) => {
  const [profile, setProfile] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/users/profile').then((res) => {
      setProfile(res.data);
      setFirstName(res.data.first_name || '');
      setLastName(res.data.last_name || '');
    });
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const res = await api.put('/users/profile', { firstName, lastName });
    setProfile(res.data);
    onUpdate(res.data);
    setMessage('Profile updated');
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <h2>Profile</h2>
      {message && <p>{message}</p>}
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
      <form onSubmit={save}>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default Profile;
