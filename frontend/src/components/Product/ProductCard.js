import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${product.slug}` } });
      return;
    }

    await addToCart(product._id, {
      quantity: 1,
      size: product.sizes?.[0]?.name || 'M'
    });
  };

  const discount = product.salePrice 
    ? Math.round((1 - product.salePrice / product.price) * 100) 
    : 0;

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-image-wrapper">
        <img 
          src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/300'} 
          alt={product.name}
          className="product-image"
        />
        {discount > 0 && (
          <span className="product-badge badge-sale">-{discount}%</span>
        )}
        {product.isNewArrival && (
          <span className="product-badge badge-new">Mới</span>
        )}
        {product.isBestSeller && !product.isNewArrival && (
          <span className="product-badge badge-hot">Hot</span>
        )}
        <button 
          className="product-cart-btn"
          onClick={handleAddToCart}
          title="Thêm vào giỏ hàng"
        >
          <FiShoppingCart />
        </button>
      </div>
      
      <div className="product-info">
        <p className="product-category">{product.category?.name}</p>
        <h3 className="product-name">{product.name}</h3>
        
        {product.rating > 0 && (
          <div className="product-rating">
            <FiStar className="star-icon" />
            <span>{product.rating.toFixed(1)}</span>
            <span className="rating-count">({product.numReviews})</span>
          </div>
        )}
        
        <div className="product-price">
          {product.salePrice ? (
            <>
              <span className="price-old">{formatPrice(product.price)}</span>
              <span className="price-sale">{formatPrice(product.salePrice)}</span>
            </>
          ) : (
            <span className="price">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
