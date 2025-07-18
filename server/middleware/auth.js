import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token format" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // expects { userId }

    const user = await User.findById(decoded.userId).select("-password"); // exclude password
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    } else if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: "Unauthorized: Token expired" });
    }
    return res.status(500).json({ success: false, message: "Server error during authentication" });
  }
};
export const admin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Forbidden: Admins only" });
  }
  next();
};