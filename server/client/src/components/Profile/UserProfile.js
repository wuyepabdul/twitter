import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoading } from "../../helpers/loading";
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

  // runs first when the page loads
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
  }, [history, userId]);

  const handleFollow = () => {
    followUser(userId)
      .then((response) => {
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
        {UserProfile ? (
          <div className="userProfile-container">
            <div className="userProfile-info">
              <div className="userProfile-image">
                <img src={UserProfile.user.photo} alt="avatar" />
              </div>
              <div className="flex-display">
                <div>
                  <h4> {UserProfile.user.username}</h4>
                  <h6> {UserProfile.user.email}</h6>{" "}
                </div>
                <div>
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

              <div className="user-info mt-5">
                <div>
                  {" "}
                  <h6>{UserProfile.tweets.length} tweets</h6>{" "}
                </div>
                <div>
                  {" "}
                  <h6>
                    {" "}
                    {parseInt(UserProfile.user.followers.length) === 1
                      ? `${UserProfile.user.followers.length} follower`
                      : `${UserProfile.user.followers.length} followers`}{" "}
                  </h6>
                </div>
                <div>
                  {" "}
                  <h6> {UserProfile.user.following.length} following</h6>
                </div>
              </div>
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
