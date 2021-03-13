import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { uploadPhoto } from "../../api/cloudinaryRequests";
import { getMyTweets } from "../../api/tweet";
import { updateProfilePhoto } from "../../api/userAuth";
import { isAuthenticated } from "../../helpers/auth";
import { showLoading } from "../../helpers/loading";
import { updatePhoto } from "../../redux/actions/userActions";
import Sidebar from "../Sidebar/Sidebar";
const Profile = () => {
  const history = useHistory();
  const [ProfileData, setProfileData] = useState({
    userData: {},
    mytweet: [],
  });
  const [image, setImage] = useState("");
  const dispatch = useDispatch();
  const state = useSelector((state) => state.user);
  console.log("profileRedux", state);
  useEffect(() => {
    if (!isAuthenticated) {
      history.push("/signin");
    }
    getMyTweets()
      .then((response) => {
        setProfileData({
          ...ProfileData,
          userData: response.data.mytweet[0].tweetBy,
          mytweet: response.data.mytweet,
        });
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (image) {
      uploadPhoto(image)
        .then((response) => {
          console.log("response", response);
          updateProfilePhoto(response.data.url).then((result) => {
            localStorage.setItem(
              "user",
              JSON.stringify({ ...state, photo: result.data.photo })
            );
            dispatch(updatePhoto(result.data.photo));
            console.log("result response =>", result);
          });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);

  const hiddenFileInput = React.useRef(null);

  const handleEditClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleImageUpload = (event) => {
    const fileUploaded = event.target.files[0];
    setImage(fileUploaded);
  };

  return (
    <Fragment>
      <div className="container-fluid row">
        <div className="col-sm-3">
          <Sidebar />
        </div>
        <div className="col-sm-6">
          {!ProfileData ? (
            showLoading()
          ) : (
            <div
              className="px-10"
              style={{ maxWidth: "500px", margin: "0px auto", padding: "10px" }}
            >
              <div
                style={{
                  margin: "18px 0px",
                  borderBottom: "1px solid grey",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                  }}
                >
                  <div>
                    <img
                      style={{
                        width: "160px",
                        height: "160px",
                        borderRadius: "80px",
                      }}
                      src={state ? state.photo : "loading.."}
                      alt="avatar"
                    />
                  </div>
                  <div></div>
                  <div>
                    <h4> {state.username}</h4>
                    <h6> {state.email}</h6>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "108%",
                      }}
                    >
                      <h6>{ProfileData.mytweet.length} tweets</h6>
                      <h6>
                        {" "}
                        {state.followers
                          ? `${state.followers.length} followers`
                          : ""}
                      </h6>
                      <h6>
                        {" "}
                        {state.following
                          ? `${state.following.length} following`
                          : ""}
                      </h6>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="input-group mb-3">
                    <button
                      className="btn btn-primary "
                      onClick={handleEditClick}
                      style={{ margin: "10px 0px 10px 48px" }}
                    >
                      Edit Pic
                    </button>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="tweetImage"
                        ref={hiddenFileInput}
                        className="custom-file-input"
                        id="inputGroupFile01"
                        aria-describedby="inputGroupFileAddon01"
                        onChange={handleImageUpload}
                        style={{ display: "none" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="gallery">
                {ProfileData.mytweet.map((tweet) => (
                  <img
                    className="item mb-2"
                    key={tweet._id}
                    src={tweet.photo}
                    alt=""
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="col-sm-3">Trends</div>
      </div>
    </Fragment>
  );
};

export default Profile;
