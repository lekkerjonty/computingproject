const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const driverSchema = new Schema({
  brand: { type: String},
  model: { type: String},
  year: { type: Number},
  loft: { type: [Number]},
  shaftOptions: { type: [String]},
  adjustability: {
    loft: { type: Boolean, default: false },
    lie: { type: Boolean, default: false },
    weight: { type: Boolean, default: false }
  },
  spin: { type: String, enum: ["Low", "Mid-Low", "Mid", "Mid-High", "High"]},
  launch: { type: String, enum: ["Low", "Mid", "Mid-High", "High"]},
  headMaterial: { type: String},
  headSize: { type: Number, min: 400, max: 460 },
  price: { type: Number, min: 0 }
});

module.exports = mongoose.model('dSchema', driverSchema, 'Drivers');