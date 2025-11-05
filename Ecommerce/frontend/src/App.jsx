import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductList from './components/Products/ProductList';
import Cart from './components/Cart/Cart';
import Checkout from './components/Checkout/Checkout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import OrderHistory from './pages/OrderHistory';

// Seller Components
import SellerLogin from './components/SellerLogin';
import SellerRegister from './components/SellerRegister';
import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerProducts from './pages/Seller/SellerProducts';
import SellerOrders from './pages/Seller/SellerOrders';
import SellerOrderDetail from './pages/Seller/SellerOrderDetail';

// Payment Pages
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentCancel from './pages/PaymentCancel'

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* USER ROUTES */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<OrderHistory />} />

        {/* SELLER ROUTES */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/register" element={<SellerRegister />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<SellerProducts />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/order/:orderId" element={<SellerOrderDetail />} />

        {/* PAYMENT ROUTES */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
      </Routes>
    </Router>
  );
}

export default App;