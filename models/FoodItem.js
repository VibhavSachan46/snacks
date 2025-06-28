const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  discount: {
    type: Number,
    default: 0, // Optional
  },
  quantity: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("FoodItem", foodItemSchema);
