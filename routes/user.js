const express = require('express')

const { userById, allUsers, getUser, updateUser, deleteUser, userPhoto, addFollowing, addFollower, removeFollowing, removeFollower, findPeople, updateUserRn, searchUserByName, getUniversities, createNote } = require('../controllers/user');
const { requireSignin } = require('../controllers/auth');


const router = express.Router();

// /user/follow
router.put('/user/follow', requireSignin, addFollowing, addFollower);

// /user/unfollow
router.put('/user/unfollow', requireSignin, removeFollowing, removeFollower);

// /users
router.get("/users", allUsers);

// /user/:userId
router.get("/user/:userId", requireSignin, getUser);

// /user/:userId
router.put("/user/:userId", requireSignin, updateUser);

// /rn/user/:userId
router.put("/rn/user/:userId", requireSignin, updateUserRn);

// /user/:userId
router.delete("/user/:userId", requireSignin, deleteUser);

// /user/photo/:userId
router.get("/user/photo/:userId", userPhoto);

// /user/findpeople/:userId
router.get("/user/findpeople/:userId", requireSignin, findPeople);

// :userId
router.param("userId", userById);

// /user/search/:name
router.get("/user/search/:name", requireSignin, searchUserByName);

// /universities
router.get('/universities', requireSignin, getUniversities);

module.exports = router;