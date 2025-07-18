import express from 'express';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/multer.js';
import {
  addGear,
  getOwnerGears,
  getAllGears,
  getGearById,
  toggleGearAvailability,
  deleteGear
} from '../controllers/gearController.js';
import { checkAvailabilityOfGear } from '../controllers/gearBookingController.js';

const gearRouter = express.Router();

// ✅ Check Gear Availability
gearRouter.post('/check-availability', checkAvailabilityOfGear);

// ✅ Add Gear (Image Upload + Auth Required)
gearRouter.post('/add', protect, upload.single('image'), addGear);

// ✅ Get Gears Owned by Logged-In User
gearRouter.get('/owner', protect, getOwnerGears);

// ✅ Get All Available Gears
gearRouter.get('/all', getAllGears);

// ✅ Get Gear by ID
gearRouter.get('/:id', getGearById);

// ✅ Toggle Gear Availability
gearRouter.post('/toggle', protect, toggleGearAvailability);

// ✅ Delete Gear
gearRouter.post('/delete', protect, deleteGear);

export default gearRouter;

