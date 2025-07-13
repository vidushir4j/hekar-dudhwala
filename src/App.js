// src/App.js

import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Timestamp } from 'firebase/firestore';


// ----- AdminOrders Component -----
// ----- AdminOrders Component -----
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [accessGranted, setAccessGranted] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const correctPassword = 'dudhlover'; // 🔐 your secret password

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
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
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
                    timeStyle: 'short'
                  })
                : 'N/A'
            }</p>
          </div>
        ))
      )}
    </div>
  );
}

// ----- HomePage Component -----
function HomePage() {
  const [selectedMilk, setSelectedMilk] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    instructions: '',
    payment: 'Cash',
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'o') {
        const orders = JSON.parse(localStorage.getItem('milkOrders')) || [];
        console.log("🧾 All Orders:", orders);
        alert("📦 All orders printed in console (Ctrl + Shift + I)");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOrderClick = (milkName, pricePerLiter) => {
    setSelectedMilk({ name: milkName, pricePerLiter });
  };

  const handleConfirm = () => setShowForm(true);
  const handleClose = () => {
    setSelectedMilk(null);
    setShowForm(false);
    setQuantity(1);
    setShowSuccess(false);
    setFormError('');
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleSubmitOrder = async () => {
    const { name, address, phone } = formData;

    if (!name || !address || !phone) {
      setFormError("⚠️ Please fill in Name, Address, and Phone Number.");
      return;
    }

    const order = {
      milk: selectedMilk.name,
      quantity: `${quantity * 500}ml`,
      total: `₹${((selectedMilk.pricePerLiter / 2) * quantity).toFixed(2)}`,
      ...formData,
      date: Timestamp.now()
    };

    try {
      await addDoc(collection(db, "orders"), order);
      console.log("Order saved:", order);

      setFormData({
        name: '',
        address: '',
        phone: '',
        instructions: '',
        payment: 'Cash',
      });
      setFormError('');
      setShowForm(false);
      setShowSuccess(true);
      setQuantity(1);
    } catch (e) {
      console.error("Error saving order:", e);
      setFormError("Failed to place order. Please try again.");
    }
  };

  return (
    <>
      <div className="container">
        <header>
          <h1>Hekar Yadav Dudhwala 😋</h1>
          <p className="tagline">Freshness straight from our tabela to your home!</p>
        </header>

        <section className="milk-list">
          <MilkCard name="Cow Milk" description="Sabse normal, sabka favourite!" price="₹70/L" emoji="🐄" onOrder={() => handleOrderClick("Cow Milk", 70)} />
          <MilkCard name="Buffalo Milk" description="Kali bhes ka shudh safed dudh!" price="₹80/L" emoji="🐃" onOrder={() => handleOrderClick("Buffalo Milk", 80)} />
          <MilkCard name="Goat Milk" description="Goat milk for G.O.A.T.S.!" price="₹150/L" emoji="🐐" onOrder={() => handleOrderClick("Goat Milk", 150)} />
          <MilkCard name="Breast Milk" description="Dudh, jo maa ki yaad dilade!" price="₹500/L" emoji="👩🏻" onOrder={() => handleOrderClick("Breast Milk", 500)} />
        </section>

        <footer>
          <p>© 2025 Hekar Yadav Dudhwala | Made with ❤️ and 🐄</p>
        </footer>
      </div>

      {selectedMilk && !showForm && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>{selectedMilk.name}</h2>
            <p>Do you want to order this milk?</p>
            <p className="price">₹{selectedMilk.pricePerLiter}/L</p>
            <div className="popup-buttons">
              <button className="yes-btn" onClick={handleConfirm}>Yes</button>
              <button className="no-btn" onClick={handleClose}>No</button>
            </div>
          </div>
        </div>
      )}

      {selectedMilk && showForm && (
        <div className="popup-overlay">
          <div className="form-popup-box">
            <button className="close-btn" onClick={handleClose}>❌</button>
            <h2>📝 {selectedMilk.name} Order</h2>

            <label>Quantity:</label>
            <div className="quantity-control">
              <button className="qty-btn" onClick={() => handleQuantityChange(-1)}>-</button>
              <span className="qty-count">{quantity * 500} ml</span>
              <button className="qty-btn" onClick={() => handleQuantityChange(1)}>+</button>
            </div>

            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleFormChange} />
            <label>Address:</label>
            <input type="text" name="address" value={formData.address} onChange={handleFormChange} />
            <label>Phone Number:</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleFormChange} />
            <label>Delivery Instructions:</label>
            <input type="text" name="instructions" value={formData.instructions} onChange={handleFormChange} />
            <label>Payment Method:</label>
            <select name="payment" value={formData.payment} onChange={handleFormChange}>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </select>

            {formError && <p className="form-error">{formError}</p>}

            <button className="submit-btn" onClick={handleSubmitOrder}>✅ Submit Order</button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="popup-overlay">
          <div className="success-popup-box">
            <h2>🎉 Order Placed Successfully!</h2>
            <p>Thank you for choosing Hekar Yadav Dudhwala 💖</p>
            <button className="ok-btn" onClick={handleClose}>OK</button>
          </div>
        </div>
      )}
    </>
  );
}

// ----- MilkCard Component -----
function MilkCard({ name, description, price, emoji, onOrder }) {
  return (
    <div className="card" onClick={onOrder}>
      <h2>{emoji} {name}</h2>
      <p>{description}</p>
      <h3 className="price">{price}</h3>
    </div>
  );
}

// ----- Final Exported App with Router -----
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminOrders />} />
      </Routes>
    </Router>
  );
}

export default App;
