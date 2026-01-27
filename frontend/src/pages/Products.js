import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { FiFilter, FiGrid, FiList } from 'react-icons/fi';
import ProductCard from '../components/Product/ProductCard';
import { productAPI, categoryAPI } from '../services/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams();

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, slug, currentPage, filters.category]);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.categories || response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      let categoryId = filters.category;
      
      // If we have a category slug in URL, find its ID
      if (slug && categories.length > 0) {
        const cat = categories.find(c => c.slug === slug);
        if (cat) categoryId = cat._id;
      }

      const params = {
        page: currentPage,
        limit: 12,
        category: categoryId || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sort: filters.sort,
        isFeatured: searchParams.get('isFeatured') || undefined,
        isNewArrival: searchParams.get('isNewArrival') || undefined,
        isBestSeller: searchParams.get('isBestSeller') || undefined
      };

      const response = await productAPI.getAll(params);
      setProducts(response.data.products || response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort) params.set('sort', filters.sort);
    setSearchParams(params);
    setCurrentPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      sort: 'newest'
    });
    setSearchParams({});
    setCurrentPage(1);
  };

  const getCategoryTitle = () => {
    if (slug) {
      const cat = categories.find(c => c.slug === slug);
      return cat ? cat.name : 'Sản phẩm';
    }
    return 'Tất cả sản phẩm';
  };

  return (
    <div className="products-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>{getCategoryTitle()}</h1>
          <p>Khám phá các sản phẩm trà và cà phê ngon nhất</p>
        </div>

        <div className="products-layout">
          {/* Filters Sidebar */}
          <aside className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3>Bộ lọc</h3>
              <button className="close-filters" onClick={() => setShowFilters(false)}>
                ✕
              </button>
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <h4>Danh mục</h4>
              <ul className="filter-list">
                <li>
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={!filters.category}
                      onChange={() => handleFilterChange('category', '')}
                    />
                    <span>Tất cả</span>
                  </label>
                </li>
                {categories.map(cat => (
                  <li key={cat._id}>
                    <label className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat._id}
                        onChange={() => handleFilterChange('category', cat._id)}
                      />
                      <span>{cat.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h4>Khoảng giá</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Từ"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="filter-actions">
              <button className="btn btn-primary" onClick={applyFilters}>
                Áp dụng
              </button>
              <button className="btn btn-outline" onClick={clearFilters}>
                Xóa bộ lọc
              </button>
            </div>
          </aside>

          {/* Products Content */}
          <div className="products-content">
            {/* Toolbar */}
            <div className="products-toolbar">
              <button 
                className="filter-toggle"
                onClick={() => setShowFilters(true)}
              >
                <FiFilter /> Bộ lọc
              </button>

              <div className="toolbar-right">
                <select
                  value={filters.sort}
                  onChange={(e) => {
                    handleFilterChange('sort', e.target.value);
                    const params = new URLSearchParams(searchParams);
                    params.set('sort', e.target.value);
                    setSearchParams(params);
                  }}
                  className="sort-select"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="price_asc">Giá thấp đến cao</option>
                  <option value="price_desc">Giá cao đến thấp</option>
                  <option value="bestselling">Bán chạy</option>
                  <option value="rating">Đánh giá cao</option>
                </select>

                <div className="view-modes">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <FiGrid />
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className={`products-grid ${viewMode === 'grid' ? 'grid grid-4' : 'list-view'}`}>
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      Trước
                    </button>
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </button>
                    ))}
                    <button
                      className="page-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-products">
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {showFilters && (
        <div className="filters-overlay" onClick={() => setShowFilters(false)} />
      )}
    </div>
  );
};

export default Products;
