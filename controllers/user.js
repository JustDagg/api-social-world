const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs');

const User = require('../models/user');

// userById
exports.userById = (req, res, next, id) => {
    User.findById(id)
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .select('name email university birthYear created about following followers')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User not found"
                });
            }
            req.profile = user;
            next();
        });
};

// hasAuthorization
exports.hasAuthorization = (req, res, next) => {
    const authorized = req.profile && req.auth && (req.profile._id === req.auth._id);
    if (!authorized) {
        return res.status(403).json({
            error: "user is not authorized to perform this action"
        });
    }
};

// allUsers
exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        return res.json(users);
    })
        .select("name email university birthYear updated created about following followers notificationToken")
        .populate('following', '_id name email')
        .populate('followers', '_id name email');
};

// getUser
exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

// updateUser
exports.updateUser = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        //save user
        let user = req.profile;
        user = _.extend(user, fields);
        user.updated = Date.now();

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        });
    });
};

// updateUserRn
exports.updateUserRn = (req, res) => {
    let user = req.profile;
    console.log(req.body);
    user = _.extend(user, req.body);

    user.updated = Date.now();

    if (req.body.base64Data && req.body.imageType) {
        user.photo.data = Buffer.from(req.body.base64Data, 'base64');
        user.photo.contentType = req.body.imageType;
    }

    user.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    });
};

// userPhoto
exports.userPhoto = (req, res, next) => {
    User.findById(req.params.userId, (err, user) => {
        if (err || !user) {
            res.status(400).json({
                error: err
            })
        }
        if (user.photo.data) {
            res.set("Content-Type", user.photo.contentType);
            return res.send(user.photo.data);
        }
        next();
    })
};

// deleteUser
exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        res.json({ message: "User deleted successfully" });
    });
};

// addFollowing
exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

// addFollower
exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err })
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

// removeFollowing
exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }, (err, result) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        next();
    });
};

// removeFollower
exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } }, { new: true })
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err })
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        });
};

// findPeople
exports.findPeople = async (req, res) => {
    let following = req.profile.following;
    following.push(req.profile._id);

    // Initialize the query object
    let query = { _id: { $nin: following } };

    // Get optional filters from query parameters
    const { university, birthYear } = req.query;

    // Add university filter if provided
    if (university && university.trim() !== "") {
        query.university = { $regex: new RegExp(university, "i") };
    }

    // Add birth year filter if provided and valid
    if (birthYear && !isNaN(birthYear) && birthYear >= 1900 && birthYear <= new Date().getFullYear()) {
        query.birthYear = birthYear;
    }

    try {
        const users = await User.find(query)
            .select("name email university birthYear");

        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found matching the criteria"
            });
        }

        res.json(users);
    } catch (err) {
        console.error("Error finding users:", err);
        return res.status(500).json({
            error: "Error finding users"
        });
    }
};

// getUniversities
exports.getUniversities = (req, res) => {
    User.distinct("university", (err, universities) => {
        if (err) {
            return res.status(400).json({ error: "Unable to fetch universities" });
        }
        res.json(universities);
    });
};

// searchUserByName
exports.searchUserByName = async (req, res) => {
    const name = req.params.name;
    const userId = req.auth._id;

    if (!name || name.trim() === "") {
        return res.status(400).json({
            error: "Name parameter is required"
        });
    }

    try {
        const user = await User.findById(userId).select('following');
        const followingIds = user.following.map(following => following._id.toString());

        const users = await User.find({
            name: { $regex: new RegExp(name, "i") },
            _id: { $nin: [...followingIds, userId] }
        }).select('_id name');

        if (users.length === 0) {
            return res.status(404).json({
                message: "No users found"
            });
        }

        res.json(users);
    } catch (err) {
        console.error("Error searching users:", err);
        return res.status(500).json({
            error: "Error searching for users"
        });
    }
};





