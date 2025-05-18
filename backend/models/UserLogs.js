const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    field: {
        type: String,
        enum: ["username", "email", "phoneNumber"], required: true
    },
    oldValue: {
        type: String
    },
    newValue: {
        type: String
    },
    changedAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });

module.exports = mongoose.model("UserLogs", logSchema);
