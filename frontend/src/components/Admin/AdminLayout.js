import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaList, FaShoppingCart, FaUsers, FaSignOutAlt, FaStore } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: <FaHome />, label: 'Dashboard', end: true },
    { path: '/admin/products', icon: <FaBox />, label: 'Sản phẩm' },
    { path: '/admin/categories', icon: <FaList />, label: 'Danh mục' },
    { path: '/admin/orders', icon: <FaShoppingCart />, label: 'Đơn hàng' },
    { path: '/admin/users', icon: <FaUsers />, label: 'Người dùng' },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <FaStore className="sidebar-logo" />
          <h2>Admin Panel</h2>
        </div>
        
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/" className="nav-item back-to-store">
            <FaStore />
            <span>Về cửa hàng</span>
          </NavLink>
          <button onClick={handleLogout} className="nav-item logout-btn">
            <FaSignOutAlt />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
