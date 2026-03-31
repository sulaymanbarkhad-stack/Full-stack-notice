import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Notice from "../models/notice.js";
import tokenGenerate from "../utils/tokenGenerate.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please add all fields" });
    }

    // check user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle avatar image if provided
    let avatar = "";
    if (req.file) {
      avatar = req.file.path;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
      role: "user", // Default role
    });

    // response
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        token: tokenGenerate(user),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Register User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    // check for user
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // check password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: tokenGenerate(user),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updatedUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Security Verification: Only the owner or an admin can update this profile
    if (user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "You are not authorized to update this profile" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    // Handle avatar image if provided by upload middleware
    if (req.file) {
      // req.file.path is usually the Cloudinary URL. 
      // If Cloudinary failed, this might be in memory storage but we blocked that in filter.
      user.avatar = req.file.path || user.avatar;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      token: tokenGenerate(updatedUser),
    });
  } catch (error) {
    console.error("Update User Error:", error);
    // Specifically handle Multer/Cloudinary errors
    if (error.message.includes("Cloudinary")) {
      return res.status(400).json({ message: "Image upload failed: " + error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Get User Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalNotices = await Notice.countDocuments();
    const urgentNotices = await Notice.countDocuments({ category: "urgent" });
    const importantNotices = await Notice.countDocuments({ isImportant: true });

    res.status(200).json({
      totalUsers,
      totalNotices,
      urgentNotices,
      importantNotices,
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const promoteUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "User is already an admin" });
    }

    user.role = "admin";
    await user.save();

    res.status(200).json({ message: `${user.name} has been promoted to Admin` });
  } catch (error) {
    console.error("Promote User Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    console.error("Get All Users Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
