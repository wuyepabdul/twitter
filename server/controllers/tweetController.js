// @desc create new tweet
// @route post /api/tweet

const Tweet = require("../models/tweetModel");

// @access Private
module.exports.createTweetController = async (req, res) => {
  try {
    const { tweet, photo } = req.body;
    console.log("tweetDataFromClien", tweet, photo);
    const newTweet = new Tweet({
      tweet,
      tweetBy: req.user,
      photo,
    });
    await newTweet.save();
    res.json(newTweet);
  } catch (error) {
    console.log("createTweetController Error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

// @desc GET all tweets
// @route get /api/tweet
// @access Private

module.exports.getAllTweetController = async (req, res) => {
  try {
    const allTweets = await Tweet.find()
      .sort({ createdAt: -1 })
      .populate("tweetBy", "_id username email photo");
    if (allTweets) {
      res.json({ allTweets });
    } else {
      res.status(404).json({ message: "No tweets found at this time" });
    }
  } catch (error) {
    console.log("getAllTweetController Error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

// @desc GET subscribed tweets
// @route GET /api/tweet/subscribedTweets
// @access Private

module.exports.getSubscribedTweetsController = async (req, res) => {
  try {
    // check for tweetBy(tweet creator) in loggedIn User's following list
    const subscribedTweets = await Tweet.find({
      tweetBy: { $in: req.user.following },
    })
      .sort({ createdAt: -1 })
      .populate("tweetBy", "_id username email");
    if (subscribedTweets) {
      res.json({ subscribedTweets });
    } else {
      res.status(404).json({ message: "No tweets found" });
    }
  } catch (error) {
    console.log("getSubscribedTweetsController Error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

// @desc GET all my tweets
// @route get /api/tweet/myTweets
// @access Private
module.exports.getMyTweetsController = async (req, res) => {
  try {
    /*  */
    const myTweets = await Tweet.find({ tweetBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("tweetBy", "_id username email");
    if (myTweets) {
      res.json({ myTweets });
    } else {
      res
        .status(404)
        .json({ message: "You have no tweets, please create your tweets" });
    }
  } catch (error) {
    console.log("getAllMyTweetsController Error,", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

// @desc like a tweet
// @route PUT /api/tweet/like
// @access Private
module.exports.likeTweetController = async (req, res) => {
  try {
    const { tweetId } = req.body;
    //find tweet with given id and add loggedIn user to tweet like-lists
    Tweet.findByIdAndUpdate(
      tweetId,
      {
        $push: { likes: req.user.id },
      },
      { new: true }
    )
      .populate("tweetBy", "_id username email")
      .exec((err, result) => {
        if (err) {
          res.status(422).json({ message: err });
        } else {
          res.json(result);
        }
      });
  } catch (error) {
    console.log("likeTweetController Error", error.message);
  }
};

// @desc unlike a tweet
// @route PUT /api/tweet/like
// @access Private
module.exports.unlikeTweetController = async (req, res) => {
  try {
    const { tweetId } = req.body;

    //find tweet with given id and remove loggedIn user from tweet like-lists
    Tweet.findByIdAndUpdate(
      tweetId,
      {
        $pull: { likes: req.user.id },
      },
      { new: true }
    )
      .populate("tweetBy", "_id username email")
      .exec((err, result) => {
        if (err) {
          res
            .status(422)
            .json({ message: err && err.message ? err.message : err });
        } else {
          res.json(result);
        }
      });
  } catch (error) {
    console.log("unlikeTweetController Error", error.message);
  }
};

// @desc create a tweet comment
// @route PUT /api/tweet/comment
// @access Private
module.exports.tweetCommentController = async (req, res) => {
  try {
    const comment = { text: req.body.text, commentBy: req.user._id };
    Tweet.findByIdAndUpdate(
      tweetId,
      {
        $push: { comments: comment },
      },
      { new: true }
    )
      .populate("comments.commentBy", "_id username")
      .exec((err, result) => {
        if (err) {
          res
            .status(422)
            .json({ message: err && err.message ? err.message : err });
        } else {
          res.json(result);
        }
      });
  } catch (error) {
    console.log("tweetCommentController Error-", error.message);
  }
};

// @desc delete a tweet
// @route DELETE /api/tweet/delete
// @access Private

module.exports.deleteTweetController = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (tweet) {
      await tweet.remove();
      res.json({ message: "Tweet deleted" });
    } else {
      res.status(404).json({ message: "Tweet not found" });
    }
  } catch (error) {
    console.log("deleteTweetController Error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
};
