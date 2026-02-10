import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/api.js';

const Reset = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.post(`/auth/reset-password/${token}`, { newPassword: password });
    setMessage('Password updated');
  };

  return (
    <div>
      <h2>Reset Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={submit}>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" />
        <button type="submit">Reset</button>
      </form>
    </div>
  );
};

export default Reset;
