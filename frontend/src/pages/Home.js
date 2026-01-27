import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCoffee, FiTruck, FiGift, FiHeart } from 'react-icons/fi';
import ProductCard from '../components/Product/ProductCard';
import { productAPI, categoryAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featuredRes, bestSellerRes, newArrivalRes, categoryRes] = await Promise.all([
        productAPI.getFeatured(8),
        productAPI.getBestSeller(8),
        productAPI.getNewArrivals(4),
        categoryAPI.getAll()
      ]);

      setFeaturedProducts(featuredRes.data.products);
      setBestSellers(bestSellerRes.data.products);
      setNewArrivals(newArrivalRes.data.products);
      setCategories(categoryRes.data.categories);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Khám phá hương vị<br />
              <span>Trà & Cà Phê</span> tuyệt hảo
            </h1>
            <p className="hero-subtitle">
              Thưởng thức những ly đồ uống được chế biến từ nguyên liệu tươi ngon, 
              mang đến cho bạn trải nghiệm hoàn hảo mỗi ngày.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn btn-primary btn-lg">
                Khám phá ngay
                <FiArrowRight />
              </Link>
              <Link to="/about" className="btn btn-outline btn-lg">
                Về chúng tôi
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600" 
              alt="Coffee" 
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <FiCoffee />
              </div>
              <h3>Nguyên liệu tươi ngon</h3>
              <p>Chọn lọc kỹ lưỡng từ những vùng nguyên liệu tốt nhất</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <FiTruck />
              </div>
              <h3>Giao hàng nhanh</h3>
              <p>Miễn phí giao hàng cho đơn từ 100.000đ</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <FiGift />
              </div>
              <h3>Ưu đãi hấp dẫn</h3>
              <p>Nhiều chương trình khuyến mãi hàng tuần</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <FiHeart />
              </div>
              <h3>Phục vụ tận tâm</h3>
              <p>Đội ngũ nhân viên thân thiện, nhiệt tình</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Danh mục sản phẩm</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <Link 
                to={`/category/${category.slug}`} 
                key={category._id}
                className="category-card"
              >
                <div className="category-image">
                  <img src={category.image || 'https://via.placeholder.com/300'} alt={category.name} />
                </div>
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Sản phẩm nổi bật</h2>
            <Link to="/products?isFeatured=true" className="view-all-link">
              Xem tất cả <FiArrowRight />
            </Link>
          </div>
          <div className="products-grid grid grid-4">
            {featuredProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content">
            <span className="promo-label">Ưu đãi đặc biệt</span>
            <h2>Giảm 20% cho đơn hàng đầu tiên</h2>
            <p>Sử dụng mã: <strong>WELCOME20</strong></p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Mua ngay
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section bestseller-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Bán chạy nhất</h2>
            <Link to="/products?sort=bestselling" className="view-all-link">
              Xem tất cả <FiArrowRight />
            </Link>
          </div>
          <div className="products-grid grid grid-4">
            {bestSellers.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="section new-arrivals-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Sản phẩm mới</h2>
              <Link to="/products?isNewArrival=true" className="view-all-link">
                Xem tất cả <FiArrowRight />
              </Link>
            </div>
            <div className="products-grid grid grid-4">
              {newArrivals.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default Home;
