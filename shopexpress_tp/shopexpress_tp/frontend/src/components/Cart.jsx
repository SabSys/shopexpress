import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await api.get('/cart');
    setCart(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const updateItem = async (id, quantity) => {
    await api.put(`/cart/items/${id}`, { quantity: Number(quantity) });
    setMessage('Updated');
    load();
  };

  const removeItem = async (id) => {
    await api.delete(`/cart/items/${id}`);
    setMessage('Removed');
    load();
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Cart</h2>
      {message && <p>{message}</p>}
      {cart.items.map((item) => (
        <div key={item.id} className="card">
          <h4>{item.name}</h4>
          <p>${item.price}</p>
          <input
            type="number"
            defaultValue={item.quantity}
            onBlur={(e) => updateItem(item.id, e.target.value)}
          />
          <button onClick={() => removeItem(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Cart;
