const express = require("express");
const router = express.Router();
const { predictDisaster } = require("../controllers/predictionController");

app.use("/api/predict", predictionRoutes);

module.exports = router;