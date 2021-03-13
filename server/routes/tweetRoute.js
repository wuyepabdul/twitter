const {
  getAllTweetController,
  getSubscribedTweetsController,
  createTweetController,
  likeTweetController,
  unlikeTweetController,
  tweetCommentController,
  deleteTweetController,
  getMyTweetsController,
} = require("../controllers/tweetController");
const { validatorResult, tweetValidator } = require("../middleware/validator");
const authenticateJwt = require("../middleware/verifyToken");

const router = require("express").Router();

// @desc GET tweets
// @route GET /api/tweet/?
// @access Private
router.get("/allTweets", authenticateJwt, getAllTweetController);
router.get("/myTweets", authenticateJwt, getMyTweetsController);
router.get("/subscribedTweets", authenticateJwt, getSubscribedTweetsController);

// @desc create new tweet
// @route POST /api/tweet
// @access Private
router.post(
  "/createTweet",
  authenticateJwt,
  tweetValidator,
  validatorResult,
  createTweetController
);

// @desc like a tweet
// @route PUT /api/tweet/?
// @access Private
router.put("/like", authenticateJwt, likeTweetController);
router.put("/unlike", authenticateJwt, unlikeTweetController);
router.put("/comment", authenticateJwt, tweetCommentController);

// @desc like a tweet
// @route PUT /api/tweet/delete/:tweetId
// @access Private
router.delete("/delete/:tweetId", authenticateJwt, deleteTweetController);

module.exports = router;
