import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './AdminOrders.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [accessGranted, setAccessGranted] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const correctPassword = 'dudhlover'; // set your password here

  const handlePasswordSubmit = () => {
    if (passwordInput === correctPassword) {
      setAccessGranted(true);
      setError('');
    } else {
      setError('❌ Incorrect password');
    }
  };

  useEffect(() => {
    if (!accessGranted) return;

    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };

    fetchOrders();
  }, [accessGranted]);

  if (!accessGranted) {
    return (
      <div className="admin-login">
        <h2>🔐 Enter Admin Password</h2>
        <input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder="Enter password"
        />
        <button onClick={handlePasswordSubmit}>Login</button>
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h2>📦 All Milk Orders</h2>
      {orders.length === 0 ? <p>No orders found.</p> : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <p><strong>Milk:</strong> {order.milk}</p>
            <p><strong>Quantity:</strong> {order.quantity}</p>
            <p><strong>Total:</strong> {order.total}</p>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Payment:</strong> {order.payment}</p>
            <p><strong>Instructions:</strong> {order.instructions}</p>
            <p><strong>Date:</strong> {
              order.date?.seconds
                ? new Date(order.date.seconds * 1000).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })
                : 'N/A'
            }</p>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
