// server/routes/bookingRoutes.js
import express from "express";
import {
  changeBookingStatus,
  checkAvailabilityOfCar,
  createBooking,
  createGearBooking,
  getOwnerBookings,
  getUserBookings,
  createOrder,
  razorpayWebhookHandler
} from "../controllers/bookingController.js";
import { protect } from "../middleware/auth.js";

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityOfCar);
// bookingRouter.post('/create', protect, createBooking);
bookingRouter.post('/create-gear', protect, createGearBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/owner', protect, getOwnerBookings);
bookingRouter.post('/change-status', protect, changeBookingStatus);

bookingRouter.post('/create-order',protect, createOrder)

// booking callback: protect if you want req.user populated
bookingRouter.post('/create',express.raw({ type: 'application/json' }), razorpayWebhookHandler)

export default bookingRouter;
