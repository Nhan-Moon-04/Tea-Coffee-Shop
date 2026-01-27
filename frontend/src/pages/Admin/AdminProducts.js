import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaImage, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './AdminProducts.css';

const AdminProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products?limit=100');
      // API trả về products hoặc data
      setProducts(response.data.products || response.data.data || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      // API trả về categories hoặc data
      setCategories(response.data.categories || response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Xóa sản phẩm thành công!');
        fetchProducts();
      } catch (error) {
        toast.error('Lỗi khi xóa sản phẩm');
      }
    }
  };

  const handleRowClick = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  const handleAddNew = () => {
    navigate('/admin/products/new');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category?._id === filterCategory;
    const matchesStatus = !filterStatus || 
      (filterStatus === 'active' && product.isActive) ||
      (filterStatus === 'inactive' && !product.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="page-header">
        <h1>Quản lý sản phẩm</h1>
        <button className="btn-add" onClick={handleAddNew}>
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <select 
          className="filter-select"
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
      </div>

      <div className="products-stats">
        <span>Tổng: <strong>{filteredProducts.length}</strong> sản phẩm</span>
      </div>

      <div className="products-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Tồn kho</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr 
                key={product._id} 
                onClick={() => handleRowClick(product._id)}
                className="clickable-row"
              >
                <td>
                  <div className="product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <FaImage />
                    )}
                  </div>
                </td>
                <td>
                  <div className="product-name">
                    {product.name}
                    {product.isFeatured && <span className="badge featured">Nổi bật</span>}
                  </div>
                </td>
                <td>{product.category?.name || 'N/A'}</td>
                <td>
                  <div className="product-price">
                    <span className="current-price">{formatCurrency(product.price)}</span>
                    {product.originalPrice > product.price && (
                      <span className="original-price">{formatCurrency(product.originalPrice)}</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`stock ${product.stock <= 10 ? 'low' : ''}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Đang bán' : 'Ngừng bán'}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button 
                      className="btn-view" 
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${product._id}`); }}
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="btn-edit" 
                      onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/${product._id}`); }}
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={(e) => handleDelete(product._id, e)}
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <FaImage className="empty-icon" />
            <p>Không tìm thấy sản phẩm nào</p>
            <button className="btn-add-empty" onClick={handleAddNew}>
              <FaPlus /> Thêm sản phẩm mới
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
