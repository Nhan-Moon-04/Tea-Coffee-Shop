# Hướng dẫn Deploy lên Armbian Server

## Bước 1: Chuẩn bị Armbian Server

### 1.1. Kết nối SSH đến Armbian

```bash
ssh root@<armbian-ip>
# hoặc
ssh <username>@<armbian-ip>
```

### 1.2. Update hệ thống

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3. Cài đặt Node.js

```bash
# Cài Node.js 18.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra version
node -v
npm -v
```

### 1.4. Cài đặt Git

```bash
sudo apt install git -y
```

## Bước 2: Clone Code từ GitHub

### ✅ Code đã có trên GitHub: https://github.com/Nhan-Moon-04/Shopee-Web

**Trên Armbian Server:**

```bash
# Tạo thư mục cho website
sudo mkdir -p /var/www
cd /var/www

# Clone repository
sudo git clone https://github.com/Nhan-Moon-04/Shopee-Web.git
cd Shopee-Web

# Cài dependencies
npm install
```

## Bước 3: Build Production

```bash
cd /var/www/Shopee-Web

# Build ứng dụng
npm run build
```

File build sẽ nằm trong thư mục `dist/` - đây là các file tĩnh HTML/CSS/JS.

## Bước 4: Cài đặt và Cấu hình Nginx

### 4.1. Cài đặt Nginx

```bash
sudo apt install nginx -y

# Start và enable nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4.2. Tạo file cấu hình cho website

```bash
sudo nano /etc/nginx/sites-available/shopee
```

Nội dung:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name _;  # Chấp nhận mọi IP/domain

    root /var/www/Shopee-Web/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

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
}
```

#### A3. Kích hoạt site

```bash
sudo ln -s /etc/nginx/sites-available/shopee /etc/nginx/sites-enabled/
sudo nginx -t  # Test cấu hình
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### A4. Cấu hình Firewall (nếu có)

```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

#### A5. Truy cập

- Local: `http://<armbian-ip>`
- Hoặc thêm vào file hosts của Windows: `C:\Windows\System32\drivers\etc\hosts`
  ```
  <armbian-ip>  shopee.local
  ```
  Sau đó truy cập: `http://shopee.local`

### 🚀 Phương án B: Serve (Đơn giản hơn)

#### B1. Cài đặt serve và PM2

```bash
sudo npm install -g serve pm2
```

#### B2. Chạy với PM2

```bash
cd /var/www/shopee
pm2 serve dist 3000 --name shopee --spa
pm2 save
pm2 startup  # Tự động chạy khi khởi động
```

#### B3. Quản lý với PM2

```bash
pm2 status      # Xem trạng thái
pm2 logs shopee # Xem logs
pm2 restart shopee  # Restart
pm2 stop shopee     # Stop
```

#### B4. Truy cập

`http://<armbian-ip>:3000`

### 🌐 Phương án C: Caddy (Tự động HTTPS)

#### C1. Cài đặt Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy -y
```

#### C2. Cấu hình Caddyfile

```bash
sudo nano /etc/caddy/Caddyfile
```

Nội dung:

```
shopee.yourdomain.com {  # Thay bằng domain của bạn
    root * /var/www/shopee/dist
    file_server
    try_files {path} /index.html
    encode gzip
}

# Hoặc chỉ dùng IP (không HTTPS)
:80 {
    root * /var/www/shopee/dist
    file_server
    try_files {path} /index.html
    encode gzip
}
```

#### C3. Restart Caddy

```bash
sudo systemctl restart caddy
sudo systemctl enable caddy
```

## Bước 5: Cấu hình Domain (Optional)

### Nếu có domain:

1. **Trỏ A Record:**
   - Vào DNS provider
   - Tạo A record: `shopee.yourdomain.com` → `<armbian-ip>`

2. **Cài SSL với Certbot (cho Nginx):**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d shopee.yourdomain.com
```

3. **Auto-renew SSL:**

```bash
sudo certbot renew --dry-run
```

## Bước 6: Monitoring và Maintenance

### Xem logs Nginx

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Xem logs PM2

```bash
pm2 logs shopee
```

### Update code khi có thay đổi

**Cách 1: Git pull**

```bash
cd /var/www/shopee
sudo git pull
sudo npm install
sudo npm run build
sudo systemctl restart nginx  # hoặc pm2 restart shopee
```

**Cách 2: Upload lại**

```bash
# Từ Windows
scp -r dist/* user@<armbian-ip>:/var/www/shopee/dist/
```

## Bước 7: Tối ưu hóa

### Cấu hình swap (cho RAM thấp)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Cài fail2ban (bảo mật)

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
```

### Auto cleanup

```bash
# Tạo cron job dọn dẹp logs
sudo crontab -e

# Thêm dòng này
0 2 * * * find /var/log/nginx -type f -name "*.log" -mtime +30 -delete
```

## Troubleshooting

### 1. Port 80/443 đã được sử dụng

```bash
sudo netstat -tulpn | grep :80
sudo systemctl stop apache2  # Nếu có Apache
```

### 2. Permission denied

```bash
sudo chown -R www-data:www-data /var/www/shopee
sudo chmod -R 755 /var/www/shopee
```

### 3. Nginx không start

```bash
sudo nginx -t  # Kiểm tra cấu hình
sudo journalctl -xe  # Xem lỗi
```

### 4. Không kết nối được Firebase

- Kiểm tra firewall: `sudo ufw status`
- Kiểm tra internet: `ping google.com`
- Kiểm tra DNS: `cat /etc/resolv.conf`

## Script tự động deploy

Tạo file `deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

cd /var/www/shopee

echo "📥 Pulling latest code..."
git pull

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building..."
npm run build

echo "🔄 Restarting services..."
if [ -f /etc/nginx/nginx.conf ]; then
    sudo systemctl restart nginx
    echo "✅ Nginx restarted"
fi

if command -v pm2 &> /dev/null; then
    pm2 restart shopee
    echo "✅ PM2 restarted"
fi

echo "✨ Deployment completed!"
```

Cấp quyền:

```bash
chmod +x deploy.sh
```

Chạy:

```bash
./deploy.sh
```

---

**Xong! Web của bạn đã chạy trên Armbian! 🎉**

Truy cập: `http://<armbian-ip>` hoặc `http://yourdomain.com`
