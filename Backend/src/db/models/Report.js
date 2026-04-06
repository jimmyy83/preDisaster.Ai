const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Low"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;