import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import gearRoutes from './routes/gearRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { razorpayWebhookHandler } from "./controllers/bookingController.js";

dotenv.config();
const app = express();
await connectDB();

// Enable CORS for all routes
app.use(cors());

// Healthcheck
app.get('/', (req, res) => res.send("Server is running"));

// 1) Razorpay webhook endpoint on /api/bookings/create
//    Must be before express.json() so raw body is preserved
app.post(
  '/api/bookings/create',
  express.raw({ type: 'application/json' }),
  razorpayWebhookHandler
);

// 2) JSON parser for all other routes
app.use(express.json());

// 3) Mount API routers
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);   // includes createOrder, check availability, etc.
app.use('/api/gears', gearRoutes);
app.use('/api/payment', paymentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));