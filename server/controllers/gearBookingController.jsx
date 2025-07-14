import Booking from "../models/Booking.js";
import GearModel from "../models/GearModel.js";

// Function to Check Availability of Gear for a given Date
const checkGearAvailability = async (gear, pickupDate, returnDate) => {
    const bookings = await Booking.find({
        gear,
        pickupDate: { $lte: returnDate },
        returnDate: { $gte: pickupDate },
        status: { $nin: ["cancelled", "rejected"] }, // Only consider active bookings
    });
    return bookings.length === 0;
};

// API to Check Availability of Gears for the given Date and location
export const checkAvailabilityOfGear = async (req, res) => {
    try {
        const { location, pickupDate, returnDate } = req.body;

        const gears = await Gear.find({ location, isAvailable: true });

        const availableGearsPromises = gears.map(async (gear) => {
            const isAvailable = await checkGearAvailability(gear._id, pickupDate, returnDate);
            return { ...gear._doc, isAvailable };
        });

        let availableGears = await Promise.all(availableGearsPromises);
        availableGears = availableGears.filter(gear => gear.isAvailable === true);

        res.json({ success: true, availableGears });

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