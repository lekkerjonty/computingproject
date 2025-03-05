const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  loft: { type: [Number], required: true },
  shaftOptions: { type: [String], required: true },
  adjustability: {
    loft: { type: Boolean, default: false },
    lie: { type: Boolean, default: false },
    weight: { type: Boolean, default: false }
  },
  spin: { type: String, enum: ["Low", "Mid-Low", "Mid", "Mid-High", "High"], required: true },
  launch: { type: String, enum: ["Low", "Mid", "Mid-High", "High"], required: true },
  headMaterial: { type: String, required: true },
  headSize: { type: Number, required: true, min: 400, max: 460 },
  price: { type: Number, required: true, min: 0 }
});

const Driver = mongoose.model('Driver', driverSchema, 'Drivers'); // Explicitly specify the collection name

module.exports = Driver;