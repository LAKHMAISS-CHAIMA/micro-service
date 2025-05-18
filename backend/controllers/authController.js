exports.register = async (req, res) => {
  const { username, email, password, phoneNumber, role } = req.body;

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
