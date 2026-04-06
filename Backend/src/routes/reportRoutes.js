const express = require("express");
const router = express.Router();

const { createReport, getReports } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Create report (protected route)
router.post("/", authMiddleware, createReport);

// ✅ Get all reports
router.get("/", getReports);

module.exports = router;