const mongoose = require('mongoose');

const mobileSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true,
  },
  model: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000, // Maximum description length
  },
  mobilePrice: {
    type: Number,
    required: true,
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: 0, // Minimum available copies should be 0
  },
  userId: {
    type: String,
    required: true,
  },
});

const Mobile = mongoose.model('Mobile', mobileSchema);

module.exports = Mobile;
