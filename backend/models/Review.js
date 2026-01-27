const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: [true, 'Vui lòng đánh giá sản phẩm'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Vui lòng nhập nhận xét'],
    maxlength: 1000
  },
  images: [{
    type: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  reply: {
    content: String,
    repliedAt: Date
  }
}, {
  timestamps: true
});

// Prevent duplicate reviews
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Update product rating after review
ReviewSchema.statics.calcAverageRating = async function(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].avgRating * 10) / 10,
      numReviews: stats[0].numReviews
    });
  } else {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      rating: 0,
      numReviews: 0
    });
  }
};

ReviewSchema.post('save', function() {
  this.constructor.calcAverageRating(this.product);
});

ReviewSchema.post('remove', function() {
  this.constructor.calcAverageRating(this.product);
});

module.exports = mongoose.model('Review', ReviewSchema);
