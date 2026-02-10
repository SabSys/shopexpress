import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/products').then((res) => setProducts(res.data));
  }, []);

  const search = async (e) => {
    e.preventDefault();
    const res = await api.get(`/products/search?q=${encodeURIComponent(q)}`);
    setProducts(res.data);
  };

  return (
    <div>
      <h2>Catalog</h2>
      <form onSubmit={search}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" />
        <button type="submit">Search</button>
      </form>
      {products.map((p) => (
        <div key={p.id} className="card">
          <h3>{p.name}</h3>
          <p>{p.description}</p>
          <p>${p.price}</p>
          <Link to={`/product/${p.id}`}>View</Link>
        </div>
      ))}
    </div>
  );
};

export default Home;
