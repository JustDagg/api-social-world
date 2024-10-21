const express = require('express');
const router = express.Router();
const { getDiscussionPosts, createDiscussionPost, updateDiscussionPost, deleteDiscussionPost, discussionById, likeDiscussionPost, unlikeDiscussionPost, getSubjects, getUniversities } = require('../controllers/discussion');
const { requireSignin } = require('../controllers/auth'); // Assuming you have this middleware

// /discussion
router.get('/discussion', getDiscussionPosts);

// /discussions/subjects
router.get('/discussion/subjects', getSubjects);

// /discussion/new/:userId
router.post('/discussion/new/:userId', requireSignin, createDiscussionPost);

// /discussion/:discussionId
router.put('/discussion/:discussionId', requireSignin, updateDiscussionPost);

// /discussion/:discussionId
router.delete('/discussion/:discussionId', requireSignin, deleteDiscussionPost);

// /discussion/like/:discussionId
router.put('/discussion/like/:discussionId', requireSignin, likeDiscussionPost);

// /discussion/unlike/:discussionId
router.put('/discussion/unlike/:discussionId', requireSignin, unlikeDiscussionPost);

// :discussionId
router.param('discussionId', discussionById);

module.exports = router;
