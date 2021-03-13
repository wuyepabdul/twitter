const mongoose = require("mongoose");
const {
  signupController,
  signinController,
} = require("../controllers/authController");
const router = require("express").Router();
const {
  signupValidator,
  signinValidator,
  validatorResult,
} = require("../middleware/validator");
const authenticateJwt = require("../middleware/verifyToken");

/*
 @desc Signup a user
 @route GET /api/user/signup 
@access  Public
*/
router.post("/signup", signupValidator, validatorResult, signupController);

router.post("/signin", signinValidator, validatorResult, signinController);

module.exports = router;
