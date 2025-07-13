// src/AdminOrders.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './AdminOrders.css';

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const querySnapshot = await getDocs(collection(db, 'orders'));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };
    fetchOrders();
  }, []);

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
  order.date
    ? order.date.seconds
      ? new Date(order.date.seconds * 1000).toLocaleString()
      : new Date(order.date).toLocaleString()
    : 'N/A'
}</p>

          </div>
        ))
      )}
    </div>
  );
}

export default AdminOrders;
