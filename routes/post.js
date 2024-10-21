const express = require('express')

const { requireSignin } = require('../controllers/auth');
const { getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost, photo, singlePost, like, unlike, comment, uncomment, countPosts, createPostRn, getPostPhotoRn, getAllPostsRn, updatePostRn } = require('../controllers/post')
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator/index');

const router = express.Router();

// /posts
router.get('/posts', getPosts);

// /rn/allposts
router.get('/rn/allposts', getAllPostsRn);

// /count/posts
router.get('/count/posts', countPosts);

// /post/like
router.put("/post/like", requireSignin, like);

// /post/unlike
router.put("/post/unlike", requireSignin, unlike);

// /post/comment
router.put("/post/comment", requireSignin, comment);

// /post/uncomment
router.put("/post/uncomment", requireSignin, uncomment);

// /post/new/:userId
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);

// /rn/post/new/:userId
router.post("/rn/post/new/:userId", requireSignin, createPostRn);

// /post/by/:userId
router.get("/post/by/:userId", postsByUser);

// /post/:postId
router.get("/post/:postId", singlePost);

// /post/:postId
router.put("/post/:postId", requireSignin, isPoster, updatePost);

// /rn/post/:postId
router.put("/rn/post/:postId", requireSignin, isPoster, updatePostRn);

// /post/:postId
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

// /post/photo/:postId
router.get("/post/photo/:postId", photo);

// :userId
router.param("userId", userById);

// :postId
router.param("postId", postById);

module.exports = router;