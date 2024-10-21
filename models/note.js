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
        expires: 18000 // 5 hours in seconds (5 * 60 * 60 = 18000 seconds)
    },
    postedBy: {
        type: ObjectId,
        ref: "User",
        required: true
    }
});

// Export the Note model
module.exports = mongoose.model("Note", noteSchema);
