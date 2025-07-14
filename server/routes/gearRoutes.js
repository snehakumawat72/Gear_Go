import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
  addGear,
  getOwnerGears,
  getAllGears,
  getGearById, // ✅ Add this
} from '../controllers/gearController.js';

const gearRouter = express.Router();

// ✅ Add Gear (Image Upload + Auth Required)
gearRouter.post('/add', protect, upload.single('image'), addGear);

// ✅ Get Gears Owned by Logged-In User
gearRouter.get('/owner', protect, getOwnerGears);

// ✅ Get All Available Gears
gearRouter.get('/all', getAllGears);

// ✅ Get Gear by ID
gearRouter.get('/:id', getGearById); // ✅ Required for /gear-details/:id

export default gearRouter;

