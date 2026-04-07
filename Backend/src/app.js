const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();  // 🔥 YE LINE MUST HAI (top pe)

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/predict", predictionRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/chatbot", chatbotRoutes);

// health route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

module.exports = app;