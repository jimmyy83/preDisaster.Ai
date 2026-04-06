const express = require("express");
const router = express.Router();

const { getNearestHelp } = require("../controllers/emergencyController");

router.post("/", getNearestHelp);

module.exports = router;