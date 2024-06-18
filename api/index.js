require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blog");
const connectDB = require("./config/dbConfig");

connectDB();

const app = express();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;