const mongoose = require("mongoose");

const shaftSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  flex: { 
    type: String, 
    enum: ["Ladies", "Senior", "Regular", "Stiff", "Extra Stiff"], 
    required: true 
  },
  weight: { type: Number, required: true }, // in grams
  torque: { type: Number, required: true }, // in degrees
  launch: { type: String, enum: ["Low", "Mid", "High"], required: true },
  spin: { type: String, enum: ["Low", "Mid", "High"], required: true },
  material: { type: String, enum: ["Graphite", "Steel"], required: true }
});
module.exports = mongoose.model("Shaft", shaftSchema, "Shafts");

