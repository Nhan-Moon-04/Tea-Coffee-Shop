import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaSave, FaTrash, FaImage, FaPlus, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './AdminProductDetail.css';

const AdminProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewProduct = id === 'new';
  
  const [loading, setLoading] = useState(!isNewProduct);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    image: '',
    images: [],
    stock: '',
    isActive: true,
    isFeatured: false,
    tags: []
  });
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newTag, setNewTag] = useState('');
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    fetchCategories();
    if (!isNewProduct) {
      fetchProduct();
    }
  }, [id, isNewProduct]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      const product = response.data.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category?._id || product.category || '',
        image: product.image || '',
        images: product.images || [],
        stock: product.stock || 0,
        isActive: product.isActive !== false,
        isFeatured: product.isFeatured || false,
        tags: product.tags || []
      });
      setPreviewImage(product.image || '');
    } catch (error) {
      toast.error('Không tìm thấy sản phẩm');
      navigate('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'image') {
      setPreviewImage(value);
    }
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImageUrl.trim()]
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    try {
      setSaving(true);
      const productData = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
        stock: Number(formData.stock) || 0
      };

      if (isNewProduct) {
        await api.post('/products', productData);
        toast.success('Thêm sản phẩm thành công!');
      } else {
        await api.put(`/products/${id}`, productData);
        toast.success('Cập nhật sản phẩm thành công!');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.')) {
      try {
        await api.delete(`/products/${id}`);
        toast.success('Xóa sản phẩm thành công!');
        navigate('/admin/products');
      } catch (error) {
        toast.error('Lỗi khi xóa sản phẩm');
      }
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="admin-product-detail">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate('/admin/products')}>
          <FaArrowLeft /> Quay lại
        </button>
        <h1>{isNewProduct ? 'Thêm sản phẩm mới' : 'Chi tiết sản phẩm'}</h1>
        <div className="header-actions">
          {!isNewProduct && (
            <button className="btn-delete" onClick={handleDelete}>
              <FaTrash /> Xóa
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="product-detail-form">
        <div className="form-layout">
          {/* Left Column - Main Info */}
          <div className="form-main">
            <div className="form-section">
              <h3>Thông tin cơ bản</h3>
              
              <div className="form-group">
                <label>Tên sản phẩm <span className="required">*</span></label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mô tả sản phẩm</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Nhập mô tả chi tiết về sản phẩm..."
                  rows="5"
                />
              </div>

              <div className="form-row three-cols">
                <div className="form-group">
                  <label>Giá bán <span className="required">*</span></label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                    required
                  />
                  {formData.price && (
                    <span className="price-preview">{formatCurrency(formData.price)}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Giá gốc</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                  {formData.originalPrice && (
                    <span className="price-preview original">{formatCurrency(formData.originalPrice)}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Số lượng tồn kho</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Danh mục <span className="required">*</span></label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Hình ảnh sản phẩm</h3>
              
              <div className="form-group">
                <label>Hình ảnh chính (URL)</label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {previewImage && (
                <div className="image-preview main-preview">
                  <img src={previewImage} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                </div>
              )}

              <div className="form-group">
                <label>Hình ảnh phụ</label>
                <div className="image-input-row">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Nhập URL hình ảnh"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                  />
                  <button type="button" className="btn-add-image" onClick={handleAddImage}>
                    <FaPlus /> Thêm
                  </button>
                </div>
              </div>

              {formData.images.length > 0 && (
                <div className="images-gallery">
                  {formData.images.map((img, index) => (
                    <div key={index} className="gallery-item">
                      <img src={img} alt={`Product ${index + 1}`} onError={(e) => e.target.src = 'https://via.placeholder.com/100'} />
                      <button 
                        type="button" 
                        className="btn-remove-image"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-section">
              <h3>Tags</h3>
              <div className="form-group">
                <div className="tag-input-row">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Nhập tag (ví dụ: best-seller, new)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <button type="button" className="btn-add-tag" onClick={handleAddTag}>
                    <FaPlus /> Thêm
                  </button>
                </div>
              </div>

              {formData.tags.length > 0 && (
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag-item">
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(index)}>
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Settings */}
          <div className="form-sidebar">
            <div className="form-section">
              <h3>Trạng thái</h3>
              
              <div className="status-toggles">
                <label className="toggle-item">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-switch"></span>
                  <span className="toggle-label">Đang bán</span>
                </label>

                <label className="toggle-item">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <span className="toggle-switch"></span>
                  <span className="toggle-label">Sản phẩm nổi bật</span>
                </label>
              </div>
            </div>

            <div className="form-section preview-card">
              <h3>Xem trước</h3>
              <div className="product-preview">
                <div className="preview-image">
                  {previewImage ? (
                    <img src={previewImage} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                  ) : (
                    <FaImage />
                  )}
                </div>
                <div className="preview-info">
                  <h4>{formData.name || 'Tên sản phẩm'}</h4>
                  <div className="preview-prices">
                    <span className="preview-price">{formatCurrency(formData.price) || '0 ₫'}</span>
                    {formData.originalPrice > formData.price && (
                      <span className="preview-original">{formatCurrency(formData.originalPrice)}</span>
                    )}
                  </div>
                  <div className="preview-badges">
                    {formData.isActive ? (
                      <span className="badge active">Đang bán</span>
                    ) : (
                      <span className="badge inactive">Ngừng bán</span>
                    )}
                    {formData.isFeatured && <span className="badge featured">Nổi bật</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions-sidebar">
              <button type="submit" className="btn-save" disabled={saving}>
                <FaSave /> {saving ? 'Đang lưu...' : (isNewProduct ? 'Thêm sản phẩm' : 'Lưu thay đổi')}
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => navigate('/admin/products')}
              >
                Hủy bỏ
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminProductDetail;
