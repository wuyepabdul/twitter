import React, { Fragment, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { showNoDataError } from "../../../helpers/message";
const TweetCard = () => {
  return (
    <div className="list-group">
      <div className="card list-group-item">
        <div className="card-body ">
          <i className="fa fa-trash delete-tweet" aria-hidden="true"></i>

          <div className="tweet-title">
            <img
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "80px",
              }}
              src="/image"
              alt="avatar"
            />
            <h5 className="card-text">
              <small>
                <Link to={`/profile/`}>
                  <p> Username Email</p>
                </Link>
                {/* {tweet.createdAt.substring(0, 10)} */}
              </small>
            </h5>
          </div>
          <p className="card-text">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
        </div>
        <img src="..." className="card-img-bottom" alt="" />
        <div className="like-tweet ">
          <div>
            <i className="fa fa-comment" aria-hidden="true"></i>
          </div>

          <div>
            <i className="fa fa-retweet" aria-hidden="true"></i>
          </div>
          <div>
            <FavoriteIcon className="unlike-tweet-icon" />
            <FavoriteBorderIcon className="like-tweet-icon" />9 Likes
          </div>

          <div>
            <i className="fa fa-upload" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <div className="card list-group-item">
        <div className="card-body ">
          <i className="fa fa-trash delete-tweet" aria-hidden="true"></i>

          <div className="tweet-title">
            <img
              style={{
                width: "160px",
                height: "160px",
                borderRadius: "80px",
              }}
              src="/image"
              alt="avatar"
            />
            <h5 className="card-text">
              <small>
                <Link to={`/profile/`}>
                  <p> Username Email</p>
                </Link>
                {/* {tweet.createdAt.substring(0, 10)} */}
              </small>
            </h5>
          </div>
          <p className="card-text">
            This is a wider card with supporting text below as a natural lead-in
            to additional content. This content is a little bit longer.
          </p>
        </div>
        <img src="..." className="card-img-bottom" alt="" />
        <div className="like-tweet ">
          <div>
            <i className="fa fa-comment" aria-hidden="true"></i>
          </div>

          <div>
            <i className="fa fa-retweet" aria-hidden="true"></i>
          </div>
          <div>
            <FavoriteIcon className="unlike-tweet-icon" />
            <FavoriteBorderIcon className="like-tweet-icon" />9 Likes
          </div>

          <div>
            <i className="fa fa-upload" aria-hidden="true"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
