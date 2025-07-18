import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import GearModel from "../models/GearModel.js";
import User from "../models/User.js";
import fs from "fs";


// API to Change Role of User
export const changeRoleToOwner = async (req, res)=>{
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {role: "owner"})
        res.json({success: true, message: "Now you can list cars"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Car

export const addCar = async (req, res)=>{
    try {
        const {_id} = req.user;
        let car = JSON.parse(req.body.carData);
        const imageFile = req.file;

        // Validation
        if (!car.brand || !car.model || !car.year || !car.pricePerDay) {
            return res.json({success: false, message: "Missing required car details"});
        }
        
        if (!imageFile) {
            return res.json({success: false, message: "Car image is required"});
        }
        
        if (car.pricePerDay <= 0) {
            return res.json({success: false, message: "Price per day must be greater than 0"});
        }
        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/cars'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '1280'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                { format: 'webp' }  // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;
        await Car.create({...car, owner: _id, image})

        res.json({success: true, message: "Car Added"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List Owner Cars
export const getOwnerCars = async (req, res)=>{
    try {
        const {_id} = req.user;
        const cars = await Car.find({owner: _id })
        res.json({success: true, cars})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        
        if (!carId) {
            return res.json({ success: false, message: "Car ID is required" });
        }
        
        const car = await Car.findById(carId)

        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        car.isAvailable = !car.isAvailable;
        car.isAvaliable = car.isAvailable; // Keep backward compatibility
        await car.save()

        res.json({success: true, message: "Availability Toggled"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Api to delete a car
export const deleteCar = async (req, res) =>{
    try {
        const {_id} = req.user;
        const {carId} = req.body
        
        if (!carId) {
            return res.json({ success: false, message: "Car ID is required" });
        }
        
        const car = await Car.findById(carId)

        if (!car) {
            return res.json({ success: false, message: "Car not found" });
        }
        // Checking is car belongs to the user
        if(car.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized" });
        }

        await Car.findByIdAndDelete(carId);

        res.json({success: true, message: "Car Removed"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Dashboard Data
export const getDashboardData = async (req, res) =>{
    try {
        const { _id, role } = req.user;

        if(role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" });
        }

        const cars = await Car.find({owner: _id})
        const gears = await GearModel.find({owner: _id})
        
        // Get bookings for both cars and gears owned by this user
        const carIds = cars.map(car => car._id);
        const gearIds = gears.map(gear => gear._id);
        
        const bookings = await Booking.find({ 
            vehicleId: { $in: [...carIds, ...gearIds] }
        }).sort({ createdAt: -1 });

        const pendingBookings = bookings.filter(b => b.status === "pending");
        const completedBookings = bookings.filter(b => b.status === "confirmed");

        // Calculate monthlyRevenue from bookings where status is confirmed
        const monthlyRevenue = completedBookings.reduce((acc, booking) => 
            acc + (booking.totalAmount || booking.price || 0), 0
        );

        const dashboardData = {
            totalCars: cars.length,
            totalGears: gears.length,
            totalBookings: bookings.length,
            pendingBookings: pendingBookings.length,
            completedBookings: completedBookings.length,
            recentBookings: bookings.slice(0,3),
            monthlyRevenue
        }

        res.json({ success: true, dashboardData });

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to update user image

export const updateUserImage = async (req, res)=>{
    try {
        const { _id } = req.user;

        const imageFile = req.file;

        if (!imageFile) {
            return res.json({success: false, message: "Image file is required"});
        }
        // Upload Image to ImageKit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: '/users'
        })

        // optimization through imagekit URL transformation
        var optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {width: '400'}, // Width resizing
                {quality: 'auto'}, // Auto compression
                { format: 'webp' }  // Convert to modern format
            ]
        });

        const image = optimizedImageUrl;

        await User.findByIdAndUpdate(_id, {image});
        res.json({success: true, message: "Image Updated" })

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}   