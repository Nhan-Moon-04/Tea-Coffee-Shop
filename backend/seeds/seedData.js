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
    description: 'Các loại cà phê đặc biệt',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400',
    order: 1
  },
  {
    name: 'Trà',
    description: 'Các loại trà thơm ngon',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    order: 2
  },
  {
    name: 'Trà Sữa',
    description: 'Trà sữa đủ vị',
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
    order: 3
  },
  {
    name: 'Đá Xay',
    description: 'Đá xay mát lạnh',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    order: 4
  },
  {
    name: 'Bánh Ngọt',
    description: 'Bánh ngọt ăn kèm',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    order: 5
  }
];

const products = [
  // Cà Phê
  {
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê phin truyền thống được pha với sữa đặc, thêm đá mát lạnh. Vị đắng nhẹ hòa quyện cùng vị ngọt béo của sữa.',
    shortDescription: 'Cà phê phin truyền thống với sữa đặc',
    price: 29000,
    salePrice: 25000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    images: [
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400'
    ],
    sizes: [
      { name: 'S', price: 25000 },
      { name: 'M', price: 29000 },
      { name: 'L', price: 35000 }
    ],
    toppings: [
      { name: 'Thạch cà phê', price: 8000 },
      { name: 'Shot espresso', price: 10000 }
    ],
    tags: ['cà phê', 'best seller'],
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Bạc Xỉu',
    description: 'Cà phê phin pha với nhiều sữa đặc, vị ngọt béo, thích hợp cho người mới uống cà phê.',
    shortDescription: 'Cà phê với nhiều sữa đặc',
    price: 29000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400',
    images: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400'
    ],
    sizes: [
      { name: 'S', price: 25000 },
      { name: 'M', price: 29000 },
      { name: 'L', price: 35000 }
    ],
    tags: ['cà phê'],
    isFeatured: true
  },
  {
    name: 'Americano',
    description: 'Espresso pha loãng với nước nóng, giữ nguyên hương vị đậm đà của cà phê.',
    shortDescription: 'Espresso pha loãng với nước',
    price: 39000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1521302080334-4bebac2763a6?w=400',
    sizes: [
      { name: 'S', price: 35000 },
      { name: 'M', price: 39000 },
      { name: 'L', price: 45000 }
    ],
    tags: ['cà phê', 'mới'],
    isNewArrival: true
  },
  {
    name: 'Cappuccino',
    description: 'Espresso kết hợp với sữa nóng và lớp bọt sữa mịn màng trên bề mặt.',
    shortDescription: 'Espresso với sữa nóng và bọt sữa',
    price: 45000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    sizes: [
      { name: 'S', price: 39000 },
      { name: 'M', price: 45000 },
      { name: 'L', price: 55000 }
    ],
    tags: ['cà phê'],
    isFeatured: true
  },
  {
    name: 'Latte',
    description: 'Espresso kết hợp với sữa tươi nóng, vị cà phê nhẹ nhàng, thơm ngon.',
    shortDescription: 'Espresso với sữa tươi nóng',
    price: 45000,
    categoryName: 'Cà Phê',
    thumbnail: 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400',
    sizes: [
      { name: 'S', price: 39000 },
      { name: 'M', price: 45000 },
      { name: 'L', price: 55000 }
    ],
    tags: ['cà phê']
  },
  // Trà
  {
    name: 'Trà Đào Cam Sả',
    description: 'Trà đào thơm ngát kết hợp với cam tươi và sả, mang đến vị thanh mát sảng khoái.',
    shortDescription: 'Trà đào với cam tươi và sả',
    price: 45000,
    salePrice: 39000,
    categoryName: 'Trà',
    thumbnail: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    sizes: [
      { name: 'M', price: 39000 },
      { name: 'L', price: 49000 }
    ],
    toppings: [
      { name: 'Thạch đào', price: 8000 },
      { name: 'Trân châu trắng', price: 8000 }
    ],
    tags: ['trà', 'best seller'],
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Trà Sen Vàng',
    description: 'Trà ướp hương sen thanh tao, vị ngọt nhẹ tự nhiên.',
    shortDescription: 'Trà ướp hương sen',
    price: 39000,
    categoryName: 'Trà',
    thumbnail: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400',
    sizes: [
      { name: 'M', price: 39000 },
      { name: 'L', price: 49000 }
    ],
    tags: ['trà'],
    isNewArrival: true
  },
  {
    name: 'Trà Oolong Sữa',
    description: 'Trà Oolong thơm ngon kết hợp với sữa tươi, vị đậm đà.',
    shortDescription: 'Trà Oolong với sữa tươi',
    price: 45000,
    categoryName: 'Trà',
    thumbnail: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400',
    sizes: [
      { name: 'M', price: 45000 },
      { name: 'L', price: 55000 }
    ],
    tags: ['trà']
  },
  // Trà Sữa
  {
    name: 'Trà Sữa Trân Châu Đường Đen',
    description: 'Trà sữa thơm ngon với trân châu đường đen dẻo dai, vị ngọt đậm đà.',
    shortDescription: 'Trà sữa với trân châu đường đen',
    price: 49000,
    categoryName: 'Trà Sữa',
    thumbnail: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=400',
    sizes: [
      { name: 'M', price: 49000 },
      { name: 'L', price: 59000 }
    ],
    toppings: [
      { name: 'Trân châu đường đen', price: 10000 },
      { name: 'Pudding', price: 10000 },
      { name: 'Thạch dừa', price: 8000 }
    ],
    tags: ['trà sữa', 'best seller'],
    isFeatured: true,
    isBestSeller: true
  },
  {
    name: 'Trà Sữa Matcha',
    description: 'Trà sữa vị matcha Nhật Bản, thơm ngon đặc biệt.',
    shortDescription: 'Trà sữa vị matcha',
    price: 49000,
    categoryName: 'Trà Sữa',
    thumbnail: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400',
    sizes: [
      { name: 'M', price: 49000 },
      { name: 'L', price: 59000 }
    ],
    toppings: [
      { name: 'Trân châu trắng', price: 8000 },
      { name: 'Thạch matcha', price: 10000 }
    ],
    tags: ['trà sữa'],
    isNewArrival: true
  },
  {
    name: 'Trà Sữa Khoai Môn',
    description: 'Trà sữa vị khoai môn thơm ngọt, béo ngậy.',
    shortDescription: 'Trà sữa vị khoai môn',
    price: 49000,
    categoryName: 'Trà Sữa',
    thumbnail: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400',
    sizes: [
      { name: 'M', price: 49000 },
      { name: 'L', price: 59000 }
    ],
    tags: ['trà sữa']
  },
  // Đá Xay
  {
    name: 'Chocolate Đá Xay',
    description: 'Chocolate đá xay mát lạnh, phủ kem whipping béo ngậy.',
    shortDescription: 'Chocolate đá xay với kem whipping',
    price: 55000,
    categoryName: 'Đá Xay',
    thumbnail: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400',
    sizes: [
      { name: 'M', price: 55000 },
      { name: 'L', price: 65000 }
    ],
    tags: ['đá xay'],
    isFeatured: true
  },
  {
    name: 'Caramel Đá Xay',
    description: 'Đá xay vị caramel ngọt ngào, phủ kem whipping và sốt caramel.',
    shortDescription: 'Đá xay vị caramel',
    price: 55000,
    categoryName: 'Đá Xay',
    thumbnail: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    sizes: [
      { name: 'M', price: 55000 },
      { name: 'L', price: 65000 }
    ],
    tags: ['đá xay']
  },
  // Bánh Ngọt
  {
    name: 'Bánh Tiramisu',
    description: 'Bánh Tiramisu Ý truyền thống với lớp kem mascarpone mịn màng.',
    shortDescription: 'Bánh Tiramisu Ý',
    price: 45000,
    categoryName: 'Bánh Ngọt',
    thumbnail: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400',
    sizes: [],
    sweetLevels: [],
    iceLevels: [],
    tags: ['bánh ngọt']
  },
  {
    name: 'Bánh Croissant',
    description: 'Bánh sừng bò Pháp giòn xốp, thơm bơ.',
    shortDescription: 'Bánh sừng bò Pháp',
    price: 35000,
    categoryName: 'Bánh Ngọt',
    thumbnail: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    sizes: [],
    sweetLevels: [],
    iceLevels: [],
    tags: ['bánh ngọt'],
    isBestSeller: true
  }
];

const adminUser = {
  name: 'Admin',
  email: 'admin@teacoffee.com',
  password: 'admin123',
  role: 'admin',
  phone: '0123456789'
};

const testUser = {
  name: 'Nguyen Van A',
  email: 'user@teacoffee.com',
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
    console.log('  Email: admin@teacoffee.com');
    console.log('  Password: admin123');
    console.log('');
    console.log('Test user account:');
    console.log('  Email: user@teacoffee.com');
    console.log('  Password: user123');
    console.log('=================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
