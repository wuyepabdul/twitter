import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import {
  addComment,
  deleteTweet,
  getSubscribedTweets,
  likeTweet,
  unlikeTweet,
} from "../../api/tweet";
import { getUserData } from "../../api/userAuth";
import "../../App.css";
import { showNoDataError } from "../../helpers/message";
import { userActions } from "../../redux/actions/userActions";

const SubscribedPosts = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  const [button, setButton] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});
  useEffect(() => {
    // check for user to add in redux state

    const user = localStorage.getItem("user");

    setUserData(JSON.parse(localStorage.getItem("user")));

    if (user) {
      //get all posts
      getSubscribedTweets()
        .then((response) => {
          console.log("allposts", response);
          if (response.data.tweets.length === 0) {
            setErrorMessage(
              "You have no Subscribed posts.. Follow a User for subscribed posts"
            );
          }
          setData(response.data.tweets);
        })
        .catch((err) => {
          console.log(err.response.data.message);
        });

      //get user data
      getUserData().then((response) => {
        console.log("userdata=> ", response.data);
        dispatch(userActions(response.data));
      });
    } else {
      history.push("/signin");
    }
  }, []);

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

  const handleAddComment = (tweetId, text) => {
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
      .catch((err) => console.log(err));
  };

  const handleOnchange = () => {
    setButton(
      <button className="btn btn-outline-secondary btn-sm m-1"> Add</button>
    );
  };

  const handleDelete = (tweetId) => {
    deleteTweet(tweetId)
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Fragment>
      {errorMessage ? (
        <div className="text-center">{showNoDataError(errorMessage)}</div>
      ) : (
        <div>
          {errorMessage && showNoDataError(errorMessage)}
          {data.map((posts) => (
            <div className="card home-card shadow" key={posts._id}>
              <h5>
                <Link
                  to={
                    posts.postBy._id !== userData.id
                      ? "/profile/" + posts.postBy._id
                      : "/profile"
                  }
                >
                  {posts.postBy.username}
                </Link>
                {posts.postBy._id === userData.id && (
                  <i
                    className="far fa-trash-alt p-1"
                    onClick={() => {
                      handleDelete(posts._id);
                    }}
                    style={{ float: "right" }}
                  ></i>
                )}
              </h5>
              <img src={posts.photo} alt="avatar" />
              <div className="card-body">
                <i className="fas fa-heart" style={{ color: "red" }}></i>

                {posts.likes.includes(userData.id) ? (
                  <i
                    className="fas fa-thumbs-down p-2"
                    onClick={() => {
                      handleUnlike(posts._id);
                      console.log("post it");
                    }}
                  ></i>
                ) : (
                  <i
                    className="fas fa-thumbs-up p-2"
                    onClick={() => {
                      handleLike(posts._id);
                      console.log("post it");
                    }}
                  ></i>
                )}

                <h6 className="card-title"> {posts.likes.length} likes </h6>

                <h6 className="card-title"> {posts.title} </h6>

                <p className="card-text">{posts.content}</p>
                {posts.comments.map((comment) => {
                  return (
                    <div key={comment._id}>
                      <b>{comment.postBy.username}: </b>
                      {comment.text}{" "}
                    </div>
                  );
                })}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddComment(e.target[0].value, posts._id);
                  }}
                >
                  <textarea
                    placeholder="comment"
                    onChange={handleOnchange}
                    className="form-control"
                  ></textarea>
                  {button}
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  );
};

export default SubscribedPosts;
