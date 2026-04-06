const express = require("express");
const router = express.Router();

const { predictDisaster } = require("../controllers/predictionController");

// ✅ Prediction API
router.post("/", predictDisaster);

module.exports = router;