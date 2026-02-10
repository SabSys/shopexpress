import React, { useEffect, useState } from 'react';
import api from '../utils/api.js';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState('pm_card_visa');
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await api.get('/users/orders');
    setOrders(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const createOrder = async (e) => {
    e.preventDefault();
    const res = await api.post('/orders', { shippingAddress: address });
    setMessage(`Order created #${res.data.orderId}`);
    load();
  };

  const pay = async (id) => {
    await api.post(`/orders/${id}/payment`, { paymentMethodId });
    setMessage('Payment sent');
    load();
  };

  return (
    <div>
      <h2>Orders</h2>
      {message && <p>{message}</p>}
      <form onSubmit={createOrder}>
        <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Shipping address" />
        <button type="submit">Create Order</button>
      </form>
      <div>
        <input value={paymentMethodId} onChange={(e) => setPaymentMethodId(e.target.value)} placeholder="Payment Method ID" />
      </div>
      {orders.map((o) => (
        <div key={o.id} className="card">
          <p>Order #{o.id}</p>
          <p>Total: ${o.total_amount}</p>
          <p>Status: {o.status}</p>
          <button onClick={() => pay(o.id)}>Pay</button>
        </div>
      ))}
    </div>
  );
};

export default Orders;
