import fs from 'fs';
import GearModel from '../models/GearModel.js';
import imagekit from '../configs/imageKit.js';

// ✅ Add Gear
export const addGear = async (req, res) => {
  try {
    const { _id } = req.user;
    const gear = JSON.parse(req.body.gearData);
    const imageFile = req.file;

    // Validation
    if (!gear.name || !gear.category || !gear.pricePerDay) {
      return res.json({success: false, message: "Missing required gear details"});
    }
    
    if (!imageFile) {
      return res.json({success: false, message: "Gear image is required"});
    }
    
    if (gear.pricePerDay <= 0) {
      return res.json({success: false, message: "Price per day must be greater than 0"});
    }
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: '/gears'
    });

    const image = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: '1280' },
        { quality: 'auto' },
        { format: 'webp' }
      ]
    });

    await GearModel.create({ ...gear, owner: _id, image });
    res.json({ success: true, message: 'Gear Added' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Gears Owned by Logged-in User
export const getOwnerGears = async (req, res) => {
  try {
    const { _id } = req.user;
    const gears = await GearModel.find({ owner: _id });
    res.json({ success: true, gears });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get All Available Gears (Public)
export const getAllGears = async (req, res) => {
  try {
    const gears = await GearModel.find({ 
      $or: [
        { isAvailable: true },
        { isAvaliable: true }
      ]
    }).sort({ createdAt: -1 });
    res.json({ success: true, gears });
  } catch (error) {
    console.error('Error fetching gears:', error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Gear by ID
export const getGearById = async (req, res) => {
  try {
    const gear = await GearModel.findById(req.params.id).populate('owner');
    if (!gear) {
      return res.status(404).json({ success: false, message: 'Gear not found' });
    }
    res.json({ success: true, gear });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Toggle Gear Availability
export const toggleGearAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { gearId } = req.body;
    
    if (!gearId) {
      return res.json({ success: false, message: "Gear ID is required" });
    }
    
    const gear = await GearModel.findById(gearId);
    if (!gear) {
      return res.json({ success: false, message: "Gear not found" });
    }

    // Check ownership
    if (gear.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    gear.isAvailable = !gear.isAvailable;
    gear.isAvaliable = gear.isAvailable; // Keep backward compatibility
    await gear.save();

    res.json({ success: true, message: "Availability toggled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Delete Gear
export const deleteGear = async (req, res) => {
  try {
    const { _id } = req.user;
    const { gearId } = req.body;
    
    if (!gearId) {
      return res.json({ success: false, message: "Gear ID is required" });
    }
    
    const gear = await GearModel.findById(gearId);
    if (!gear) {
      return res.json({ success: false, message: "Gear not found" });
    }

    // Check ownership
    if (gear.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }
    
    await GearModel.findByIdAndDelete(gearId);
    res.json({ success: true, message: "Gear deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
