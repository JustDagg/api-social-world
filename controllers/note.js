const Note = require('../models/note');

// getNotes
exports.getNotes = (req, res) => {
    Note.find({})
        .populate("postedBy", "_id name")
        .select('_id content created postedBy')
        .sort({ created: -1 })
        .exec((err, notes) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json(notes);
        });
};

// getNoteByUserId
exports.getNoteByUserId = (req, res) => {
    const userId = req.params.userId;

    Note.find({ postedBy: userId })
        .populate("postedBy", "_id name")
        .select('_id content created postedBy')
        .sort({ created: -1 })
        .exec((err, notes) => {
            if (err) {
                return res.status(400).json({ error: "Could not retrieve notes for the user" });
            }
            res.json(notes);
        });
};


// createNote
exports.createNote = (req, res) => {
    const { content } = req.body;
    const userId = req.params.userId;

    if (!content) {
        return res.status(400).json({ error: "Content is required" });
    }

    const note = new Note({
        content,
        postedBy: userId
    });

    note.save((err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json(result);
    });
};

// updateNote
exports.updateNote = (req, res) => {
    const note = req.note;

    note.content = req.body.content || note.content;

    note.save((err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json(result);
    });
};

// deleteNote
exports.deleteNote = (req, res) => {
    const note = req.note;
    const userId = req.params.userId; // Lấy userId từ params

    // Kiểm tra nếu note được tạo bởi userId
    if (note.postedBy._id.toString() !== userId) {
        return res.status(403).json({ error: "User not authorized to delete this note." });
    }

    note.remove((err, deletedNote) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json({ message: "Successfully deleted the note" });
    });
};

// noteById
exports.noteById = (req, res, next, id) => {
    Note.findById(id)
        .populate("postedBy", "_id name")
        .exec((err, note) => {
            if (err || !note) {
                return res.status(400).json({ error: "Note not found" });
            }
            req.note = note;
            next();
        });
};
