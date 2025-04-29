const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Import
const { connectDB } = require("./config/connectDB");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

//Config
dotenv.config();
const app = express();

// Variable
const PORT = process.env.PORT;

// Use
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", uploadRoutes);

// Server React


app.listen(PORT, async () => {
  await connectDB();
  console.log("Server is running on port:", PORT);
});
