import React, { useState, useEffect } from 'react';
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
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedSweet, setSelectedSweet] = useState('100%');
  const [selectedIce, setSelectedIce] = useState('Bình thường');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [slug]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getBySlug(slug);
      setProduct(response.data.product);
      if (response.data.product.sizes?.length > 0) {
        setSelectedSize(response.data.product.sizes[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Không tìm thấy sản phẩm');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getPrice = () => {
    if (!product) return 0;
    
    let basePrice = product.salePrice || product.price;
    
    if (selectedSize && product.sizes?.length > 0) {
      const sizeOption = product.sizes.find(s => s.name === selectedSize);
      if (sizeOption) basePrice = sizeOption.price;
    }

    const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
    
    return (basePrice + toppingsPrice) * quantity;
  };

  const handleToppingToggle = (topping) => {
    setSelectedToppings(prev => {
      const exists = prev.find(t => t.name === topping.name);
      if (exists) {
        return prev.filter(t => t.name !== topping.name);
      }
      return [...prev, topping];
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/products/${slug}` } });
      return;
    }

    await addToCart(product._id, {
      quantity,
      size: selectedSize,
      sweetLevel: selectedSweet,
      iceLevel: selectedIce,
      toppings: selectedToppings,
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

            <p className="product-description">{product.shortDescription || product.description}</p>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="option-group">
                <label>Kích cỡ:</label>
                <div className="size-options">
                  {product.sizes.map(size => (
                    <button
                      key={size.name}
                      className={`size-btn ${selectedSize === size.name ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size.name)}
                    >
                      {size.name}
                      <span>{formatPrice(size.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sweet Level */}
            {product.sweetLevels?.length > 0 && (
              <div className="option-group">
                <label>Độ ngọt:</label>
                <div className="radio-options">
                  {product.sweetLevels.map(level => (
                    <button
                      key={level}
                      className={`option-btn ${selectedSweet === level ? 'active' : ''}`}
                      onClick={() => setSelectedSweet(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ice Level */}
            {product.iceLevels?.length > 0 && (
              <div className="option-group">
                <label>Đá:</label>
                <div className="radio-options">
                  {product.iceLevels.map(level => (
                    <button
                      key={level}
                      className={`option-btn ${selectedIce === level ? 'active' : ''}`}
                      onClick={() => setSelectedIce(level)}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Toppings */}
            {product.toppings?.length > 0 && (
              <div className="option-group">
                <label>Topping thêm:</label>
                <div className="topping-options">
                  {product.toppings.map(topping => (
                    <label key={topping.name} className="topping-item">
                      <input
                        type="checkbox"
                        checked={selectedToppings.some(t => t.name === topping.name)}
                        onChange={() => handleToppingToggle(topping)}
                      />
                      <span className="topping-name">{topping.name}</span>
                      <span className="topping-price">+{formatPrice(topping.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Note */}
            <div className="option-group">
              <label>Ghi chú:</label>
              <textarea
                className="note-input"
                placeholder="Nhập ghi chú cho đồ uống (nếu có)"
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
                  onClick={() => setQuantity(prev => prev + 1)}
                >
                  <FiPlus />
                </button>
              </div>

              <div className="total-price">
                Tổng: <span>{formatPrice(getPrice())}</span>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                <FiShoppingCart />
                Thêm vào giỏ hàng
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
