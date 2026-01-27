# 🔒 Hướng dẫn Deploy Tea-Coffee-Shop lên Armbian với HTTPS (Port 443)

> **Lưu ý:** File này hướng dẫn deploy HTTPS trên port 443. Port 80 đã được sử dụng cho dự án khác.

## 📋 Yêu cầu

- Armbian Server đã cài Node.js, Nginx
- Domain đã trỏ về IP server (hoặc dùng self-signed certificate cho local)
- Repository: https://github.com/Nhan-Moon-04/Tea-Coffee-Shop

---

## Bước 1: Clone Code từ GitHub

```bash
# SSH vào Armbian
ssh root@<armbian-ip>

# Tạo thư mục cho Tea-Coffee-Shop
sudo mkdir -p /var/www/tea-coffee
cd /var/www

# Clone repository
sudo git clone https://github.com/Nhan-Moon-04/Tea-Coffee-Shop.git tea-coffee
cd tea-coffee
```

---

## Bước 2: Cài đặt Dependencies

### 2.1. Backend

```bash
cd /var/www/tea-coffee/backend

# Cài dependencies
npm install

# Tạo file .env
sudo nano .env
```

Nội dung `.env`:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://nthiennhan1611:nhan123@cluster0.z0zjg.mongodb.net/tea-coffee-shop
JWT_SECRET=your_super_secret_jwt_key_here_12345
JWT_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=dcgpkfmsn
CLOUDINARY_API_KEY=573541266587715
CLOUDINARY_API_SECRET=_iWuIlvYt2C5o5YopDBz4czD0WY
```

### 2.2. Frontend

```bash
cd /var/www/tea-coffee/frontend

# Cài dependencies
npm install

# Tạo file .env.production cho API URL
sudo nano .env.production
```

Nội dung `.env.production`:

```env
REACT_APP_API_URL=https://yourdomain.com/api
```

> Thay `yourdomain.com` bằng domain của bạn hoặc IP server.

---

## Bước 3: Build Frontend

```bash
cd /var/www/tea-coffee/frontend
npm run build
```

File build sẽ nằm trong thư mục `build/`.

---

## Bước 4: Cài đặt PM2 cho Backend

```bash
# Cài PM2 nếu chưa có
sudo npm install -g pm2

# Chạy Backend với PM2
cd /var/www/tea-coffee/backend
pm2 start server.js --name tea-coffee-api

# Lưu và tự động chạy khi khởi động
pm2 save
pm2 startup
```

---

## Bước 5: Tạo SSL Certificate

### 🔐 Phương án A: Self-Signed Certificate (Cho local/test)

```bash
# Tạo thư mục chứa SSL
sudo mkdir -p /etc/nginx/ssl

# Tạo self-signed certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/tea-coffee.key \
    -out /etc/nginx/ssl/tea-coffee.crt \
    -subj "/C=VN/ST=DongThap/L=TamNong/O=TeaCoffee/CN=tea-coffee.local"
```

### 🌐 Phương án B: Let's Encrypt (Cho domain thật)

```bash
# Cài Certbot
sudo apt install certbot python3-certbot-nginx -y

# Lấy certificate (chạy sau khi cấu hình Nginx)
sudo certbot --nginx -d yourdomain.com
```

---

## Bước 6: Cấu hình Nginx cho HTTPS (Port 443)

### 6.1. Tạo file cấu hình

```bash
sudo nano /etc/nginx/sites-available/tea-coffee
```

### 6.2. Nội dung cấu hình (Self-Signed SSL)

```nginx
# Redirect HTTP to HTTPS (optional - nếu muốn redirect từ port khác)
# server {
#     listen 8080;
#     server_name _;
#     return 301 https://$host$request_uri;
# }

# HTTPS Server - Port 443
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name _;  # Thay bằng domain nếu có

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/tea-coffee.crt;
    ssl_certificate_key /etc/nginx/ssl/tea-coffee.key;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Frontend (React build)
    root /var/www/tea-coffee/frontend/build;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # API Proxy - Backend Node.js
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Upload endpoint
    location /api/upload {
        client_max_body_size 20M;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React Router - SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}
```

### 6.3. Nội dung cấu hình (Let's Encrypt SSL - cho domain thật)

```nginx
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name yourdomain.com;  # Thay bằng domain của bạn

    # Let's Encrypt SSL
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Frontend
    root /var/www/tea-coffee/frontend/build;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Upload
    location /api/upload {
        client_max_body_size 20M;
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # React SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
}

# Redirect HTTP to HTTPS
server {
    listen 8080;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

---

## Bước 7: Kích hoạt Site

```bash
# Tạo symlink
sudo ln -s /etc/nginx/sites-available/tea-coffee /etc/nginx/sites-enabled/

# Test cấu hình
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Bước 8: Cấu hình Firewall

```bash
# Mở port 443
sudo ufw allow 443/tcp

# Kiểm tra
sudo ufw status
```

---

## Bước 9: Cấu hình Frontend API URL

### Sửa file `api.js` để dùng relative URL:

```bash
cd /var/www/tea-coffee/frontend/src/services
sudo nano api.js
```

Đảm bảo `baseURL` là:

```javascript
const api = axios.create({
  baseURL: "/api", // Relative URL - Nginx sẽ proxy
  // ...
});
```

Sau đó build lại:

```bash
cd /var/www/tea-coffee/frontend
npm run build
```

---

## Bước 10: Truy cập

### Với Self-Signed Certificate:

```
https://<armbian-ip>
```

> ⚠️ Trình duyệt sẽ cảnh báo vì self-signed. Click "Advanced" → "Proceed" để tiếp tục.

### Với Let's Encrypt:

```
https://yourdomain.com
```

### Thêm vào file hosts (Windows) để test:

```
# C:\Windows\System32\drivers\etc\hosts
<armbian-ip>  tea-coffee.local
```

Truy cập: `https://tea-coffee.local`

---

## 🔄 Script Auto Deploy

Tạo file `deploy.sh`:

```bash
sudo nano /var/www/tea-coffee/deploy.sh
```

Nội dung:

```bash
#!/bin/bash

echo "🚀 Starting Tea-Coffee-Shop deployment..."

cd /var/www/tea-coffee

echo "📥 Pulling latest code..."
git pull origin main

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🔨 Building frontend..."
npm run build

echo "🔄 Restarting services..."
pm2 restart tea-coffee-api
sudo systemctl restart nginx

echo "✨ Deployment completed!"
echo "🌐 Access: https://<your-ip-or-domain>"
```

Cấp quyền và chạy:

```bash
chmod +x /var/www/tea-coffee/deploy.sh
/var/www/tea-coffee/deploy.sh
```

---

## 📊 Quản lý Services

### PM2 (Backend API)

```bash
pm2 status              # Xem trạng thái
pm2 logs tea-coffee-api # Xem logs
pm2 restart tea-coffee-api  # Restart
pm2 stop tea-coffee-api     # Stop
```

### Nginx

```bash
sudo systemctl status nginx   # Trạng thái
sudo systemctl restart nginx  # Restart
sudo nginx -t                 # Test config
```

### Xem logs

```bash
# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Backend logs
pm2 logs tea-coffee-api --lines 100
```

---

## 🔧 Troubleshooting

### 1. Port 443 đã được sử dụng

```bash
sudo netstat -tulpn | grep :443
# Tắt process đang dùng port 443
sudo kill -9 <PID>
```

### 2. SSL Certificate Error

```bash
# Kiểm tra certificate
sudo openssl x509 -in /etc/nginx/ssl/tea-coffee.crt -text -noout

# Tạo lại certificate
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/tea-coffee.key \
    -out /etc/nginx/ssl/tea-coffee.crt
```

### 3. Nginx không start

```bash
sudo nginx -t           # Kiểm tra lỗi cấu hình
sudo journalctl -xe     # Xem lỗi chi tiết
```

### 4. API không hoạt động

```bash
# Kiểm tra backend đang chạy
pm2 status

# Kiểm tra port 5000
curl http://localhost:5000/api/products

# Xem logs backend
pm2 logs tea-coffee-api
```

### 5. CORS Error

Đảm bảo backend cho phép origin từ HTTPS:

```javascript
// backend/server.js
app.use(
  cors({
    origin: ["https://yourdomain.com", "https://localhost"],
    credentials: true,
  }),
);
```

### 6. Mixed Content Error

Đảm bảo tất cả requests đều dùng HTTPS, không có HTTP.

---

## 📁 Cấu trúc thư mục

```
/var/www/
├── Shopee-Web/          # Port 80 (đã có)
└── tea-coffee/          # Port 443 (mới)
    ├── backend/
    │   ├── server.js
    │   ├── .env
    │   └── ...
    ├── frontend/
    │   ├── build/       # Production build
    │   └── ...
    └── deploy.sh
```

---

## ✅ Checklist

- [ ] Clone code từ GitHub
- [ ] Cài dependencies (backend + frontend)
- [ ] Tạo file .env cho backend
- [ ] Build frontend
- [ ] Chạy backend với PM2
- [ ] Tạo SSL certificate
- [ ] Cấu hình Nginx
- [ ] Mở port 443 trên firewall
- [ ] Test truy cập HTTPS

---

**🎉 Xong! Tea-Coffee-Shop đã chạy trên HTTPS port 443!**

- Port 80: Shopee-Web (project cũ)
- Port 443: Tea-Coffee-Shop (project mới - HTTPS)

Truy cập: `https://<armbian-ip>` hoặc `https://yourdomain.com`
