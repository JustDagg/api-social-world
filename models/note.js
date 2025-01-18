const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now,
        expires: 86400 // 24 hours in seconds (24 * 60 * 60 = 86400 seconds)
    },
    postedBy: {
        type: ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Note", noteSchema);
