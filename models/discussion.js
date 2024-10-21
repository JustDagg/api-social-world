const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const discussionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    correctAnswer: {
        type: String,
        required: true
    },
    answer1: {
        type: String,
    },
    answer2: {
        type: String,
    },
    answer3: {
        type: String,
    },
    answer4: {
        type: String,
    },
    subject: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    likes: [{ type: ObjectId, ref: "User" }],
});

// Export the Discussion model
module.exports = mongoose.model("Discussion", discussionSchema);
