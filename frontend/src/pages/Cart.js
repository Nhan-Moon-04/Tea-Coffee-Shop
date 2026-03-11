import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateItemTotal = (item) => {
    return item.price * item.quantity;
  };

  if (cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <FiShoppingBag className="empty-icon" />
            <h2>Giỏ hàng trống</h2>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Giỏ hàng của bạn</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-header">
              <span className="col-product">Sản phẩm</span>
              <span className="col-price">Đơn giá</span>
              <span className="col-quantity">Số lượng</span>
              <span className="col-total">Thành tiền</span>
              <span className="col-action"></span>
            </div>

            {cart.items.map(item => (
              <div key={item._id} className="cart-item">
                <div className="col-product">
                  <Link to={`/products/${item.product?.slug}`} className="item-image">
                    <img 
                      src={item.product?.thumbnail || 'https://via.placeholder.com/100'} 
                      alt={item.product?.name} 
                    />
                  </Link>
                  <div className="item-info">
                    <Link to={`/products/${item.product?.slug}`} className="item-name">
                      {item.product?.name}
                    </Link>
                    <div className="item-options">
                      {item.variant && <span>Phân loại: {item.variant}</span>}
                    </div>
                    {item.note && (
                      <div className="item-note">Ghi chú: {item.note}</div>
                    )}
                  </div>
                </div>

                <div className="col-price">
                  {formatPrice(item.price)}
                </div>

                <div className="col-quantity">
                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={loading}
                    >
                      <FiMinus />
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      disabled={loading}
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>

                <div className="col-total">
                  {formatPrice(calculateItemTotal(item))}
                </div>

                <div className="col-action">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item._id)}
                    disabled={loading}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-actions">
              <Link to="/products" className="btn btn-outline">
                Tiếp tục mua sắm
              </Link>
              <button 
                className="btn btn-outline text-danger"
                onClick={clearCart}
                disabled={loading}
              >
                Xóa tất cả
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="cart-summary">
            <h3>Tóm tắt đơn hàng</h3>
            
            <div className="summary-row">
              <span>Tạm tính ({cart.items.length} sản phẩm)</span>
              <span>{formatPrice(cart.totalAmount)}</span>
            </div>

            <div className="summary-row">
              <span>Phí vận chuyển</span>
              <span>{cart.totalAmount >= 100000 ? 'Miễn phí' : formatPrice(15000)}</span>
            </div>

            {cart.totalAmount < 100000 && (
              <div className="shipping-note">
                Mua thêm {formatPrice(100000 - cart.totalAmount)} để được miễn phí vận chuyển
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Tổng cộng</span>
              <span className="total-price">
                {formatPrice(cart.totalAmount + (cart.totalAmount >= 100000 ? 0 : 15000))}
              </span>
            </div>

            <div className="coupon-section">
              <input 
                type="text" 
                placeholder="Nhập mã giảm giá" 
                className="coupon-input"
              />
              <button className="btn btn-outline">Áp dụng</button>
            </div>

            <button className="btn btn-primary btn-lg btn-checkout">
              Tiến hành thanh toán
            </button>

            <div className="payment-methods">
              <p>Chấp nhận thanh toán</p>
              <div className="payment-icons">
                <span>💳 COD</span>
                <span>💳 MOMO</span>
                <span>💳 VNPay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
