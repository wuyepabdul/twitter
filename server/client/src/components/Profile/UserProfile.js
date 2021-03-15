import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showLoading } from "../../helpers/loading";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { followUser, getUserProfile, unfollowUser } from "../../api/userAuth";
import { followAction, unfollowAction } from "../../redux/actions/userActions";
import Sidebar from "../Sidebar/Sidebar";
const UserProfile = () => {
  const history = useHistory();
  const [UserProfile, setUserProfile] = useState(null);
  const { userId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();

  const [showFollow, setShowFollow] = useState(
    user.following.includes(userId) ? false : true
  );

  useEffect(() => {
    if (!user) {
      history.push("/signin");
    }
    if (user._id === userId) {
      history.push("/profile");
    }

    getUserProfile(userId)
      .then((response) => {
        setUserProfile(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const checkFollow = (userId) => {
    const match = user.following.includes(userId);
    return match;
  };

  const handleFollow = () => {
    followUser(userId)
      .then((response) => {
        console.log("followRes", response.data);
        dispatch(
          followAction({
            followers: response.data.followers,
            following: response.data.following,
          })
        );

        // update user in local storage
        localStorage.setItem("user", JSON.stringify(response.data));
        setUserProfile((prevState) => {
          return {
            ...UserProfile,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, response.data._id],
            },
          };
        });
        setShowFollow(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUnfollow = () => {
    unfollowUser(userId)
      .then((response) => {
        console.log("unFollowRes", response.data);
        dispatch(
          unfollowAction({
            followers: response.data.followers,
            following: response.data.following,
          })
        );

        // update user data in local storage
        localStorage.setItem("user", JSON.stringify(response.data));

        setUserProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== response.data._id
          );
          return {
            ...UserProfile,
            user: { ...prevState.user, followers: newFollower },
          };
        });
        setShowFollow(true);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="container-fluid row">
      <div className="col-sm-3">
        <Sidebar />
      </div>
      <div className="col-sm-6">
        {console.log("user", user)}
        {UserProfile ? (
          <div className="userProfile-container">
            <div className="userProfile-info">
              <div className="userProfile-image">
                <img src={UserProfile.user.photo} alt="avatar" />
              </div>
              <div>
                <h4> {UserProfile.user.username}</h4>
                <h6> {UserProfile.user.email}</h6>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "108%",
                  }}
                >
                  <h6>{UserProfile.tweets.length} tweets</h6>
                  <h6>
                    {" "}
                    {parseInt(UserProfile.user.followers.length) === 1
                      ? `${UserProfile.user.followers.length} follower`
                      : `${UserProfile.user.followers.length} followers`}{" "}
                  </h6>
                  <h6> {UserProfile.user.following.length} following</h6>
                  {showFollow ? (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleFollow()}
                    >
                      follow
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUnfollow()}
                    >
                      unfollow
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="gallery">
              {UserProfile.tweets.map((tweet) => (
                <div className="card list-group-item" key={tweet._id}>
                  <div className="card-body ">
                    <i
                      className="fa fa-trash delete-tweet"
                      aria-hidden="true"
                    ></i>

                    <div className="tweet-title">
                      <div className="tweet-image">
                        <img src="/" alt="avatar" />
                      </div>
                      <h5 className="card-text">
                        <small>
                          <Link to={`/profile/${tweet.tweetBy._id}`}>
                            <p>
                              {" "}
                              {tweet.tweetBy.username} {"||"}{" "}
                              {tweet.tweetBy.email}
                            </p>
                          </Link>
                          {tweet.createdAt.substring(0, 10)}
                        </small>
                      </h5>
                    </div>
                    <p className="card-text">{tweet.tweet}</p>
                  </div>
                  <div className="tweet-image">
                    <img src={tweet.photo} alt="avatar" />
                  </div>

                  <div className="like-tweet ">
                    <div>
                      <i className="fa fa-comment" aria-hidden="true"></i>
                    </div>

                    <div>
                      <i className="fa fa-retweet" aria-hidden="true"></i>
                    </div>
                    <div>
                      {/* {tweet.likes.includes(user._id) ? (
                        <FavoriteIcon
                          className="unlike-tweet-icon"
                          onClick={() => handleUnlike(tweet._id)}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          className="like-tweet-icon"
                          onClick={() => handleLike(tweet._id)}
                        />
                      )} */}
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
        ) : (
          showLoading()
        )}
      </div>

      <div className="col-sm-3">Trends</div>
    </div>
  );
};

export default UserProfile;
