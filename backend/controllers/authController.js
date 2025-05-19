const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
    console.log("Request Body:", req.body);
  const { username, email, phoneNumber, password, role } = req.body;

  if (!username || !email || !password || !phoneNumber || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      role
    });

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

    res.status(201).json({
      message: "User created successfully",
      token,
      role: user.role,
      email: user.email
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

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

    res.status(200).json({
      token,
      role: user.role,
      email: user.email
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.userId || (req.user && req.user._id);
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const user = await User.findById(userId).select('-password').exec();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.refresh = async (req, res) => {
  try {
    const refreshToken = req.session.refreshToken;
    
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token not found" });
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      const token = jwt.sign(
        { UserInfo: { id: decoded.UserInfo.id } },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      req.session.token = token;
      
      const user = await User.findById(decoded.UserInfo.id).select('-password').exec();
      
      res.status(200).json({
        token,
        role: user.role,
        email: user.email
      });
    });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed", error: err.message });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: "Logged out successfully" });
  });
};