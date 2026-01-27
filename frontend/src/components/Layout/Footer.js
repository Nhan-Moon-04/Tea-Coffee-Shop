import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* About */}
          <div className="footer-col">
            <div className="footer-logo">
              <span className="logo-icon">☕</span>
              <span className="logo-text">Tea & Coffee</span>
            </div>
            <p className="footer-about">
              Chúng tôi mang đến cho bạn những ly trà và cà phê ngon nhất, 
              được chế biến từ nguyên liệu tươi ngon và tâm huyết.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link">
                <FiFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">
                <FiInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h3 className="footer-title">Liên kết</h3>
            <ul className="footer-links">
              <li><Link to="/">Trang chủ</Link></li>
              <li><Link to="/products">Sản phẩm</Link></li>
              <li><Link to="/about">Về chúng tôi</Link></li>
              <li><Link to="/contact">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h3 className="footer-title">Danh mục</h3>
            <ul className="footer-links">
              <li><Link to="/category/ca-phe">Cà phê</Link></li>
              <li><Link to="/category/tra">Trà</Link></li>
              <li><Link to="/category/tra-sua">Trà sữa</Link></li>
              <li><Link to="/category/da-xay">Đá xay</Link></li>
              <li><Link to="/category/banh-ngot">Bánh ngọt</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h3 className="footer-title">Liên hệ</h3>
            <ul className="footer-contact">
              <li>
                <FiMapPin className="contact-icon" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </li>
              <li>
                <FiPhone className="contact-icon" />
                <span>0123 456 789</span>
              </li>
              <li>
                <FiMail className="contact-icon" />
                <span>contact@teacoffee.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Tea & Coffee Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
