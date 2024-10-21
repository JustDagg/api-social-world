const express = require('express')
const { signup, signin, signout, forgotPassword, resetPassword, socialLogin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const {userSignupValidator, passwordResetValidator} = require('../validator/index');

const router = express.Router();

// /signup
router.post("/signup", userSignupValidator, signup);

// /signin
router.post("/signin", signin);

// /signout
router.get("/signout", signout);

// /social-login
router.post("/social-login", socialLogin); 

// /forgot-password
router.put("/forgot-password", forgotPassword);

// /reset-password
router.put("/reset-password", passwordResetValidator, resetPassword);

// :userId
router.param("userId", userById);

module.exports = router;