const User = require("../models/User");
const Token = require("../models/Token");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/sendEmail");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 10 * 60 * 1000;

  await Token.create({
    userId: user._id,
    token,
    type: "reset",
    expiresAt: expires,
  });

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  await sendEmail(email, "Reset your password", `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`);

  res.json({ message: "Reset email sent" });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;
  const dbToken = await Token.findOne({ token, type: "reset" });
  if (!dbToken || dbToken.expiresAt < Date.now()) return res.status(400).json({ message: "Invalid or expired token" });

  const user = await User.findById(dbToken.userId);
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  await Token.deleteOne({ _id: dbToken._id });

  res.json({ message: "Password updated successfully" });
};