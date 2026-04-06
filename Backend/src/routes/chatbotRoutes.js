const express = require("express");
const router = express.Router();

const { getChatbotReply } = require("../controllers/chatbotController");

// ✅ Chatbot API
router.post("/", getChatbotReply);

module.exports = router;