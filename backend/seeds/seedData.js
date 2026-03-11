const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const categories = [
  {
    name: 'Cà Phê',
    description: 'Các loại cà phê bột, cà phê hạt, cà phê hòa tan',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    order: 1
  },
  {
    name: 'Trà',
    description: 'Các loại trà túi lọc, trà lá, trà thảo mộc',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    order: 2
  },
  {
    name: 'Combo & Hộp Quà',
    description: 'Combo tiết kiệm và hộp quà tặng',
    image: 'https://images.unsplash.com/photo-1513530176992-0cf39c4cbed4?w=400',
    order: 3
  },
  {
    name: 'Nguyên Liệu Pha Chế',
    description: 'Sữa đặc, bột kem, topping, syrup',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    order: 4
  },
  {
    name: 'Phụ Kiện',
    description: 'Phin, ly, bộ pha trà và dụng cụ pha chế',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    order: 5
  }
];

const products = [
  // Cà Phê
  {
    name: 'Cà Phê Hiền Tea Coffee 500g',
    description: 'Cà phê Hiền Tea Coffee rang xay nguyên chất 500g, hương vị đậm đà, thơm nồng. Được chọn lọc từ những hạt cà phê Robusta chất lượng cao vùng Tây Nguyên, rang mộc không tẩm ướp.',
    shortDescription: 'Cà phê rang xay nguyên chất 500g',
    price: 120000,
    salePrice: 99000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    images: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400'
    ],
    weight: '500g',
    unit: 'gói',
    brand: 'Hiền Tea Coffee',
    origin: 'Việt Nam',
    variants: [
      { name: '250g', price: 65000 },
      { name: '500g', price: 120000 },
      { name: '1kg', price: 220000 }
    ],
    tags: ['cà phê', 'rang xay', 'best seller'],
    stock: 200,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Cà Phê Hiền Tea Coffee Hạt Nguyên 500g',
    description: 'Cà phê hạt nguyên Hiền Tea Coffee 500g, Robusta Buôn Ma Thuột. Hạt to đều, rang vừa, giữ nguyên hương thơm tự nhiên. Phù hợp cho máy xay cà phê tại nhà.',
    shortDescription: 'Cà phê hạt nguyên chất Robusta',
    price: 135000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400',
    images: [
      'https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400'
    ],
    weight: '500g',
    unit: 'gói',
    brand: 'Hiền Tea Coffee',
    origin: 'Việt Nam',
    variants: [
      { name: '500g', price: 135000 },
      { name: '1kg', price: 250000 }
    ],
    tags: ['cà phê', 'hạt nguyên'],
    stock: 150,
    isFeatured: true
  },
  {
    name: 'Cà Phê Hòa Tan 3in1 Hiền Tea Coffee',
    description: 'Cà phê hòa tan 3in1 Hiền Tea Coffee, hộp 20 gói x 18g. Tiện lợi, đậm đà, thơm ngon. Pha nhanh chỉ cần thêm nước nóng.',
    shortDescription: 'Cà phê hòa tan tiện lợi 20 gói',
    price: 75000,
    salePrice: 65000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    weight: '360g (20 x 18g)',
    unit: 'hộp',
    brand: 'Hiền Tea Coffee',
    origin: 'Việt Nam',
    variants: [],
    tags: ['cà phê', 'hòa tan', '3in1'],
    stock: 300,
    isNewArrival: true
  },
  {
    name: 'Cà Phê Sữa Đá Lon Hiền Tea Coffee',
    description: 'Cà phê sữa đá lon Hiền Tea Coffee, thùng 24 lon x 240ml. Vị cà phê sữa truyền thống, tiện lợi mang theo mọi lúc mọi nơi.',
    shortDescription: 'Cà phê sữa đóng lon 24 lon/thùng',
    price: 280000,
    salePrice: 245000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    weight: '24 x 240ml',
    unit: 'thùng',
    brand: 'Hiền Tea Coffee',
    origin: 'Việt Nam',
    variants: [
      { name: '6 lon', price: 75000 },
      { name: '12 lon', price: 145000 },
      { name: '24 lon', price: 280000 }
    ],
    tags: ['cà phê', 'đóng lon'],
    stock: 100,
    isFeatured: true
  },
  {
    name: 'Cà Phê Moka Cầu Đất 250g',
    description: 'Cà phê Moka Cầu Đất Đà Lạt 250g, loại đặc biệt. Hương thơm quyến rũ, vị chua thanh nhẹ, hậu ngọt. Thích hợp pha phin truyền thống.',
    shortDescription: 'Cà phê Moka cao cấp Cầu Đất',
    price: 180000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    weight: '250g',
    unit: 'gói',
    brand: 'Hiền Tea Coffee',
    origin: 'Đà Lạt, Việt Nam',
    variants: [
      { name: '250g', price: 180000 },
      { name: '500g', price: 340000 }
    ],
    tags: ['cà phê', 'moka', 'cao cấp'],
    stock: 80,
    isFeatured: true
  },
  // Trà
  {
    name: 'Trà Oolong Bảo Lộc 200g',
    description: 'Trà Oolong Bảo Lộc 200g, trà lá nguyên chất. Hương thơm nhẹ nhàng, nước trà trong xanh, vị ngọt hậu. Sản phẩm chất lượng từ vùng trà nổi tiếng Bảo Lộc.',
    shortDescription: 'Trà Oolong nguyên lá Bảo Lộc',
    price: 95000,
    salePrice: 79000,
    categoryName: 'Trà',
    thumbnail: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    weight: '200g',
    unit: 'gói',
    brand: 'Hiền Tea Coffee',
    origin: 'Bảo Lộc, Việt Nam',
    variants: [
      { name: '100g', price: 55000 },
      { name: '200g', price: 95000 },
      { name: '500g', price: 210000 }
    ],
    tags: ['trà', 'oolong', 'best seller'],
    stock: 200,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Trà Sen Tây Hồ 100g',
    description: 'Trà Sen Tây Hồ 100g, trà ướp hương sen thanh tao. Được ướp thủ công với cánh sen tươi Tây Hồ, mùi thơm dịu nhẹ, vị ngọt tự nhiên.',
    shortDescription: 'Trà ướp hương sen Tây Hồ',
    price: 150000,
    categoryName: 'Trà',
    thumbnail: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    weight: '100g',
    unit: 'hộp',
    brand: 'Hiền Tea Coffee',
    origin: 'Hà Nội, Việt Nam',
    variants: [
      { name: '50g', price: 85000 },
      { name: '100g', price: 150000 }
    ],
    tags: ['trà', 'trà sen', 'cao cấp'],
    stock: 50,
    isNewArrival: true
  },
  {
    name: 'Trà Hoa Cúc Túi Lọc 25 gói',
    description: 'Trà hoa cúc túi lọc 25 gói, giúp thư giãn, ngủ ngon. 100% hoa cúc tự nhiên sấy khô, không chất bảo quản.',
    shortDescription: 'Trà hoa cúc túi lọc tiện lợi',
    price: 55000,
    categoryName: 'Trà',
    thumbnail: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400',
    weight: '50g (25 x 2g)',
    unit: 'hộp',
    brand: 'Hiền Tea Coffee',
    origin: 'Việt Nam',
    variants: [],
    tags: ['trà', 'thảo mộc', 'túi lọc'],
    stock: 250,
    isBestSeller: true
  },
  {
    name: 'Trà Xanh Thái Nguyên 500g',
    description: 'Trà xanh Thái Nguyên 500g, loại đặc sản. Lá trà búp non, pha nước xanh trong, hương thơm đặc trưng. Thích hợp uống hàng ngày.',
    shortDescription: 'Trà xanh đặc sản Thái Nguyên',
    price: 110000,
    categoryName: 'Trà',
    thumbnail: 'https://images.unsplash.com/photo-1563911892437-1feda0179e1b?w=400',
    weight: '500g',
    unit: 'gói',
    brand: 'Hiền Tea Coffee',
    origin: 'Thái Nguyên, Việt Nam',
    variants: [
      { name: '200g', price: 50000 },
      { name: '500g', price: 110000 },
      { name: '1kg', price: 200000 }
    ],
    tags: ['trà', 'trà xanh'],
    stock: 180,
    isFeatured: true
  },
  // Combo & Hộp Quà
  {
    name: 'Combo Cà Phê & Trà Hiền Tea Coffee',
    description: 'Combo tiết kiệm gồm 1 gói Cà Phê Hiền Tea Coffee 500g + 1 gói Trà Oolong 200g. Tiết kiệm 30% so với mua lẻ. Quà tặng ý nghĩa cho người thân.',
    shortDescription: 'Combo cà phê 500g + trà oolong 200g',
    price: 215000,
    salePrice: 155000,
    categoryName: 'Combo & Hộp Quà',
    thumbnail: 'https://images.unsplash.com/photo-1513530176992-0cf39c4cbed4?w=400',
    weight: '700g',
    unit: 'combo',
    brand: 'Hiền Tea Coffee',
    origin: 'Việt Nam',
    variants: [],
    tags: ['combo', 'quà tặng', 'best seller'],
    stock: 60,
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Hộp Quà Tết Hiền Tea Coffee Premium',
    description: 'Hộp quà Tết sang trọng gồm: 1 gói Cà phê Moka 250g + 1 hộp Trà Sen 100g + 1 phin pha cà phê inox. Hộp thiết kế sang trọng, phù hợp biếu tặng.',
    shortDescription: 'Hộp quà Tết cao cấp cho biếu tặng',
    price: 450000,
    salePrice: 380000,
    categoryName: 'Combo & Hộp Quà',
    thumbnail: 'https://images.unsplash.com/photo-1549465220-1a8b9238f7e1?w=400',
    weight: '350g + phin',
    unit: 'hộp',
    brand: 'Hiền Tea Coffee',
    origin: 'Việt Nam',
    variants: [],
    tags: ['quà tặng', 'tết', 'premium'],
    stock: 30,
    isNewArrival: true,
    isFeatured: true
  },
  // Nguyên Liệu Pha Chế
  {
    name: 'Sữa Đặc Ông Thọ 380g',
    description: 'Sữa đặc có đường Ông Thọ 380g. Dùng để pha cà phê sữa, làm bánh, nấu chè. Vị ngọt béo đặc trưng.',
    shortDescription: 'Sữa đặc có đường lon 380g',
    price: 28000,
    categoryName: 'Nguyên Liệu Pha Chế',
    thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    weight: '380g',
    unit: 'lon',
    brand: 'Ông Thọ',
    origin: 'Việt Nam',
    variants: [],
    tags: ['sữa đặc', 'nguyên liệu'],
    stock: 500,
    isBestSeller: true
  },
  {
    name: 'Bột Kem Béo Pha Trà Sữa 1kg',
    description: 'Bột kem béo (non-dairy creamer) 1kg, dùng pha trà sữa, cà phê. Tạo vị béo ngậy, thơm ngon cho thức uống.',
    shortDescription: 'Bột kem béo pha trà sữa 1kg',
    price: 85000,
    categoryName: 'Nguyên Liệu Pha Chế',
    thumbnail: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
    weight: '1kg',
    unit: 'gói',
    brand: 'Hiền Tea Coffee',
    origin: 'Việt Nam',
    variants: [
      { name: '500g', price: 48000 },
      { name: '1kg', price: 85000 }
    ],
    tags: ['nguyên liệu', 'pha chế'],
    stock: 120,
    isFeatured: true
  },
  // Phụ Kiện
  {
    name: 'Phin Pha Cà Phê Inox Cao Cấp',
    description: 'Phin pha cà phê inox 304 cao cấp, thiết kế truyền thống Việt Nam. Lỗ lọc đều, cho nước cà phê trong và thơm. Bền đẹp theo thời gian.',
    shortDescription: 'Phin inox 304 pha cà phê truyền thống',
    price: 45000,
    categoryName: 'Phụ Kiện',
    thumbnail: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    weight: '150g',
    unit: 'cái',
    brand: 'Hiền Tea Coffee',
    origin: 'Việt Nam',
    variants: [],
    tags: ['phụ kiện', 'phin'],
    stock: 200
  },
  {
    name: 'Bộ Ấm Trà Sứ Bát Tràng',
    description: 'Bộ ấm trà sứ Bát Tràng cao cấp, gồm 1 ấm + 6 chén. Hoa văn truyền thống, men sứ bóng mịn. Quà tặng ý nghĩa.',
    shortDescription: 'Bộ ấm trà sứ 1 ấm + 6 chén',
    price: 350000,
    salePrice: 289000,
    categoryName: 'Phụ Kiện',
    thumbnail: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    weight: '1.2kg',
    unit: 'bộ',
    brand: 'Bát Tràng',
    origin: 'Việt Nam',
    variants: [],
    tags: ['phụ kiện', 'ấm trà', 'quà tặng'],
    stock: 40,
    isNewArrival: true
  }
];

const adminUser = {
  name: 'Admin',
  email: 'admin@phathai.shop',
  password: 'admin123',
  role: 'admin',
  phone: '0123456789'
};

const testUser = {
  name: 'Nguyen Van A',
  email: 'user@phathai.shop',
  password: 'user123',
  role: 'user',
  phone: '0987654321'
};

// Helper function to generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '-') + '-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data and indexes
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    
    // Drop existing indexes to avoid issues
    try {
      await Product.collection.dropIndexes();
    } catch (e) {
      // Indexes may not exist yet
    }
    try {
      await Category.collection.dropIndexes();
    } catch (e) {
      // Indexes may not exist yet
    }

    console.log('Cleared existing data');

    // Create admin and test user
    const admin = await User.create(adminUser);
    const user = await User.create(testUser);
    console.log('Created users');

    // Create categories with slugs
    const categoriesWithSlugs = categories.map((cat, index) => ({
      ...cat,
      slug: generateSlug(cat.name) + index
    }));
    
    // Create categories one by one to trigger middleware
    const createdCategories = [];
    for (const catData of categoriesWithSlugs) {
      const created = await Category.create(catData);
      createdCategories.push(created);
    }
    console.log('Created categories');

    // Create products with category references and slugs
    const productsWithCategory = products.map((product, index) => {
      const category = createdCategories.find(cat => cat.name === product.categoryName);
      return {
        ...product,
        category: category._id,
        slug: generateSlug(product.name) + index // Add index to ensure uniqueness
      };
    });

    // Use create() instead of insertMany() to trigger middleware
    for (const productData of productsWithCategory) {
      await Product.create(productData);
    }
    console.log('Created products');

    console.log('=================================');
    console.log('Seed data completed successfully!');
    console.log('=================================');
    console.log('Admin account:');
    console.log('  Email: admin@phathai.shop');
    console.log('  Password: admin123');
    console.log('');
    console.log('Test user account:');
    console.log('  Email: user@phathai.shop');
    console.log('  Password: user123');
    console.log('=================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
