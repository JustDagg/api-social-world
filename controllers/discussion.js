const Discussion = require('../models/discussion');

// Get all discussion posts
exports.getDiscussionPosts = (req, res) => {
    const subject = req.query.subject;
    const startDate = req.query.startDate; 
    const endDate = req.query.endDate;

    let filter = {};
    if (subject) {
        filter.subject = subject;
    }

    // Filter for created date if provided
    if (startDate || endDate) {
        filter.created = {};
        if (startDate) {
            filter.created.$gte = new Date(startDate); // Greater than or equal to startDate
        }
        if (endDate) {
            filter.created.$lte = new Date(endDate); // Less than or equal to endDate
        }
    }

    Discussion.find(filter)
        .populate("postedBy", "_id name university")
        .select('_id question correctAnswer answer1 answer2 answer3 answer4 subject created postedBy likes')
        .sort({ created: -1 })
        .exec((err, discussions) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json(discussions);
        });
};

// Create a new discussion post
exports.createDiscussionPost = (req, res) => {
    const { question, correctAnswer, answer1, answer2, answer3, answer4, subject } = req.body;
    const userId = req.params.userId;

    if (!question || !correctAnswer) {
        return res.status(400).json({ error: "question and correctAnswer are required" });
    }

    const discussion = new Discussion({
        question,
        correctAnswer,
        answer1,
        answer2,
        answer3,
        answer4,
        subject,
        postedBy: userId
    });

    discussion.save((err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json(result);
    });
};

// Update an existing discussion post
exports.updateDiscussionPost = (req, res) => {
    const discussion = req.discussion;

    // Update fields if they are provided in the request body
    discussion.question = req.body.question || discussion.question;
    discussion.correctAnswer = req.body.correctAnswer || discussion.correctAnswer;
    discussion.answer1 = req.body.answer1 || discussion.answer1;
    discussion.answer2 = req.body.answer2 || discussion.answer2;
    discussion.answer3 = req.body.answer3 || discussion.answer3;
    discussion.answer4 = req.body.answer4 || discussion.answer4;
    discussion.subject = req.body.subject || discussion.subject;

    discussion.save((err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json(result);
    });
};

// Delete a discussion post
exports.deleteDiscussionPost = (req, res) => {
    const discussion = req.discussion;
    discussion.remove((err, deletedDiscussion) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json({ message: "Successfully deleted the discussion" });
    });
};

// Middleware to fetch discussion by ID
exports.discussionById = (req, res, next, id) => {
    Discussion.findById(id)
        .populate("postedBy", "_id name")
        .exec((err, discussion) => {
            if (err || !discussion) {
                return res.status(400).json({ error: "Discussion not found" });
            }
            req.discussion = discussion;
            next();
        });
};

// likeDiscussionPost
exports.likeDiscussionPost = (req, res) => {
    const userId = req.body.userId;
    const discussionId = req.params.discussionId;

    Discussion.findByIdAndUpdate(
        discussionId,
        { $addToSet: { likes: userId } },
        { new: true }
    )
        .populate("postedBy", "_id name")
        .exec((err, discussion) => {
            if (err || !discussion) {
                return res.status(400).json({ error: err });
            }
            res.json(discussion);
        });
};

// unlikeDiscussionPost
exports.unlikeDiscussionPost = (req, res) => {
    const userId = req.body.userId;
    const discussionId = req.params.discussionId;

    Discussion.findByIdAndUpdate(
        discussionId,
        { $pull: { likes: userId } },
        { new: true }
    )
        .populate("postedBy", "_id name")
        .exec((err, discussion) => {
            if (err || !discussion) {
                return res.status(400).json({ error: err });
            }
            res.json(discussion);
        });
};

// getSubjects
exports.getSubjects = (req, res) => {
    Discussion.distinct('subject')
        .exec((err, subjects) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json(subjects);
        });
};



