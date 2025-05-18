const User = require("../models/User");
const bcrypt = require("bcrypt");

const authBasic = async (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Basic ")) {
    return res.status(401).json({ message: "No or bad credentials format" });
  }

  try {
    const base64Credentials = auth.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');

    if (!username || !password) {
      return res.status(400).json({ message: "Invalid credentials format" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Basic error:", error);
    res.status(500).json({ message: "Authentication error" });
  }
};

module.exports = authBasic;
