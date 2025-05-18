const User = require("../models/User");
const Token = require("../models/Token");
const UserLogs = require("../models/UserLogs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.updateUsername = async (req, res) => {
  const { username } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const oldValue = user.username;
  user.username = username;
  await user.save();

  await UserLogs.create({
    userId: user._id,
    field: "username",
    oldValue,
    newValue: username,
  });

  res.json({ message: "Username updated" });
};

exports.requestEmailUpdate = async (req, res) => {
  const { email } = req.body;
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 10 * 60 * 1000;

  await Token.create({
    userId: user._id,
    token,
    type: "email",
    expiresAt: expires,
  });

  const link = `http://localhost:5173/confirm-email?token=${token}`;

  await sendEmail(email, "Confirm your new email", `<p>Click <a href="${link}">here</a> to confirm your new email.</p>`);

  res.json({ message: "Confirmation email sent" });
};

exports.confirmEmailUpdate = async (req, res) => {
  const { token } = req.query;
  const dbToken = await Token.findOne({ token, type: "email" });
  if (!dbToken || dbToken.expiresAt < Date.now()) return res.status(400).json({ message: "Invalid or expired token" });

  const user = await User.findById(dbToken.userId);
  const oldValue = user.email;

  user.email = req.body.email;
  await user.save();

  await UserLogs.create({
    userId: user._id,
    field: "email",
    oldValue,
    newValue: user.email,
  });

  await Token.deleteOne({ _id: dbToken._id });

  res.json({ message: "Email updated" });
};
