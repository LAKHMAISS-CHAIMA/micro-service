require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const connectDB = require("./config/connectDB");

const authBasic = require("./middlewares/authBasic");
const authJWT = require("./middlewares/authJWT");
const authSession = require("./middlewares/authSession");

const PORT = process.env.PORT || 8000;

connectDB();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 
  }
}));

app.use("/auth", require("./routes/authRoutes"));
app.use("/users", require("./routes/userRoutes"));

app.get('/', (req, res) => {
  res.send("API is running...");
});

app.get('/basic-protected', authBasic, (req, res) => {
  res.json({ message: `Welcome ${req.user.username} (Basic Auth)` });
});

app.get('/jwt-protected', authJWT, (req, res) => {
  res.json({ message: `Welcome user ${req.userId} (JWT)` });
});

app.get('/session-protected', authSession, (req, res) => {
  res.json({ message: `Welcome user ${req.userId} (Session)` });
});

app.use(require('./middlewares/errorHandler'));

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
