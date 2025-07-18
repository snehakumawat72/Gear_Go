import mongoose from "mongoose";

const gearSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true }, // ImageKit URL
  pricePerDay: { type: Number, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  isAvaliable: { type: Boolean, default: true }, // Keep for backward compatibility

  features: { type: [String], default: [] }

}, { timestamps: true });

const GearModel = mongoose.model("Gear", gearSchema);

export default GearModel;
