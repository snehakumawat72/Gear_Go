import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Gear from "../models/GearModel.js";
import { v4 as uuidv4 } from 'uuid';


// ✅ 1. Check Car Availability
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    const cars = await Car.find({ location, isAvailable: true });

    const availableCarsPromises = cars.map(async (car) => {
      const bookings = await Booking.find({
        vehicleId: car._id,
        startDate: { $lte: returnDate },
        endDate: { $gte: pickupDate },
      });
      const isAvailable = bookings.length === 0;
      return { ...car._doc, isAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);
    availableCars = availableCars.filter(car => car.isAvailable === true);

    res.json({ success: true, availableCars });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ 2. Create Booking (Car or Gear)
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, gear, pickupDate, returnDate, customerDetails, totalAmount, paymentId, orderId, signature } = req.body;

    if (!car && !gear) {
      return res.json({ success: false, message: "Missing car or gear ID" });
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      return res.json({ success: false, message: "Return date must be after pickup date" });
    }

    // Verify payment if payment details are provided
    if (paymentId && orderId && signature) {
      // TODO: Add Razorpay signature verification here
      console.log("Payment verification needed:", { paymentId, orderId, signature });
    }
    const isGearBooking = Boolean(gear);
    const itemId = gear || car;

    const itemData = isGearBooking ? await Gear.findById(itemId) : await Car.findById(itemId);
    if (!itemData) {
      return res.json({ success: false, message: `${isGearBooking ? "Gear" : "Car"} not found` });
    }

    if (!itemData.isAvailable) {
      return res.json({ success: false, message: `${isGearBooking ? "Gear" : "Car"} is not available` });
    }

    if (itemData.owner.toString() === _id.toString()) {
      return res.json({ success: false, message: "You can't book your own listing" });
    }

    const overlapping = await Booking.find({
      vehicleId: itemData._id,
      startDate: { $lte: returnDate },
      endDate: { $gte: pickupDate },
     status: { $nin: ["cancelled", "rejected"] }
    });

    if (overlapping.length > 0) {
      return res.json({ success: false, message: `${isGearBooking ? "Gear" : "Car"} is already booked in this period` });
    }

    const noOfDays = Math.ceil(
      (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
    );
    const calculatedPrice = itemData.pricePerDay * noOfDays;
    const finalPrice = totalAmount || calculatedPrice;

    await Booking.create({
      bookingId: `GB-${uuidv4()}`,
      userId: _id,
      vehicleId: itemData._id,
      vehicleModel: itemData.model || itemData.name,
      startDate: pickupDate,
      endDate: returnDate,
      pickupLocation: itemData.location || "Unknown",
      dailyRate: itemData.pricePerDay,
      totalAmount: finalPrice,
      customerDetails,
      paymentStatus: paymentId ? 'paid' : 'pending',
      status: paymentId ? 'confirmed' : 'pending',
      paymentId: paymentId || null,
    });

    res.json({ success: true, message: `${isGearBooking ? "Gear" : "Car"} booking created` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ 3. Create Gear Booking (alias of createBooking)
export const createGearBooking = createBooking;


// ✅ 4. Get User Bookings
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;

    const bookings = await Booking.find({ userId: _id }).sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ 5. Get Owner Bookings
export const getOwnerBookings = async (req, res) => {
  try {
    const ownedCarIds = await Car.find({ owner: req.user._id }).distinct('_id');
    const ownedGearIds = await Gear.find({ owner: req.user._id }).distinct('_id');

    const bookings = await Booking.find({
      vehicleId: { $in: [...ownedCarIds, ...ownedGearIds] }
    }).sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ 6. Change Booking Status
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    const ownedCars = await Car.find({ owner: req.user._id }).distinct('_id');
    const ownedGears = await Gear.find({ owner: req.user._id }).distinct('_id');

    if (!ownedCars.includes(booking.vehicleId.toString()) &&
        !ownedGears.includes(booking.vehicleId.toString())) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res.json({ success: true, message: "Booking status updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
