import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import './Navbar.css';
import {BaggageClaim, Store} from 'lucide-react'

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Check seller authentication
  const sellerToken = localStorage.getItem('sellerToken');
  const seller = JSON.parse(localStorage.getItem('seller') || '{}');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSellerLogout = () => {
    localStorage.removeItem('sellerToken');
    localStorage.removeItem('seller');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <BaggageClaim/> ShopHub
        </Link>

        <ul className="navbar-menu">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/products">Products</Link>
          </li>

          {/* USER MENU ITEMS */}
          {isAuthenticated && !sellerToken && (
            <>
              <li>
                <Link to="/cart" className="cart-link">
                  Cart
                  {items.length > 0 && <span className="cart-badge">{items.length}</span>}
                </Link>
              </li>
              <li>
                <Link to="/orders">Orders</Link>
              </li>
            </>
          )}

          {/* SELLER MENU ITEMS */}
          {sellerToken && (
            <>
              <li>
                <Link to="/seller/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/seller/products">My Products</Link>
              </li>
              <li>
                <Link to="/seller/orders">My Orders</Link>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-auth">
          {/* SELLER AUTH */}
          {sellerToken ? (
            <>
              <span className="user-info"><Store/> {seller?.shopName}</span>
              <button onClick={handleSellerLogout} className="logout-btn">
                Seller Logout
              </button>
            </>
          ) : isAuthenticated ? (
            /* USER AUTH */
            <>
              <span className="user-info">{user?.name}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            /* NOT AUTHENTICATED */
            <>
              <Link to="/login" className="login-link">
                Login
              </Link>
              <Link to="/register" className="register-link">
                Register
              </Link>
              <Link to="/seller/login" className="seller-login-link">
                Become a Seller
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;  `q`