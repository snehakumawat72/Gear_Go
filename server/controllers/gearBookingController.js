import Booking from "../models/Booking.js";
import Gear from "../models/GearModel.js";
import crypto from 'crypto';

// Function to Check Availability of Gear for a given Date
const checkGearAvailability = async (gear, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        vehicleId: gear,
        startDate: { $lte: returnDate },
        endDate: { $gte: pickupDate },
        status: { $nin: ["cancelled", "rejected"] }, // Only consider active bookings
    });
    return bookings.length === 0;
};

// API to Check Availability of Gears for the given Date and location
export const checkAvailabilityOfGear = async (req, res) => {
    try {
        const { gearId } = req.params;
        const { pickupDate, returnDate } = req.query;

        // console.log("Checking availability for gear:", { gearId, pickupDate, returnDate });

        if (!gearId || !pickupDate || !returnDate) {
            return res.json({
                success: false,
                message: "Missing required parameters: gearId, pickupDate, returnDate"
            });
        }

        // Find all bookings for this gear within the date range
        const bookings = await Booking.find({
            vehicleId: gearId,
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
                    startDate: { $lte: new Date(returnDate) },
                    endDate: { $gte: new Date(pickupDate) }
                }
            ]
        }).select('startDate endDate status');

        // Format booked date ranges
        const bookedDates = bookings.map(booking => ({
            startDate: booking.startDate.toISOString().split('T')[0],
            endDate: booking.endDate.toISOString().split('T')[0],
            status: booking.status
        }));

        res.json({
            success: true,
            bookedDates
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to Create Gear Booking
export const createGearBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { gear, pickupDate, returnDate } = req.body;

        const isAvailable = await checkGearAvailability(gear, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Gear is not available" });
        }

        const gearData = await Gear.findById(gear);
        if (!gearData) {
            return res.json({ success: false, message: "Gear not found" });
        }

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        if (isNaN(picked) || isNaN(returned) || returned < picked) {
            return res.json({ success: false, message: "Invalid pickup or return date" });
        }
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24)) || 1;
        const price = gearData.pricePerDay * noOfDays;

        await Booking.create({ gear, owner: gearData.owner, user: _id, pickupDate, returnDate, price, status: "pending" });

        res.json({ success: true, message: "Booking Created" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to List User Gear Bookings
export const getUserGearBookings = async (req, res) => {
    try {
        const { _id } = req.user;
        const bookings = await Booking.find({ user: _id, gear: { $exists: true } })
            .populate("gear")
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to Get Owner Gear Bookings
export const getOwnerGearBookings = async (req, res) => {
    try {
        if (req.user.role !== 'owner') {
            return res.json({ success: false, message: "Unauthorized" });
        }

        const bookings = await Booking.find({ owner: req.user._id, gear: { $exists: true } })
            .populate("gear user")
            .select("-user.password")
            .sort({ createdAt: -1 });

        res.json({ success: true, bookings });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

// API to Change Gear Booking Status
export const changeGearBookingStatus = async (req, res) => {
    try {
        const { _id } = req.user;
        const { bookingId, status } = req.body;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }

        if (booking.owner.toString() !== _id.toString()) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};





// ✅ Get Gear Calendar Availability Data
export const getGearAvailability = async (req, res) => {
    try {
        const { gearId } = req.params;
        const { startDate, endDate } = req.query;

        // Find all bookings for this gear within the date range
        const bookings = await Booking.find({
            vehicleId: gearId,
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
                    startDate: { $lte: new Date(endDate) },
                    endDate: { $gte: new Date(startDate) }
                }
            ]
        }).select('startDate endDate status');

        // Format booked date ranges
        const bookedDates = bookings.map(booking => ({
            startDate: booking.startDate.toISOString().split('T')[0],
            endDate: booking.endDate.toISOString().split('T')[0],
            status: booking.status
        }));

        res.json({
            success: true,
            bookedDates
        });
    } catch (error) {
        console.error('Error getting gear calendar availability:', error);
        res.status(500).json({
            success: false,
            message: 'Error getting gear calendar availability'
        });
    }
};

// ✅ Create Pending Gear Booking
export const createPendingGearBooking = async (req, res) => {
    try {
        const { _id } = req.user;
        const { gear, pickupDate, returnDate, totalAmount, customerDetails, orderId } = req.body;
        console.log("Creating pending gear booking:", { gear, pickupDate, returnDate, totalAmount, customerDetails, orderId });
        console.log("User ID:", _id);
        // Check availability
        const isAvailable = await checkGearAvailability(gear, pickupDate, returnDate);
        if (!isAvailable) {
            return res.json({ success: false, message: "Gear is not available for the selected dates" });
        }

        // Create booking ID
        const bookingId = crypto.randomBytes(16).toString('hex');

        // Set expiration time (15 minutes from now)
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        const booking = new Booking({
            bookingId,
            userId: _id,
            vehicleId: gear,
            vehicleModel: 'gear',
            startDate: new Date(pickupDate),
            endDate: new Date(returnDate),
            pickupLocation: 'TBD', // Set based on your requirements
            dailyRate: totalAmount / ((new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)),
            pickupDate: new Date(pickupDate),
            returnDate: new Date(returnDate),
            totalAmount,
            customerDetails,
            orderId,
            status: 'pending',
            paymentStatus: 'pending',
            expiresAt,
            createdAt: new Date()
        });

        await booking.save();

        res.json({
            success: true,
            message: "Pending booking created",
            bookingId,
            expiresAt
        });
    } catch (error) {
        console.error('Error creating pending gear booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating pending gear booking'
        });
    }
};

// ✅ Confirm Gear Booking
export const confirmGearBooking = async (req, res) => {
    try {
        const { bookingId, paymentId, orderId, signature } = req.body;

        // Find the pending booking
        const booking = await Booking.findOne({
            bookingId,
            status: 'pending',
            expiresAt: { $gt: new Date() }
        });

        if (!booking) {
            return res.json({
                success: false,
                message: "Booking not found or expired"
            });
        }

        // Update booking with payment details and confirm
        booking.paymentId = paymentId;
        booking.orderId = orderId;
        booking.signature = signature;
        booking.status = 'confirmed';
        booking.expiresAt = undefined; // Remove expiration

        await booking.save();

        res.json({
            success: true,
            message: "Gear booking confirmed successfully",
            booking
        });
    } catch (error) {
        console.error('Error confirming gear booking:', error);
        res.status(500).json({
            success: false,
            message: 'Error confirming gear booking'
        });
    }
};