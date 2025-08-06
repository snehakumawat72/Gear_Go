// server/routes/bookingRoutes.js
import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityOfCar,
  createBooking,
  createGearBooking,
  getOwnerBookings,
  getUserBookings,
  createPendingBooking,
  confirmBooking,
  getCarAvailability,
} from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/auth.js";
import { checkAvailabilityOfGear } from "../controllers/gearBookingController.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar);
bookingRouter.get('/check-availability-gear/:gearId', checkAvailabilityOfGear);
bookingRouter.get('/availability/:carId', getCarAvailability);
bookingRouter.post('/create', protect, createBooking);
bookingRouter.post('/create-gear', protect, createGearBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, getOwnerBookings);
bookingRouter.post('/change-status', protect, changeBookingStatus);

bookingRouter.post('/create-pending', protect, createPendingBooking);
bookingRouter.post('/confirm', protect, confirmBooking);

export default bookingRouter;
