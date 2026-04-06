const Report = require("../db/models/Report");

// ✅ Create Report
const createReport = async (req, res) => {
    try {
        const { type, location, description, severity } = req.body;

        const report = new Report({
            type,
            location,
            description,
            severity,
            user: req.user?.id   // agar login user hai
        });

        await report.save();

        res.status(201).json({
            message: "Report submitted successfully",
            report
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating report",
            error: error.message
        });
    }
};

// ✅ Get All Reports
const getReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.json(reports);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching reports",
            error: error.message
        });
    }
};

module.exports = {
    createReport,
    getReports
};