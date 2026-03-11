const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vui lòng nhập tên sản phẩm'],
    trim: true,
    maxlength: [100, 'Tên sản phẩm không được quá 100 ký tự']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Vui lòng nhập mô tả sản phẩm'],
    maxlength: [2000, 'Mô tả không được quá 2000 ký tự']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Mô tả ngắn không được quá 200 ký tự']
  },
  price: {
    type: Number,
    required: [true, 'Vui lòng nhập giá sản phẩm'],
    min: [0, 'Giá không được âm']
  },
  salePrice: {
    type: Number,
    min: [0, 'Giá khuyến mãi không được âm']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Vui lòng chọn danh mục']
  },
  images: [{
    type: String
  }],
  thumbnail: {
    type: String,
    default: ''
  },
  // Trọng lượng / Quy cách
  weight: {
    type: String,
    default: ''
  },
  // Đơn vị (g, kg, gói, hộp, lon...)
  unit: {
    type: String,
    default: ''
  },
  // Thương hiệu
  brand: {
    type: String,
    default: ''
  },
  // Xuất xứ
  origin: {
    type: String,
    default: ''
  },
  // Phân loại / Biến thể (ví dụ: 250g, 500g, 1kg)
  variants: [{
    name: String,
    price: Number
  }],
  stock: {
    type: Number,
    default: 100
  },
  sold: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create slug from name
ProductSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/[^a-zA-Z0-9 ]/g, '')
      .replace(/\s+/g, '-') + '-' + Date.now();
  }
  next();
});

// Index for search
ProductSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', ProductSchema);
