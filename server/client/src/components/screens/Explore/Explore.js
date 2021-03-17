import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { showErrorMessage, showNoDataError } from "../../../helpers/message";
import Tweet from "../Tweet/Tweet";
import {
  deleteTweet,
  getAllTweets,
  likeTweet,
  unlikeTweet,
} from "../../../api/tweet";
import Sidebar from "../../Sidebar/Sidebar";
import Trends from "../Trends/Trends";
import { isAuthenticated } from "../../../helpers/auth";

const Explore = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (isAuthenticated) {
      //get all tweets and add to local state
      getAllTweets()
        .then((response) => {
          console.log("res", response.data);
          if (response.data.allTweets.length === 0) {
            setErrorMessage(
              "There are no tweets now, Be among the first user's to create a tweet"
            );
          }
          setData(response.data.allTweets);
        })
        .catch((err) => {
          console.log(err.response.data.errorMessage);
        });
    } else {
      history.push("/signin");
    }
  }, [history]);

  /* like a tweet handler */
  const handleLike = (id) => {
    likeTweet(id)
      .then((response) => {
        // iterate like list for new data if like button is clicked
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            return response.data;
          } else {
            return item;
          }
        });

        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  /* unlike a tweet handler */
  const handleUnlike = (id) => {
    unlikeTweet(id)
      .then((response) => {
        // iterate like list for new data if unlike button is clicked
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            return response.data;
          } else {
            return item;
          }
        });

        //set state Data with new data
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  /* delete a tweet handler */
  const handleDelete = (tweetId) => {
    deleteTweet(tweetId)
      .then((result) => {
        if (window.confirm("Are you sure?")) {
          // iterate tweets and return new data without deleted tweet
          const newData = data.filter((item) => {
            return item._id !== result._id;
          });

          // set state Data with new data
          setData(newData);
          window.location.reload();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      <div className="tweet-container container-fluid row">
        <div className="col-sm-3">
          <Sidebar />
        </div>
        <div className="col-sm-6">
          <Tweet />
          <div className="list-group">
            <div className="showLoading mt-4">
              {errorMessage && showNoDataError(errorMessage)}
            </div>
            {data.map((tweet) => (
              <div className="card list-group-item" key={tweet._id}>
                <div className="card-body ">
                  <div className="tweet-avatar tweet-title">
                    <img src={tweet.tweetBy.photo} alt="avatar" />
                  </div>
                  <div>
                    {" "}
                    {tweet.tweetBy._id === user._id && (
                      <i
                        className="fa fa-trash delete-tweet"
                        onClick={() => handleDelete(tweet._id)}
                        aria-hidden="true"
                      ></i>
                    )}
                  </div>
                </div>
                <div>
                  <small>
                    {tweet.tweetBy._id === user._id ? (
                      <Link to="/profile">
                        {tweet.tweetBy.username} {tweet.tweetBy.email}
                      </Link>
                    ) : (
                      <Link to={`/profile/${tweet.tweetBy._id}`}>
                        {" "}
                        {tweet.tweetBy.username} {tweet.tweetBy.email}
                      </Link>
                    )}
                    {tweet.createdAt.substring(0, 10)}
                  </small>
                </div>
                <div className="mt-2">
                  <p>{tweet.tweet}</p>{" "}
                </div>
                {tweet.photo !== null ? (
                  <div className="tweet-image">
                    <img src={tweet.photo} alt="avatar" />
                  </div>
                ) : (
                  ""
                )}

                <div className="like-tweet ">
                  <div>
                    <i className="fa fa-comment" aria-hidden="true"></i>
                  </div>

                  <div>
                    <i className="fa fa-retweet" aria-hidden="true"></i>
                  </div>
                  <div>
                    {tweet.likes.includes(user._id) ? (
                      <FavoriteIcon
                        className="unlike-tweet-icon"
                        onClick={() => handleUnlike(tweet._id)}
                      />
                    ) : (
                      <FavoriteBorderIcon
                        className="like-tweet-icon"
                        onClick={() => handleLike(tweet._id)}
                      />
                    )}
                    {tweet.likes.length} likes
                  </div>

                  <div>
                    <i className="fa fa-upload" aria-hidden="true"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-sm-3">
          <Trends />{" "}
        </div>
      </div>
    </Fragment>
  );
};

export default Explore;
