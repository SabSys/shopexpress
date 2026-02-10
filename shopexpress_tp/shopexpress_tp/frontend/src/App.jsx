import React, { useEffect, useState } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import api from './utils/api.js';
import { clearToken, getToken } from './utils/auth.js';
import Home from './components/Home.jsx';
import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import Product from './components/Product.jsx';
import Cart from './components/Cart.jsx';
import Orders from './components/Orders.jsx';
import Admin from './components/Admin.jsx';
import Reset from './components/Reset.jsx';
import Profile from './components/Profile.jsx';

const App = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }
    api.get('/users/profile')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  const logout = () => {
    clearToken();
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <nav>
        <Link to="/">ShopExpress</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/admin">Admin</Link>
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && <button onClick={logout}>Logout</button>}
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onRegister={setUser} />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile onUpdate={setUser} />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/reset/:token" element={<Reset />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
