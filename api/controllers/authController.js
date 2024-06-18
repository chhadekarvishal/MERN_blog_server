const User = require("./../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("./../utils/sendEmail");

// Register a new user
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Validate request
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //if not, create a new user
    const user = new User({
      name,
      email,
      password,
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    //If user is not present
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    console.error("Error in login: ", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Validate request
    if (!email) {
      return res.status(400).json({ message: "Please provide an email" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Create reset URL
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const message = `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`;

    // Send email
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: message,
    });

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
