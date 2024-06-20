require("dotenv").config();
const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blog");
const connectDB = require("./config/dbConfig");

connectDB();

const app = express();

// Use cors middleware
app.use(
  cors({
    origin: "https://mern-blog-server-eta.vercel.app",
    // origin: "http://localhost:3000", // Your frontend's URL
    credentials: true, // Allow cookies if needed
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
