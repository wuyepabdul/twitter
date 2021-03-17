import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { showNoDataError } from "../../../helpers/message";
import { setFormAction } from "../../../redux/actions/tweetActions";
import Tweet from "../Tweet/Tweet";
import {
  addComment,
  deleteTweet,
  getMyTweets,
  getSubscribedTweets,
  likeTweet,
  unlikeTweet,
} from "../../../api/tweet";
import Sidebar from "../../Sidebar/Sidebar";
import Trends from "../Trends/Trends";
import { isAuthenticated } from "../../../helpers/auth";
import { isEmpty } from "validator";

const Home = () => {
  const history = useHistory();

  const [data, setData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [subscribedTweets, setSubscribedTweets] = useState([]);
  const [allTweets, setAllTweets] = useState([]);
  const [tweetComment, setTweetComment] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const dispatch = useDispatch();
  const showForm = useSelector((state) => state.showForm);

  //get my tweets
  useEffect(() => {
    if (isAuthenticated) {
      getMyTweets()
        .then((response) => {
          if (response.data.myTweets.length === 0) {
            setErrorMessage("You have not created a tweet.. Create one");
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

  // get subscribed tweets
  useEffect(() => {
    if (isAuthenticated) {
      //get all tweets and add to local state
      getSubscribedTweets()
        .then((response) => {
          console.log("res", response.data);

          setSubscribedTweets(response.data.subscribedTweets);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      history.push("/signin");
    }
  }, [history]);

  // merge my tweets and subscribed tweets
  useEffect(() => {
    setAllTweets([...data, ...subscribedTweets]);
  }, [subscribedTweets, data]);

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
      })
      .catch((err) => console.log(err));
  };

  /* unlike a tweet handler */
  const handleUnlike = (id) => {
    unlikeTweet(id)
      .then((response) => {
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

  /* add a comment handler */

  const handleAddComment = (tweetId, text) => {
    dispatch(setFormAction());
    if (isEmpty(text)) {
      setErrorMessage("Comment Cannot be empty");
    } else {
      addComment(tweetId, text)
        .then((response) => {
          const newData = data.map((item) => {
            if (item._id === response.data._id) {
              return response.data;
            } else {
              return item;
            }
          });
          setData(newData);
        })
        .catch((err) => console.log("AddComment error", err.message));
    }
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
            {allTweets.map((tweet) => (
              <div className="card list-group-item" key={tweet._id}>
                <div className="card-body ">
                  <div className="tweet-avatar tweet-title">
                    <img
                      src={
                        user._id === tweet.tweetBy._id
                          ? user.photo
                          : tweet.tweetBy.photo
                      }
                      alt="avatar"
                    />
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
                    <i
                      className="fa fa-comment tweet-comment"
                      aria-hidden="true"
                      onClick={() => dispatch(setFormAction())}
                    ></i>
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
                {showForm && (
                  <div>
                    <div className="mt-2">
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddComment(tweet._id, tweetComment);
                        }}
                      >
                        <textarea
                          placeholder="comment"
                          name="text"
                          value={tweetComment}
                          onChange={(e) => setTweetComment(e.target.value)}
                          className="form-control"
                        ></textarea>
                        <button type="submit" className="mt-1 mb-1">
                          Add Comment
                        </button>
                      </form>
                    </div>
                    <div className="mt-3">
                      {tweet.comments.map((comment) => {
                        return (
                          <div key={comment._id}>
                            <b>{comment.tweetBy.username}: </b>
                            {comment.text}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
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
