const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const tweetSchema = new mongoose.Schema(
  {
    tweet: { type: String, required: true },
    photo: {
      type: String,
      default:
        "https://res.cloudinary.com/dulswuyep/image/upload/v1615796469/grayish_d9gttj.jpg",
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      { text: { type: String }, tweetBy: { type: ObjectId, ref: "User" } },
    ],
    tweetBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Tweet = mongoose.model("Tweet", tweetSchema);
module.exports = Tweet;
