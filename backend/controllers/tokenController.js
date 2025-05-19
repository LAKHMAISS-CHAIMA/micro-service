const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Token = require("../models/Token");
const sendEmail = require("../utils/sendEmail");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 30 * 60 * 1000; 

    await Token.create({
      userId: user._id,
      token,
      type: "reset",
      expiresAt: expires
    });

    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    await sendEmail(
      email,
      "Password Reset Request",
      `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>
       <p>This link will expire in 30 minutes.</p>`
    );

    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  try {
    const dbToken = await Token.findOne({ token, type: "reset" });
    if (!dbToken) return res.status(400).json({ message: "Invalid token" });

    if (dbToken.expiresAt < Date.now()) {
      await Token.deleteOne({ _id: dbToken._id });
      return res.status(400).json({ message: "Expired token" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findById(dbToken.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    await Token.deleteOne({ _id: dbToken._id });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
