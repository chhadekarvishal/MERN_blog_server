const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./api/routes/authRoutes");
const blogRoutes = require("./api/routes/blog");
const connectDB = require("./api/config/dbConfig");

dotenv.config();

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
