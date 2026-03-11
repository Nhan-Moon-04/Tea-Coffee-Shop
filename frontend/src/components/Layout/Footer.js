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
              <img src="/logo.jpg" alt="Hiền Tea Coffee" className="logo-img" style={{ height: '36px', borderRadius: '50%' }} />
              <span className="logo-text">Hiền Tea Coffee</span>
            </div>
            <p className="footer-about">
              Chuyên cung cấp cà phê, trà và các sản phẩm chất lượng cao. 
              Cam kết hàng chính hãng, giá tốt, giao hàng nhanh chóng.
            </p>
            <div className="footer-social">
              <a href="https://www.facebook.com/thiennhan1611" target="_blank" rel="noreferrer" className="social-link">
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
              <li><Link to="/category/combo-hop-qua">Combo & Hộp Quà</Link></li>
              <li><Link to="/category/nguyen-lieu-pha-che">Nguyên Liệu</Link></li>
              <li><Link to="/category/phu-kien">Phụ Kiện</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h3 className="footer-title">Liên hệ</h3>
            <ul className="footer-contact">
              <li>
                <FiMapPin className="contact-icon" />
                <span>Phú Thọ, Tam Nông, Đồng Tháp</span>
              </li>
              <li>
                <FiPhone className="contact-icon" />
                <a href="tel:0989057191">0989 057 191</a>
              </li>
              <li>
                <FiMail className="contact-icon" />
                <a href="mailto:nthiennhan1611@gmail.com">nthiennhan1611@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div className="footer-col footer-map-col">
            <h3 className="footer-title">Bản đồ</h3>
            <div className="footer-mini-map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.2!2d105.4282037!3d10.6916983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a47089c81365b%3A0xd3dd7ca4feb8b39b!2zTmjDoCBQaMOibiBQaOG7kWkgVHLDoCAmIEPDoCBQaMOqIEhp4buBbg!5e0!3m2!1svi!2svn!4v1706400000000"
                width="100%"
                height="180"
                style={{ border: 0, borderRadius: '8px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Nhà Phân Phối Trà & Cà Phê Hiền Tea Coffee"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 Hiền Tea Coffee. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
