const User = require("../db/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;



if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
}
        // 🔥 check existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Error registering user",
            error: error.message
        });
    }
};

// ✅ login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user._id, role: "user" }, // 🔥 role added
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
    message: "Login successful",
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email
    }
});

    } catch (error) {
        res.status(500).json({
            message: "Login error",
            error: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser
};