# Tea & Coffee Shop 🍵☕

Website bán trà và cà phê được xây dựng với React, Node.js và MongoDB.

## Tính năng

### Khách hàng

- ✅ Xem sản phẩm không cần đăng nhập
- ✅ Lọc sản phẩm theo danh mục, giá cả
- ✅ Xem chi tiết sản phẩm
- ✅ Đăng ký / Đăng nhập với JWT
- ✅ Thêm sản phẩm vào giỏ hàng (cần đăng nhập)
- ✅ Tùy chọn size, độ ngọt, đá, topping
- ✅ Thanh toán đơn hàng

### Admin

- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục
- ✅ Quản lý đơn hàng
- ✅ Quản lý người dùng

## Cấu trúc Database

### Collections

1. **Users** - Người dùng (role: user/admin)
2. **Categories** - Danh mục sản phẩm
3. **Products** - Sản phẩm
4. **Cart** - Giỏ hàng
5. **Orders** - Đơn hàng
6. **Reviews** - Đánh giá
7. **Coupons** - Mã giảm giá

## Cài đặt

### Yêu cầu

- Node.js >= 14.x
- MongoDB Atlas hoặc MongoDB local
- npm hoặc yarn

### 1. Clone project

```bash
cd Shopee-Web
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cấu hình môi trường Backend

File `.env` đã được tạo sẵn với cấu hình MongoDB của bạn. Kiểm tra và chỉnh sửa nếu cần:

```env
PORT=5000
MONGODB_URI=mongodb+srv://nthiennhan1611:nhan123@cluster0.z0zjg.mongodb.net/tea-coffee-shop?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d
```

### 4. Seed dữ liệu mẫu

```bash
npm run seed
```

Điều này sẽ tạo:

- **Admin account**: admin@teacoffee.com / admin123
- **Test user**: user@teacoffee.com / user123
- 5 danh mục sản phẩm
- 15+ sản phẩm mẫu

### 5. Chạy Backend

```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

### 6. Cài đặt Frontend

Mở terminal mới:

```bash
cd frontend
npm install
```

### 7. Chạy Frontend

```bash
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## API Endpoints

### Auth

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user
- `POST /api/auth/logout` - Đăng xuất

### Products (Public)

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/slug/:slug` - Lấy sản phẩm theo slug
- `GET /api/products/featured` - Sản phẩm nổi bật
- `GET /api/products/bestseller` - Bán chạy nhất
- `GET /api/products/new` - Sản phẩm mới

### Categories (Public)

- `GET /api/categories` - Lấy danh sách danh mục
- `GET /api/categories/:id` - Chi tiết danh mục

### Cart (Private - cần đăng nhập)

- `GET /api/cart` - Lấy giỏ hàng
- `POST /api/cart` - Thêm vào giỏ hàng
- `PUT /api/cart/:itemId` - Cập nhật số lượng
- `DELETE /api/cart/:itemId` - Xóa item
- `DELETE /api/cart` - Xóa toàn bộ giỏ hàng

### Orders (Private)

- `GET /api/orders` - Lấy đơn hàng của user
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `PUT /api/orders/:id/cancel` - Hủy đơn hàng

### Admin

- `GET /api/orders/admin` - Lấy tất cả đơn hàng
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng
- `POST /api/products` - Tạo sản phẩm
- `PUT /api/products/:id` - Cập nhật sản phẩm
- `DELETE /api/products/:id` - Xóa sản phẩm

## Công nghệ sử dụng

### Frontend

- React 18
- React Router v6
- Axios
- React Toastify
- React Icons

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- express-validator

## Cấu trúc thư mục

```
Shopee-Web/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   ├── Order.js
│   │   ├── Review.js
│   │   └── Coupon.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── products.js
│   │   ├── categories.js
│   │   ├── cart.js
│   │   └── orders.js
│   ├── seeds/
│   │   └── seedData.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   │   ├── Header.js
│   │   │   │   └── Footer.js
│   │   │   ├── Product/
│   │   │   │   └── ProductCard.js
│   │   │   └── PrivateRoute.js
│   │   ├── context/
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Products.js
│   │   │   ├── ProductDetail.js
│   │   │   └── Cart.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## Tài khoản test

| Role  | Email               | Password |
| ----- | ------------------- | -------- |
| Admin | admin@teacoffee.com | admin123 |
| User  | user@teacoffee.com  | user123  |

## License

MIT
