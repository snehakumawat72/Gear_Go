import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // expects { userId }

    const user = await User.findById(decoded.userId).select("-password"); // exclude password
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
  }
};
export const admin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
  }
  next();
};