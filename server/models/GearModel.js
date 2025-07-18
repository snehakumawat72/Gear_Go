import mongoose from "mongoose";

const gearSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String, // Assume ImageKit URL
      required: true,
    },
    pricePerDay: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String, // If it's a ref to City or Place, change to: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' }
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    features: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Avoid overwrite errors in dev with hot-reload
const GearModel = mongoose.models.Gear || mongoose.model("Gear", gearSchema);

export default GearModel;
