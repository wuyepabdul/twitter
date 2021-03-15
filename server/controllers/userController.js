const Tweet = require("../models/tweetModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/generateToken");

/*
 @desc Signup a user
 @route GET /api/user/signup 
@access  Public
*/
module.exports.signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //check if email exist
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "User Already Exist with this email" });
    }
    //check if username exist
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      res.status(400).json({
        message:
          "User already exist with this Username, try a different username",
      });
    }

    //hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    //save user
    const savedUser = await newUser.save();
    if (!savedUser) {
      return res.status(400).json({ message: "Bad Request, try again later" });
    }
    return res.status(200).json({
      message: "User Saved to DB",
      savedUser: { _id: savedUser._id, username: savedUser.username },
    });
  } catch (error) {
    console.log("signupController error", error.message);
    return res.status(500).json({ message: error });
  }
};

/*
 @desc Sign in a user
 @route POST /api/user/signin 
@access  Public
*/
module.exports.signinController = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exist
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.status(422).json({ message: "Invalid Credentials" });
    }
    const matchedPassword = await bcrypt.compare(password, userExist.password);
    if (matchedPassword) {
      //assign jwt token and login user
      res.json({
        token: generateToken(userExist._id),
        user: {
          _id: userExist._id,
          email: userExist.email,
          username: userExist.username,
          followers: userExist.followers,
          following: userExist.following,
          photo: userExist.photo,
        },
      });
    } else {
      return res.status(422).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log("signinController error", error.message);
    return res.status(500).json({ message: error });
  }
};

/*
 @desc get profile of other users
 @route GET /api/auth/user 
@access  Private
*/
module.exports.getUserProfileController = async (req, res) => {
  try {
    // find user with given query ID
    const user = await User.findById(req.params.userId).select("-password");
    if (user) {
      //find user tweets
      const userTweet = await Tweet.find({
        tweetBy: req.params.userId,
      }).populate("tweetBy", "_id username");
      if (userTweet) {
        res.json({ user, tweets: userTweet });
      }
    } else {
      res.status(404).json({ message: "No user Found" });
    }
  } catch (error) {
    console.log("getUserProfileController Error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

/*
 @desc follow a user 
 @route PUT/api/auth/user/follow 
@access  Private
*/

module.exports.followUserController = async (req, res) => {
  try {
    const { followId } = req.body;
    if (followId) {
      // update a User's followers list after getting the Id of loggedIn user
      const updateUserFollowers = await User.findByIdAndUpdate(
        followId,
        { $push: { followers: req.user._id } },
        { new: true }
      ).select("-password");
      if (updateUserFollowers) {
        //update loggedIn user following List
        const updateUserFollowing = await User.findByIdAndUpdate(
          req.user._id,
          { $push: { following: req.body.followId } },
          { new: true }
        ).select("-password");
        if (updateUserFollowing) {
          res.json(updateUserFollowing);
        }
      } else {
        console.log("updateUserFollowing Error");
      }
    } else {
      res.status(422).json({ message: "Could not get user details" });
    }
  } catch (error) {
    console.log("followUserController error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

/*
 @desc unfollow a user 
 @route PUT/api/auth/user/unfollow 
@access  Private
*/

module.exports.unfollowUserController = async (req, res) => {
  try {
    const { unfollowId } = req.body;
    if (unfollowId) {
      // update followed User followers list
      const updateUserFollowers = await User.findByIdAndUpdate(
        unfollowId,
        { $pull: { followers: req.user._id } },
        { new: true }
      ).select("-password");
      if (updateUserFollowers) {
        //update loggedIn user following List
        const updateUserFollowing = await User.findByIdAndUpdate(
          req.user._id,
          { $pull: { following: req.body.unfollowId } },
          { new: true }
        ).select("-password");
        if (updateUserFollowing) {
          res.json(updateUserFollowing);
        }
      } else {
        console.log("updateUserFollowing Error");
      }
    } else {
      res.status(422).json({ message: "Could not get user details" });
    }
  } catch (error) {
    console.log("unfollowUserController error", error.message);
    res.status(500).json({ message: "Server error, try again later" });
  }
};

/*  */

module.exports.uploadController = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        photo: req.body.photo,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res.status(422).json({ errorMessage: err });
      }

      res.json(result);
    }
  );
};
