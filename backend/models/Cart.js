const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Số lượng phải ít nhất là 1'],
    default: 1
  },
  size: {
    type: String,
    enum: ['S', 'M', 'L', 'XL'],
    default: 'M'
  },
  sweetLevel: {
    type: String,
    default: '100%'
  },
  iceLevel: {
    type: String,
    default: 'Bình thường'
  },
  toppings: [{
    name: String,
    price: Number
  }],
  price: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    maxlength: 200
  }
});

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total before save
CartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((total, item) => {
    const toppingsPrice = item.toppings.reduce((sum, t) => sum + (t.price || 0), 0);
    return total + ((item.price + toppingsPrice) * item.quantity);
  }, 0);
  next();
});

module.exports = mongoose.model('Cart', CartSchema);
