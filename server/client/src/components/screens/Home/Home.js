import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { showNoDataError } from "../../../helpers/message";
import Tweet from "../Tweet/Tweet";
import {
  deleteTweet,
  getMyTweets,
  likeTweet,
  unlikeTweet,
} from "../../../api/tweet";
import Sidebar from "../../Sidebar/Sidebar";
import Trends from "../Trends/Trends";
import { isAuthenticated } from "../../../helpers/auth";

const Home = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  /* useEffect gets mounted when page loads  */
  useEffect(() => {
    if (isAuthenticated) {
      //get all tweets and add to local state
      getMyTweets()
        .then((response) => {
          if (response.data.myTweets.length === 0) {
            setErrorMessage("You have no tweets.. Create one");
          }
          setData(response.data.myTweets);
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
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            return response.data;
          } else {
            return item;
          }
        });
        setData(newData);
        console.log(newData);
      })
      .catch((err) => console.log(err));
  };

  /* unlike a tweet handler */
  const handleUnlike = (id) => {
    unlikeTweet(id)
      .then((response) => {
        const newData = data.map((item) => {
          if (item._id === response.data._id) {
            console.log("responsedata", response.data);
            return response.data;
          } else {
            console.log("item", item);
            return item;
          }
        });
        setData(newData);
        console.log(newData);
      })
      .catch((err) => console.log(err));
  };

  /* delete a tweet handler */
  const handleDelete = (tweetId) => {
    deleteTweet(tweetId)
      .then((result) => {
        if (window.confirm("Are you sure?")) {
          const newData = data.filter((item) => {
            return item._id !== result._id;
          });
          setData(newData);
        }
        //reload page
        window.location.reload();
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
            {errorMessage && showNoDataError(errorMessage)}
            {data.map((tweet) => (
              <div className="card list-group-item" key={tweet._id}>
                <div className="card-body ">
                  <div className="tweet-avatar tweet-title">
                    <img src={user.photo} alt="avatar" />
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
                      <Link to="/profile">{tweet.tweetBy.username}</Link>
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
          <Trends />
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
