import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import gearRoutes from './routes/gearRoutes.js';
import webhookRoutes from './routes/webhook.js';
import paymentRoutes from './routes/paymentRoutes.js';
import gearBookingRouter from "./routes/gearBookingRoutes.js";

const app = express();
await connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send("Server is running"));

// Routes
app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/gear-bookings', gearBookingRouter); // Assuming gear bookings are handled in bookingRouter
app.use('/api/gears', gearRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/payment', paymentRoutes);

// test route
app.get('/api/test', (req, res) => {
    res.json({ message: "Test route is working!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
