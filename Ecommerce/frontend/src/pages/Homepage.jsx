import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';
import {Truck, BrickWallShield, ShieldCheck, HeartPlus} from 'lucide-react'

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to ShopHub</h1>
        <p>Your One-Stop E-Commerce Platform</p>
        <Link to="/products" className="cta-button">
          Start Shopping
        </Link>
      </div>

      <div className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Truck size={50}/></div>
            <h3>Fast Delivery</h3>
            <p>Free shipping on all orders with quick delivery</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><BrickWallShield size={50}/></div>
            <h3>Secure Payment</h3>
            <p>Multiple payment options with secure checkout</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={50}/></div>
            <h3>Quality Products</h3>
            <p>Handpicked products from trusted sellers</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><HeartPlus size={50}/></div>
            <h3>Support 24/7</h3>
            <p>Dedicated customer support team always ready</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;