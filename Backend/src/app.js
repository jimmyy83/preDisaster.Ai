const express = require("express");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());
app.use("/api", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/predict", predictionRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/chatbot", chatbotRoutes);


module.exports = app;