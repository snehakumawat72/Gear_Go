import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Gear from "../models/GearModel.js";
import crypto from 'crypto';


// ✅ 1. Check Car Availability

// UPDATE: Enhanced availability check to consider pending bookings
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { car, pickupDate, returnDate } = req.body;

    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);

    // Find overlapping bookings that are confirmed or pending (and not expired)
    const overlappingBookings = await Booking.find({
      $or: [
        { vehicleId: car }, // New format
        { car: car }        // Legacy format
      ],
      $and: [
        {
          $or: [
            { status: 'confirmed' },
            {
              status: 'pending',
              expiresAt: { $gt: new Date() }
            }
          ]
        },
        {
          $or: [
            {
              // Using new date fields
              startDate: { $lt: returnD },
              endDate: { $gt: pickup }
            },
            {
              // Using legacy date fields
              pickupDate: { $lt: returnD },
              returnDate: { $gt: pickup }
            }
          ]
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.json({
        success: false,
        message: 'Car is not available for the selected dates'
      });
    }

    res.json({
      success: true,
      message: 'Car is available'
    });
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking availability'
    });
  }
};

// ✅ Get Calendar Availability Data
export const getCarAvailability = async (req, res) => {
  try {
    const { carId } = req.params;
    const { startDate, endDate } = req.query;

    // Find all bookings for this car within the date range
    const bookings = await Booking.find({
      $or: [
        { vehicleId: carId }, // New format
        { car: carId }        // Legacy format
      ],
      $and: [
        {
          $or: [
            { status: 'confirmed' },
            {
              status: 'pending',
              expiresAt: { $gt: new Date() }
            }
          ]
        },
        {
          $or: [
            {
              // Using new date fields
              startDate: { $lte: new Date(endDate) },
              endDate: { $gte: new Date(startDate) }
            },
            {
              // Using legacy date fields
              pickupDate: { $lte: new Date(endDate) },
              returnDate: { $gte: new Date(startDate) }
            }
          ]
        }
      ]
    }).select('startDate endDate pickupDate returnDate status');

    // Format booked date ranges
    const bookedDates = bookings.map(booking => ({
      startDate: (booking.startDate || booking.pickupDate).toISOString().split('T')[0],
      endDate: (booking.endDate || booking.returnDate).toISOString().split('T')[0],
      status: booking.status
    }));

    res.json({
      success: true,
      bookedDates
    });
  } catch (error) {
    console.error('Error getting calendar availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting calendar availability'
    });
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

    if (!pickupDate || !returnDate) {
      return res.json({ success: false, message: "Pickup and return dates are required" });
    }
    if (new Date(returnDate) <= new Date(pickupDate)) {
      return res.json({ success: false, message: "Return date must be after pickup date" });
    }

    if (!customerDetails?.name || !customerDetails?.email || !customerDetails?.phone) {
      return res.json({ success: false, message: "Customer details are required" });
    }
    // Verify payment if payment details are provided
    if (paymentId && orderId && signature) {
      const body = orderId + "|" + paymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.json({ success: false, message: "Payment verification failed" });
      }
    }

    const isGearBooking = Boolean(gear);
    const itemId = gear || car;

    const itemData = isGearBooking ? await Gear.findById(itemId) : await Car.findById(itemId);
    if (!itemData) {
      return res.json({ success: false, message: `${isGearBooking ? "Gear" : "Car"} not found` });
    }

    if (!itemData.isAvailable && !itemData.isAvaliable) {
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

    if (finalPrice <= 0) {
      return res.json({ success: false, message: "Invalid booking amount" });
    }
    await Booking.create({
      bookingId: `GB-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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

      // Legacy fields for backward compatibility
      car: isGearBooking ? null : itemData._id,
      gear: isGearBooking ? itemData._id : null,
      user: _id,
      owner: itemData.owner,
      pickupDate,
      returnDate,
      price: finalPrice
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

    const bookings = await Booking.find({
      $or: [
        { userId: _id },
        { user: _id }
      ]
    }).sort({ createdAt: -1 });

    // Populate car and gear data for each booking
    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        let car = null;
        let gear = null;

        if (booking.car) {
          car = await Car.findById(booking.car);
        } else if (booking.vehicleId) {
          // Try to find if it's a car or gear
          car = await Car.findById(booking.vehicleId);
          if (!car) {
            gear = await Gear.findById(booking.vehicleId);
          }
        }

        if (booking.gear) {
          gear = await Gear.findById(booking.gear);
        }

        return {
          ...booking.toObject(),
          car,
          gear
        };
      })
    );

    res.json({ success: true, bookings: populatedBookings });
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
      $or: [
        { vehicleId: { $in: [...ownedCarIds, ...ownedGearIds] } },
        { owner: req.user._id }
      ]
    }).sort({ createdAt: -1 });

    console.log("Bookings for Owner:", bookings);

    // Populate car and gear data
    const populatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        let car = null;
        let gear = null;

        if (booking.car) {
          car = await Car.findById(booking.car);
        } else if (booking.vehicleId) {
          car = await Car.findById(booking.vehicleId);
          if (!car) {
            gear = await Gear.findById(booking.vehicleId);
          }
        }

        if (booking.gear) {
          gear = await Gear.findById(booking.gear);
        }

        return {
          ...booking.toObject(),
          car,
          gear
        };
      })
    );
    res.json({ success: true, bookings: populatedBookings });
  } catch (error) {
    console.error("owner booking error ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ 6. Change Booking Status
export const changeBookingStatus = async (req, res) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      return res.json({ success: false, message: "Booking ID and status are required" });
    }

    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.json({ success: false, message: "Invalid status" });
    }
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" });
    }

    const ownedCars = await Car.find({ owner: req.user._id }).distinct('_id');
    const ownedGears = await Gear.find({ owner: req.user._id }).distinct('_id');

    const vehicleId = booking.vehicleId || booking.car || booking.gear;
    const isOwner = ownedCars.some(id => id.toString() === vehicleId?.toString()) ||
      ownedGears.some(id => id.toString() === vehicleId?.toString()) ||
      booking.owner?.toString() === req.user._id.toString();

    if (!isOwner) {
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



// NEW: Create pending booking when payment starts
export const createPendingBooking = async (req, res) => {
  try {
    const { car, pickupDate, returnDate, totalAmount, customerDetails, orderId } = req.body;

    // Generate unique booking ID
    const bookingId = `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // Set expiry time (15 minutes from now)
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 15);

    const pendingBooking = new Booking({
      bookingId,
      userId: req.user._id.toString(),
      vehicleId: car,
      vehicleModel: 'Car', // You might want to fetch this from car data
      startDate: new Date(pickupDate),
      endDate: new Date(returnDate),
      pickupLocation: 'TBD', // Set based on your requirements
      dailyRate: totalAmount / Math.ceil((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)),
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending',
      customerDetails,
      orderId,
      expiresAt: expiryTime,

      // Legacy fields for backward compatibility
      car,
      user: req.user._id,
      pickupDate: new Date(pickupDate),
      returnDate: new Date(returnDate),
      price: totalAmount
    });

    await pendingBooking.save();

    res.json({
      success: true,
      message: 'Pending booking created',
      bookingId: pendingBooking._id,
      expiresAt: expiryTime
    });
  } catch (error) {
    console.error('Error creating pending booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create pending booking'
    });
  }
};

// NEW: Confirm booking after successful payment
export const confirmBooking = async (req, res) => {
  try {
    const { orderId, paymentId, signature, bookingId } = req.body;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in pending state'
      });
    }

    // Check if booking has expired
    if (new Date() > booking.expiresAt) {
      booking.status = 'expired';
      await booking.save();
      return res.status(400).json({
        success: false,
        message: 'Booking has expired'
      });
    }

    // Update booking with payment details and confirm
    booking.status = 'confirmed';
    booking.paymentStatus = 'paid';
    booking.paymentId = paymentId;
    booking.signature = signature;
    booking.expiresAt = undefined; // Remove expiry since it's confirmed

    await booking.save();

    res.json({
      success: true,
      message: 'Booking confirmed successfully',
      booking
    });
  } catch (error) {
    console.error('Error confirming booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm booking'
    });
  }
};
