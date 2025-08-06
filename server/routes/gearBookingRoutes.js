import express from "express";
import {
createGearBooking,
getUserGearBookings,
getOwnerGearBookings,
checkAvailabilityOfGear,
changeGearBookingStatus,
getGearAvailability,
createPendingGearBooking,
confirmGearBooking,
} from "../controllers/gearBookingController.js";
import { protect } from "../middleware/auth.js";

const gearBookingRouter = express.Router();

// Check gear availability
gearBookingRouter.post("/check-availability", checkAvailabilityOfGear);

// Get gear availability for calendar
gearBookingRouter.get("/availability/:gearId", getGearAvailability);

// Create gear booking (requires login)
gearBookingRouter.post("/create", protect, createGearBooking);

// Create pending gear booking (requires login)
gearBookingRouter.post("/create-pending", protect, createPendingGearBooking);

// Confirm gear booking (requires login)
gearBookingRouter.post("/confirm", protect, confirmGearBooking);

// Get bookings by user (requires login)
gearBookingRouter.get("/user", protect, getUserGearBookings);

// Get bookings for gear owned by owner (requires owner login)
gearBookingRouter.get("/owner", protect, getOwnerGearBookings);

// Change booking status (requires owner login)
gearBookingRouter.post("/change-status", protect, changeGearBookingStatus);

export default gearBookingRouter;