const {
  getUserProfileController,
  followUserController,
  unfollowUserController,
  signupController,
  signinController,
  uploadController,
} = require("../controllers/userController");
const {
  signupValidator,
  validatorResult,
  signinValidator,
} = require("../middleware/validator");
const authenticateJwt = require("../middleware/verifyToken");

const router = require("express").Router();

/*
 @desc Signup a user
 @route POST /api/user/?
@access  Public
*/
router.post("/signup", signupValidator, validatorResult, signupController);
router.post("/signin", signinValidator, validatorResult, signinController);

/*
 @desc  get user data
 @route GET /api/user/? 
@access  Private
*/
router.get("/profile/:userId", authenticateJwt, getUserProfileController);

/*
 @desc update data
 @route PUT /api/user/? 
@access  private
*/

router.put("/follow", authenticateJwt, followUserController);
router.put("/unfollow", authenticateJwt, unfollowUserController);
router.put("/updatePhoto", authenticateJwt, uploadController);

module.exports = router;
