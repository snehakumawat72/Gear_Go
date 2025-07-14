import express from "express";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";

// --- Car Controllers ---
import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getDashboardData,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage
} from "../controllers/ownerController.js";

// --- Gear Controllers ---
import {
  addGear,
  getOwnerGears,
  toggleGearAvailability,
  deleteGear
} from "../controllers/gearController.js";

const ownerRouter = express.Router();

// --- Car Routes ---
ownerRouter.post("/change-role", protect, changeRoleToOwner);
ownerRouter.post("/add-car", upload.single("image"), protect, addCar);
ownerRouter.get("/cars", protect, getOwnerCars);
ownerRouter.post("/toggle-car", protect, toggleCarAvailability);
ownerRouter.post("/delete-car", protect, deleteCar);

// --- Gear Routes ---
ownerRouter.post("/add-gear", upload.single("image"), protect, addGear);
ownerRouter.get("/gears", protect, getOwnerGears);
ownerRouter.post("/toggle-gear", protect, toggleGearAvailability);
ownerRouter.post("/delete-gear", protect, deleteGear);

// --- Misc Routes ---
ownerRouter.get("/dashboard", protect, getDashboardData);
ownerRouter.post("/update-image", upload.single("image"), protect, updateUserImage);

export default ownerRouter;
