import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { v4 as uuidv4 } from 'uuid';
import Razorpay from 'razorpay';
import crypto from 'crypto'; 




import Gear from '../models/GearModel.js';

import Payment from '../models/Payment.js';


// init Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ------------------------
// Create Order Endpoint
// ------------------------
export const createOrder = async (req, res) => {
  try {
    console.log('🔄 [createOrder] req.body:', req.body);

    const userId = req.user._id;
    const { amount, carId, gearId, pickupDate, returnDate, customerDetails } = req.body;

    console.log('🔑 userId:', userId);
    console.log('💰 amount:', amount);
    console.log('🚗 carId:', carId, '🛠 gearId:', gearId);
    console.log('📅 pickupDate:', pickupDate, '📅 returnDate:', returnDate);
    console.log('👤 customerDetails:', customerDetails);

    if (!amount || !pickupDate || !returnDate || !customerDetails || (!carId && !gearId)) {
      console.error('❌ Missing required fields');
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const receipt = `rcpt_${Date.now()}`;
    const notes = {
      userId:         userId.toString(),
      pickupDate,
      returnDate,
      customerName:   customerDetails.name,
      customerEmail:  customerDetails.email,
      customerPhone:  customerDetails.phone,
      bookingAmount:  amount.toString()
    };
    if (carId)  notes.carId  = carId.toString();
    if (gearId) notes.gearId = gearId.toString();

    console.log('📝 notes prepared for Razorpay order:', notes);

    const options = {
      amount:         Math.round(amount * 100),
      currency:       'INR',
      receipt,
      payment_capture:1,
      notes
    };
    console.log('⚙️ razorpay.orders.create options:', options);

    const order = await razorpay.orders.create(options);
    console.log('✅ Razorpay order created:', order);

    return res.json({ success: true, order });
  } catch (error) {
    console.error('❌ createOrder error:', error);
    return res.status(500).json({ success: false, message: 'Could not create order' });
  }
};


// ------------------------
// Webhook Handler
// ------------------------
export const razorpayWebhookHandler = async (req, res) => {
  try {
    console.log('=== WEBHOOK RECEIVED ===');
    console.log('📥 Raw headers:', req.headers);

    // Raw payload & signature
    const rawBody   = req.body; // ensure express.raw() on this route
    const signature = req.headers['x-razorpay-signature'];
    console.log('📦 rawBody buffer length:', rawBody.length);
    console.log('🔖 signature header:', signature);

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');
    console.log('🔑 expectedSignature:', expectedSignature);

    if (expectedSignature !== signature) {
      console.error('❌ Invalid signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }
    console.log('✅ Signature validated');

    // parse once
    const parsed = JSON.parse(rawBody.toString('utf8'));
    console.log('🗂 parsed webhook payload:', JSON.stringify(parsed, null, 2));

    const { event, payload } = parsed;
    console.log('📢 event type:', event);
    console.log('🔍 payload keys:', Object.keys(payload));

    // pick up the right entity
    let orderEntity, paymentEntity;
    if (event === 'order.paid') {
      orderEntity   = payload.order?.entity;
      paymentEntity = null;
      console.log('📦 order.entity:', orderEntity);
    }
    if (event === 'payment.captured') {
      orderEntity   = payload.order?.entity;
      paymentEntity = payload.payment?.entity;
      console.log('📦 order.entity:', orderEntity);
      console.log('📦 payment.entity:', paymentEntity);
    }
    if (!orderEntity) {
      console.error('❌ No order entity found for event:', event);
      return res.status(200).json({ success: true, message: 'Ignored non-payment event' });
    }

    // examine notes
    const rawNotes = orderEntity.notes;
    console.log('🏷 raw orderEntity.notes:', rawNotes);
    const notes = (rawNotes && typeof rawNotes === 'object' && !Array.isArray(rawNotes))
      ? rawNotes
      : {};
    console.log('✅ normalized notes object:', notes);

    // validate notes
    const { userId, pickupDate, returnDate, carId, gearId, bookingAmount } = notes;
    console.log('👤 notes.userId:', userId);
    console.log('📅 notes.pickupDate:', pickupDate);
    console.log('📅 notes.returnDate:', returnDate);
    console.log('🚗 notes.carId:', carId, '🛠 notes.gearId:', gearId);
    console.log('💰 notes.bookingAmount:', bookingAmount);

    if (!userId || !pickupDate || !returnDate || (!carId && !gearId)) {
      console.error('❌ Missing required fields in notes');
      return res.status(400).json({ success: false, message: 'Missing required fields in notes' });
    }

    // load item
    const itemId = carId || gearId;
    const Model  = carId ? Car : Gear;
    console.log('🔎 Fetching item from DB:', itemId, 'Model:', Model.modelName);
    const item = await Model.findById(itemId);
    console.log('📦 Fetched item:', item);

    if (!item) {
      console.error('❌ Item not found:', itemId);
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    // compute dates & totals
    const start = new Date(pickupDate);
    const end   = new Date(returnDate);
    const days  = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    console.log('🕒 Computed days:', days);

    const rate = carId ? item.pricePerDay : item.rentalRate;
  
    // Convert days and rate to numbers and validate
const numericDays = Number(days) || 0;  // Fallback to 0 if invalid
const numericRate = Number(rate) || 0;  // Fallback to 0 if invalid

// Calculate total with validation
const total = numericDays * numericRate;

// Final validation (in case both were 0)
if (isNaN(total)) {
  throw new Error(`Invalid booking calculation (days: ${days}, rate: ${rate})`);
}

    console.log('💵 rate:', rate, 'total:', total);

    // create Booking
    const bookingData = {
      bookingId:   `bk_${uuidv4().replace(/-/g, '').slice(0,16)}`,
      customer:    userId,
      vehicle:     itemId,
      vehicleType: carId ? 'Car' : 'Gear',
      startDate:   start,
      endDate:     end,
      location:    item.location,
      dailyRate:   rate,
      totalAmount: total,
      status:      'confirmed',
      paymentStatus:'paid',
      onModel: carId ? 'Car' : 'Gear',
    };
    console.log('📄 Creating Booking with:', bookingData);
    const booking = await Booking.create(bookingData);
    console.log('✅ Booking created:', booking);

    const razorpayStatus = paymentEntity?.status || orderEntity?.status;
let statusMapped;
if (razorpayStatus === 'captured' || razorpayStatus === 'paid') {
  statusMapped = 'success';
} else if (razorpayStatus === 'failed') {
  statusMapped = 'failed';
} else if (razorpayStatus === 'refunded') {
  statusMapped = 'refunded';
} else {
  statusMapped = 'pending';
}


    // create Payment
    const payData = {
      paymentId:  paymentEntity?.id || orderEntity.id,
      orderId:    paymentEntity?.order_id || orderEntity.id,
      booking:    booking._id,
      customer:   userId,
      amount:     (paymentEntity?.amount ?? Number(bookingAmount)*100) / 100,
      currency:   paymentEntity?.currency || orderEntity.currency,
      status:      statusMapped ,
      method:     paymentEntity?.method || 'N/A',
      paymentDate:new Date((paymentEntity?.created_at || orderEntity.created_at) * 1000),
      receipt:    paymentEntity?.receipt || orderEntity.receipt,
      notes
    };
    console.log('📄 Creating Payment with:', payData);
    const payment = await Payment.create(payData);
    console.log('✅ Payment created:', payment);

    // 3) Link the Payment back to the Booking
booking.payment = payment._id;
await booking.save();
console.log('🔗 Booking updated with payment ref:', booking);

    return res.status(200).json({ success: true, bookingId: booking.bookingId });
  } catch (err) {
    console.error('❌ Webhook processing error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};




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
    const { car, gear, pickupDate, returnDate, customerDetails } = req.body;

    if (!car && !gear) {
      return res.json({ success: false, message: "Missing car or gear ID" });
    }

    if (new Date(returnDate) <= new Date(pickupDate)) {
      return res.json({ success: false, message: "Return date must be after pickup date" });
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
    });

    if (overlapping.length > 0) {
      return res.json({ success: false, message: `${isGearBooking ? "Gear" : "Car"} is already booked in this period` });
    }

    const noOfDays = Math.ceil(
      (new Date(returnDate) - new Date(pickupDate)) / (1000 * 60 * 60 * 24)
    );
    const price = itemData.pricePerDay * noOfDays;

    await Booking.create({
      bookingId: `GB-${uuidv4()}`,
      userId: _id,
      vehicleId: itemData._id,
      vehicleModel: itemData.model || itemData.name,
      startDate: pickupDate,
      endDate: returnDate,
      pickupLocation: itemData.location || "Unknown",
      dailyRate: itemData.pricePerDay,
      totalAmount: price,
      customerDetails,
    });

    res.json({ success: true, message: `${isGearBooking ? "Gear" : "Car"} booking created` });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ 3. Create Gear Booking (alias of createBooking)
export const createGearBooking = createBooking;


export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch all bookings for the user and populate vehicle & payment
    const bookings = await Booking.find({ customer: userId })
      .sort({ createdAt: -1 })
      .populate('vehicle') // Mongoose will use refPath = 'onModel' automatically
      .populate({
        path: 'payment',
        select: 'amount status method'
      });

    // Attach the correct item name based on the model (optional)
    const fullBookings = bookings.map(booking => {
      return {
        ...booking.toObject(),
        item: booking.vehicle, // You can access all vehicle/gear fields here
        itemType: booking.onModel
      };
    });

    res.json({ success: true, bookings: fullBookings });
  } catch (error) {
    console.error("❌ getUserBookings error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch bookings." });
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
