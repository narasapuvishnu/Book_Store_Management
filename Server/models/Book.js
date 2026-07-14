const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    author: {
      type: String,
      required: true,
      trim: true
    },
    genre: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    itemImage: {
      type: String,
      required: true
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Seller',
      required: true
    },
    sellerName: {
      type: String,
      required: true
    },
    stock: {
      type: Number,
      default: 0
    },
    availability: {
      type: Boolean,
      default: true
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Auto compute availability based on stock
bookSchema.pre('save', function (next) {
  this.availability = this.stock > 0;
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, r) => acc + r.rating, 0);
    this.averageRating = parseFloat((sum / this.reviews.length).toFixed(1));
  } else {
    this.averageRating = 0;
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
