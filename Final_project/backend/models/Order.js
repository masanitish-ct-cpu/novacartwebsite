const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [orderItemSchema],
    shippingAddress: {
      fullName: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: { type: String, enum: ['COD', 'Card'], default: 'COD' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    subtotal: { type: Number, required: true, default: 0 },
    shippingPrice: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    deliveredAt: Date,
    cancelledAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
