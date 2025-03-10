const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  loft: { type: Number, required: true },
  launch: { type: String, enum: ["Low", "Low-Mid", "Mid", "Mid-High", "High", "Very High"] },
  forgiveness: { type: String, enum: ["Moderate", "High", "Very High"] },
  swing_speed: { type: String, enum: ["Slow", "Slow-Moderate", "Moderate", "Moderate-Fast", "Fast"] },
  shot_shape_bias: { type: String, enum: ["Neutral", "Fade Bias", "Draw Bias"] },
  adjustability: { type: Boolean },
  price: { type: Number, min: 0 }
});

module.exports = mongoose.model('Driver', driverSchema, 'Drivers');