const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  thumbnail: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  size: String,
  sweetLevel: String,
  iceLevel: String,
  toppings: [{
    name: String,
    price: Number
  }],
  price: {
    type: Number,
    required: true
  },
  note: String
});

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderCode: {
    type: String,
    unique: true
  },
  items: [OrderItemSchema],
  shippingAddress: {
    fullName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    province: String,
    district: String,
    ward: String,
    address: {
      type: String,
      required: true
    }
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'MOMO', 'VNPAY', 'BANKING'],
    default: 'COD'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled'],
    default: 'pending'
  },
  itemsPrice: {
    type: Number,
    required: true
  },
  shippingPrice: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  totalPrice: {
    type: Number,
    required: true
  },
  couponCode: String,
  note: String,
  cancelReason: String,
  deliveredAt: Date,
  paidAt: Date
}, {
  timestamps: true
});

// Generate order code before save
OrderSchema.pre('save', async function(next) {
  if (!this.orderCode) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.orderCode = `TC${year}${month}${day}${random}`;
  }
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
