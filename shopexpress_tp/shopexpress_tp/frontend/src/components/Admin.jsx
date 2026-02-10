import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });
  const [message, setMessage] = useState('');

  const load = async () => {
    const [u, o, p] = await Promise.all([
      api.get('/admin/users'),
      api.get('/admin/orders'),
      api.get('/products')
    ]);
    setUsers(u.data);
    setOrders(o.data);
    setProducts(p.data);
  };

  useEffect(() => {
    load();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    await api.post('/admin/products', {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      category: form.category,
      stock: Number(form.stock)
    });
    setMessage('Product created');
    load();
  };

  const updateUser = async (id, data) => {
    await api.put(`/admin/users/${id}`, data);
    load();
  };

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    load();
  };

  const deleteProduct = async (id) => {
    await api.delete(`/admin/products/${id}`);
    load();
  };

  return (
    <div>
      <h2>Admin</h2>
      {message && <p>{message}</p>}

      <h3>Create Product</h3>
      <form onSubmit={createProduct}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
        <button type="submit">Create</button>
      </form>

      <h3>Users</h3>
      {users.map((u) => (
        <div key={u.id} className="card">
          <p>{u.email} ({u.role})</p>
          <div>
            <input
              placeholder="First name"
              defaultValue={u.first_name || ''}
              onBlur={(e) => updateUser(u.id, { firstName: e.target.value, lastName: u.last_name, role: u.role })}
            />
            <input
              placeholder="Last name"
              defaultValue={u.last_name || ''}
              onBlur={(e) => updateUser(u.id, { firstName: u.first_name, lastName: e.target.value, role: u.role })}
            />
            <select
              defaultValue={u.role}
              onChange={(e) => updateUser(u.id, { firstName: u.first_name, lastName: u.last_name, role: e.target.value })}
            >
              <option value="client">client</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button onClick={() => deleteUser(u.id)}>Delete</button>
        </div>
      ))}

      <h3>Products</h3>
      {products.map((p) => (
        <div key={p.id} className="card">
          <p>{p.name}</p>
          <button onClick={() => deleteProduct(p.id)}>Delete</button>
        </div>
      ))}

      <h3>Orders</h3>
      {orders.map((o) => (
        <div key={o.id} className="card">
          <p>Order #{o.id} - ${o.total_amount}</p>
        </div>
      ))}
    </div>
  );
};

export default Admin;
