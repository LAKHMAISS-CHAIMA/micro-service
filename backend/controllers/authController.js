const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 15);
    const user = await User.create({ username, email, password: hashedPassword });
    const token = jwt.sign(
      { UserInfo: { id: user._id } },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      { UserInfo: { id: user._id } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    req.session.token = token;
    req.session.refreshToken = refreshToken;

    res.status(201).json({ message: "User created successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { UserInfo: { id: foundUser._id } },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const refreshToken = jwt.sign(
      { UserInfo: { id: foundUser._id } },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    req.session.token = token;
    req.session.refreshToken = refreshToken;

    res.json({ message: "Login successful", token, email: foundUser.email });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.refresh = (req, res) => {
  const refreshToken = req.session.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired refresh token" });
    }

    try {
      const foundUser = await User.findById(decoded.UserInfo.id).exec();
      if (!foundUser) {
        return res.status(403).json({ message: "User not found" });
      }

      const newToken = jwt.sign(
        { UserInfo: { id: foundUser._id } },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      req.session.token = newToken;
      res.json({ token: newToken });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
};

exports.getMe = async (req, res) => {
  const userId = req.userId; 

  try {
    const user = await User.findById(userId).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
