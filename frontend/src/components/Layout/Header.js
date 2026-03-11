import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiLogOut, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { cartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            <img src="/logo.jpg" alt="Hiền Tea Coffee" className="logo-img" style={{ height: '40px', borderRadius: '50%' }} />
            <span className="logo-text">Hiền Tea Coffee</span>
          </Link>

          {/* Navigation */}
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Trang chủ
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Sản phẩm
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/category/ca-phe" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Cà phê
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/category/tra" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Trà
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/category/combo-hop-qua" className="nav-link" onClick={() => setIsMenuOpen(false)}>
                  Combo & Quà
                </Link>
              </li>
            </ul>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            {/* Search */}
            <button className="header-icon-btn" title="Tìm kiếm">
              <FiSearch />
            </button>

            {/* Cart */}
            <Link to="/cart" className="header-icon-btn cart-btn" title="Giỏ hàng">
              <FiShoppingCart />
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <div className="user-menu-wrapper">
                <button
                  className="header-icon-btn user-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <FiUser />
                  <span className="user-name">{user?.name}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <p className="user-dropdown-name">{user?.name}</p>
                      <p className="user-dropdown-email">{user?.email}</p>
                    </div>
                    <ul className="user-dropdown-list">
                      <li>
                        <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                          Tài khoản của tôi
                        </Link>
                      </li>
                      <li>
                        <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}>
                          Đơn hàng
                        </Link>
                      </li>
                      {user?.role === 'admin' && (
                        <li>
                          <Link to="/admin" onClick={() => setIsUserMenuOpen(false)}>
                            Quản trị
                          </Link>
                        </li>
                      )}
                      <li>
                        <button onClick={handleLogout} className="logout-btn">
                          <FiLogOut />
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Đăng nhập
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
