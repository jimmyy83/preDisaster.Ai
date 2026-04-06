const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const { registerUser, loginUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});




module.exports = router;