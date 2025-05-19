const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));
app.use(express.json());           

app.use('/auth', authRoutes);
app.use('/user', userRoutes);  

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(" MongoDB Connected");

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error(" MongoDB Connection Error:", err);
});
