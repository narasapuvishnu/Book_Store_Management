const mongoose = require('mongoose');

const myOrderSchema = new mongoose.Schema(
  {
    shippingDetails: {
      flatno: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    bookDetails: {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
      title: { type: String, required: true },
      author: { type: String, required: true },
      genre: { type: String, required: true },
      description: { type: String, required: true },
      itemImage: { type: String, required: true }
    },
    buyer: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      userName: { type: String, required: true }
    },
    seller: {
      sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
      sellerName: { type: String, required: true }
    },
    order: {
      totalamount: { type: Number, required: true },
      BookingDate: { type: Date, default: Date.now },
      Delivery: { type: String, default: 'Pending' }, // Pending, Out for Delivery, Delivered
      expectedDeliveryDate: { type: Date }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('MyOrder', myOrderSchema);
