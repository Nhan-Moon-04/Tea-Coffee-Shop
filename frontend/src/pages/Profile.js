import { useState, useRef } from 'react';
import { FiUser, FiMail, FiPhone, FiCamera, FiSave, FiLock } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh tối đa 5MB!');
      return;
    }

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Cloudinary
    try {
      setUploadingAvatar(true);
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/upload/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setAvatar(response.data.url);
        toast.success('Upload avatar thành công!');
      }
    } catch (error) {
      toast.error('Lỗi khi upload avatar');
      setAvatarPreview(user?.avatar || '');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await api.put('/users/profile', {
        name: formData.name,
        phone: formData.phone,
        avatar: avatar
      });

      if (response.data.success) {
        updateUser(response.data.user);
        toast.success('Cập nhật thông tin thành công!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.data.success) {
        toast.success('Đổi mật khẩu thành công!');
        setShowPasswordForm(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Thông tin tài khoản</h1>
          <p>Quản lý thông tin cá nhân của bạn</p>
        </div>

        <div className="profile-content">
          {/* Avatar Section */}
          <div className="profile-sidebar">
            <div className="avatar-section">
              <div 
                className={`avatar-wrapper ${uploadingAvatar ? 'uploading' : ''}`}
                onClick={handleAvatarClick}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder">
                    <FiUser />
                  </div>
                )}
                <div className="avatar-overlay">
                  <FiCamera />
                  <span>Đổi ảnh</span>
                </div>
                {uploadingAvatar && (
                  <div className="avatar-loading">
                    <div className="spinner"></div>
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                hidden
              />
              <p className="avatar-hint">Nhấn vào ảnh để thay đổi</p>
            </div>

            <div className="user-info-card">
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
              <span className={`role-badge ${user?.role}`}>
                {user?.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}
              </span>
            </div>
          </div>

          {/* Form Section */}
          <div className="profile-main">
            <form onSubmit={handleSubmit} className="profile-form">
              <h2>Thông tin cơ bản</h2>

              <div className="form-group">
                <label>
                  <FiUser /> Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  <FiMail /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="disabled"
                />
                <span className="form-hint">Email không thể thay đổi</span>
              </div>

              <div className="form-group">
                <label>
                  <FiPhone /> Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-save"
                disabled={loading}
              >
                <FiSave />
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </form>

            {/* Password Section */}
            <div className="password-section">
              <div className="section-header">
                <h2>Bảo mật</h2>
                <button 
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  <FiLock />
                  {showPasswordForm ? 'Hủy' : 'Đổi mật khẩu'}
                </button>
              </div>

              {showPasswordForm && (
                <form onSubmit={handlePasswordSubmit} className="password-form">
                  <div className="form-group">
                    <label>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập lại mật khẩu mới"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
