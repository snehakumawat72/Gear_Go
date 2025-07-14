import User from "../models/User.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Car from "../models/Car.js";


// Generate JWT Token
// ✅ Recommended: sign with a proper payload
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};



// Register User
export const registerUser = async (req, res)=>{
    try {
        const {name, email, password, phone} = req.body

        if(!name || !email || !password || password.length < 8){
            return res.json({success: false, message: 'Fill all the fields'})
        }

        const userExists = await User.findOne({email})
        if(userExists){
            return res.json({success: false, message: 'User already exists'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({name, email, password: hashedPassword, phone})
        const token = generateToken(user._id.toString())
        res.json({success: true, token})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Login User 
export const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.json({success: false, message: "User not found" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.json({success: false, message: "Invalid Credentials" })
        }
        const token = generateToken(user._id.toString())
        res.json({success: true, token})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Get User data using Token (JWT)
// ✅ Fixed getUserData
export const getUserData = async (req, res) => {
  try {
    const user = req.user; // already a full User object

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, email, phone, role } = user;
    res.json({ success: true, user: { name, email, phone, role } });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


    

// Get All Cars for the Frontend
export const getCars = async (req, res) =>{
    try {
        const cars = await Car.find({isAvaliable: true})
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}