import { useState, useEffect } from 'react';
import { FaEye, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success('Cập nhật trạng thái thành công!');
      fetchOrders();
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('vi-VN');
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      confirmed: 'status-confirmed',
      shipping: 'status-shipping',
      delivered: 'status-delivered',
      cancelled: 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'Chờ xử lý',
      confirmed: 'Đã xác nhận',
      shipping: 'Đang giao',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy'
    };
    return statusTexts[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
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
    <div className="admin-orders">
      <div className="page-header">
        <h1>Quản lý đơn hàng</h1>
      </div>

      <div className="filters-bar">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="status-filter">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xử lý</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Ngày đặt</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>
                  <span className="order-id">#{order._id?.slice(-6).toUpperCase()}</span>
                </td>
                <td>
                  <div className="customer-info">
                    <span className="name">{order.user?.name || 'N/A'}</span>
                    <span className="email">{order.user?.email || ''}</span>
                  </div>
                </td>
                <td>
                  <span className="items-count">{order.items?.length || 0} sản phẩm</span>
                </td>
                <td>
                  <span className="total-amount">{formatCurrency(order.totalAmount)}</span>
                </td>
                <td>
                  <select
                    className={`status-select ${getStatusClass(order.status)}`}
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  >
                    <option value="pending">Chờ xử lý</option>
                    <option value="confirmed">Đã xác nhận</option>
                    <option value="shipping">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                    <option value="cancelled">Đã hủy</option>
                  </select>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td>
                  <button className="btn-view" onClick={() => viewOrderDetails(order)}>
                    <FaEye /> Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <p>Không tìm thấy đơn hàng nào</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content order-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết đơn hàng #{selectedOrder._id?.slice(-6).toUpperCase()}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="order-details">
              <div className="detail-section">
                <h3>Thông tin khách hàng</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Họ tên:</label>
                    <span>{selectedOrder.shippingAddress?.fullName || selectedOrder.user?.name}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedOrder.user?.email}</span>
                  </div>
                  <div className="detail-item">
                    <label>Điện thoại:</label>
                    <span>{selectedOrder.shippingAddress?.phone}</span>
                  </div>
                  <div className="detail-item full-width">
                    <label>Địa chỉ:</label>
                    <span>
                      {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.ward}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Sản phẩm</h3>
                <div className="order-items">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      <div className="item-image">
                        {item.product?.image ? (
                          <img src={item.product.image} alt={item.product.name} />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                      <div className="item-info">
                        <h4>{item.product?.name || 'Sản phẩm không tồn tại'}</h4>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Thanh toán</h3>
                <div className="payment-summary">
                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount - (selectedOrder.shippingFee || 0))}</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>{formatCurrency(selectedOrder.shippingFee || 0)}</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="summary-row discount">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Trạng thái đơn hàng</h3>
                <select
                  className={`status-select large ${getStatusClass(selectedOrder.status)}`}
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {selectedOrder.note && (
                <div className="detail-section">
                  <h3>Ghi chú</h3>
                  <p className="order-note">{selectedOrder.note}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
