import React, { useEffect, useState } from "react";
import { createTweet } from "../../../api/tweet";
import { isEmpty } from "validator";
import { uploadPhoto } from "../../../api/cloudinaryRequests";
import { showErrorMessage } from "../../../helpers/message";
import { useHistory } from "react-router";
import { showLoading } from "../../../helpers/loading";

const Tweet = () => {
  const [tweetData, setTweetData] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [tweetImage, setTweetImage] = useState("");

  const history = useHistory();
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!user) {
      history.push("/signin");
    }
  }, [user, history]);

  /* image upload handler */
  const handleImageChange = (e) => {
    setTweetImage(e.target.files[0]);
    setErrorMsg("");
  };

  const handleChange = (e) => {
    setTweetData(e.target.value);
    setErrorMsg("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEmpty(tweetData)) {
      setErrorMsg("Tweet cannot be empty");
    }

    // check if image is uploaded
    if (!tweetImage) {
      const formData = { tweet: tweetData };
      setLoading(true);
      createTweet(formData)
        .then((response) => {
          window.location.reload();
          // setTweetData("");
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setErrorMsg(err.response.data.errorMessage);
        });
    } else {
      setLoading(true);
      uploadPhoto(tweetImage)
        .then((response) => {
          const dataResponse = response.data.url;

          const formData = { tweet: tweetData, photo: dataResponse };
          //create tweet
          createTweet(formData)
            .then((response) => {
              console.log("createTweetResponse", response.data);
              //reload current page
              window.location.reload();
              setLoading(false);
            })
            .catch((err) => {
              setErrorMsg(err.response.data.errorMessage);
              setLoading(false);
            });
        })
        .catch((err) => {
          console.log("cloudinaryUploadError,", err.message);
          setErrorMsg("Network Error..Check your connection");
          setLoading(false);
        });
    }
  };
  return (
    <div className="home-feeds">
      <div className="tweetBox-container">
        <div className="tweetBox-title">
          <h3>Home</h3>
          <div className="showLoading mt-4">
            {loading && showLoading()}
            {errorMsg && showErrorMessage(errorMsg)}
          </div>
        </div>
        <div className="tweetBox">
          <div className="tweet-avatar tweet-title avatar-img">
            <img src={user.photo} alt="avatar" />
          </div>

          <form className="form" onSubmit={handleSubmit}>
            <textarea
              type="text"
              name="tweet"
              className="form-control"
              id="tweet"
              value={tweetData}
              placeholder="What's happening ?"
              onChange={handleChange}
              fullWidth={true}
            />
            <div className="input-group mb-3 input-fields">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                name="photo"
                onChange={handleImageChange}
              />
            </div>
            <label className="custom-file-label" htmlFor="customFile"></label>

            <div className="input-group mb-3 tweet-button">
              <button type="submit"> TWEET</button>
            </div>
          </form>
        </div>
      </div>
      <div className="tweet-container"></div>
    </div>
  );
};

export default Tweet;
