const express = require("express");
const router = express.Router();
const { predictDisaster } = require("../controllers/predictionController");

router.post("/predict", predictDisaster);

module.exports = router;