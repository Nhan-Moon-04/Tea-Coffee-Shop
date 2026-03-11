import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiMinus, FiPlus, FiShoppingCart, FiHeart, FiShare2, FiStar } from 'react-icons/fi';
import { productAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [note, setNote] = useState('');

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productAPI.getBySlug(slug);
      setProduct(response.data.product);
      if (response.data.product.variants?.length > 0) {
        setSelectedVariant(response.data.product.variants[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Không tìm thấy sản phẩm');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPrice = () => {
    if (!product) return 0;
    
    let basePrice = product.salePrice || product.price;
    
    if (selectedVariant && product.variants?.length > 0) {
      const variantOption = product.variants.find(v => v.name === selectedVariant);
      if (variantOption) basePrice = variantOption.price;
    }
    
    return basePrice * quantity;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }

    await addToCart(product._id, {
      quantity,
      variant: selectedVariant,
      note
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length > 0 
    ? product.images 
    : [product.thumbnail || 'https://via.placeholder.com/500'];

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="product-detail">
          {/* Product Images */}
          <div className="product-images">
            <div className="main-image">
              <img src={images[selectedImage]} alt={product.name} />
              {product.salePrice && (
                <span className="badge badge-sale">
                  -{Math.round((1 - product.salePrice / product.price) * 100)}%
                </span>
              )}
            </div>
            {images.length > 1 && (
              <div className="image-thumbnails">
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info-detail">
            <div className="product-category">{product.category?.name}</div>
            <h1 className="product-title">{product.name}</h1>

            {/* Rating */}
            {product.rating > 0 && (
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={i < Math.floor(product.rating) ? 'filled' : ''}
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {product.rating.toFixed(1)} ({product.numReviews} đánh giá)
                </span>
                <span className="sold-count">| Đã bán {product.sold}</span>
              </div>
            )}

            {/* Price */}
            <div className="product-price-detail">
              {product.salePrice ? (
                <>
                  <span className="price-sale">{formatPrice(product.salePrice)}</span>
                  <span className="price-old">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="price">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Product Specs */}
            {(product.brand || product.origin || product.weight) && (
              <div className="product-specs">
                {product.brand && (
                  <div className="spec-item">
                    <span className="spec-label">Thương hiệu:</span>
                    <span className="spec-value">{product.brand}</span>
                  </div>
                )}
                {product.origin && (
                  <div className="spec-item">
                    <span className="spec-label">Xuất xứ:</span>
                    <span className="spec-value">{product.origin}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="spec-item">
                    <span className="spec-label">Trọng lượng:</span>
                    <span className="spec-value">{product.weight}</span>
                  </div>
                )}
                {product.unit && (
                  <div className="spec-item">
                    <span className="spec-label">Đơn vị:</span>
                    <span className="spec-value">{product.unit}</span>
                  </div>
                )}
                <div className="spec-item">
                  <span className="spec-label">Tình trạng:</span>
                  <span className="spec-value" style={{ color: product.stock > 0 ? '#27ae60' : '#e74c3c' }}>
                    {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                  </span>
                </div>
              </div>
            )}

            {/* Variant Selection */}
            {product.variants?.length > 0 && (
              <div className="option-group">
                <label>Phân loại:</label>
                <div className="size-options">
                  {product.variants.map(variant => (
                    <button
                      key={variant.name}
                      className={`size-btn ${selectedVariant === variant.name ? 'active' : ''}`}
                      onClick={() => setSelectedVariant(variant.name)}
                    >
                      {variant.name}
                      <span>{formatPrice(variant.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            <div className="option-group">
              <label>Ghi chú:</label>
              <textarea
                className="note-input"
                placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
              />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="purchase-section">
              <div className="quantity-selector">
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <FiMinus />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(prev => Math.min(product.stock || 999, prev + 1))}
                >
                  <FiPlus />
                </button>
              </div>

              <div className="total-price">
                Tổng: <span>{formatPrice(getPrice())}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-lg" 
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <FiShoppingCart />
                {product.stock > 0 ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
              </button>
              <button className="btn btn-outline btn-icon">
                <FiHeart />
              </button>
              <button className="btn btn-outline btn-icon">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>

        {/* Full Description */}
        <div className="product-full-description">
          <h2>Mô tả sản phẩm</h2>
          <div className="description-content">
            {product.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
