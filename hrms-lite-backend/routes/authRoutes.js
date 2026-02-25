const express = require("express");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/userModel");
const { authMiddleware } = require("../middleware/authMiddleware");

const AuthRouter = express.Router();

// Register new user
AuthRouter.post("/register", async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        msg: "Name, email and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        msg: "Please provide a valid email address",
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        msg: "Password must be at least 6 characters long",
      });
    }

    // Validate role if provided
    const validRoles = ["admin", "hr", "employee"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        msg: "Invalid role. Must be one of: admin, hr, employee",
      });
    }

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        msg: "An account with this email already exists",
      });
    }

    // Create new user
    const user = new UserModel({ email, password, name, role: role || "employee" });
    await user.save();

    res.status(201).json({
      success: true,
      msg: "Registration successful! You can now login.",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);

    // Handle duplicate key error (email already exists)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        msg: "An account with this email already exists",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, msg: messages.join(", ") });
    }

    res.status(500).json({
      success: false,
      msg: "Registration failed. Please try again later."
    });
  }
});

// Login user
AuthRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required",
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        msg: "Please provide a valid email address",
      });
    }

    // Find user (case-insensitive email)
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Invalid email or password",
      });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured");
      return res.status(500).json({
        success: false,
        msg: "Server configuration error. Please contact administrator.",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      msg: "Login successful! Welcome back.",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      msg: "Login failed. Please try again later."
    });
  }
});

// Get current user profile
AuthRouter.get("/profile", authMiddleware, async (req, res) => {
  try {
    // Validate user ID from token
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        msg: "Invalid authentication. Please login again.",
      });
    }

    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User account not found. It may have been deleted.",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Profile error:", error);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        msg: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      msg: "Failed to fetch profile. Please try again later."
    });
  }
});

// Get all users (admin only)
AuthRouter.get("/users", authMiddleware, async (req, res) => {
  try {
    // Check admin role
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Access denied. Only administrators can view all users.",
      });
    }

    const users = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch users. Please try again later."
    });
  }
});

// Update user password
AuthRouter.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        msg: "Current password and new password are required",
      });
    }

    // Validate new password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        msg: "New password must be at least 6 characters long",
      });
    }

    // Find user
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    // Verify current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        msg: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      msg: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to change password. Please try again later."
    });
  }
});

module.exports = { AuthRouter };

