const express = require("express");
const router = express.Router();
const { predictDisaster } = require("../controllers/predictionController");

router.post("/", predictDisaster); // 🔥 correct

module.exports = router;