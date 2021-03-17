import axios from "axios";
import { getCookie } from "../helpers/cookies";

/* file upload */
export const uploadFile = async (file) => {
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const response = await axios.post("api/tweet/createTweet", file, config);
  return response;
};

/* create a tweet */
export const createTweet = async (tweetData) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const response = await axios.post("api/tweet/createTweet", tweetData, config);
  return response;
};

/* delete a tweet */
export const deleteTweet = async (tweetId) => {
  const config = {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };

  const response = await axios.delete(`api/tweet/delete/${tweetId}`, config);
  return response;
};

/* get all tweets */
export const getAllTweets = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const response = await axios.get("/api/tweet/allTweets", config);
  return response;
};

// get my tweets
export const getMyTweets = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const response = await axios.get("/api/tweet/myTweets", config);
  return response;
};

/* get subscribed tweets */
export const getSubscribedTweets = async () => {
  const config = {
    headers: {
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };

  const response = await axios.get("/api/tweet/subscribedTweets", config);
  return response;
};

/* comment on a tweet */
export const addComment = async (tweetId, text) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const body = JSON.stringify({ tweetId, text });

  const response = await axios.put("/api/tweet/comment", body, config);
  console.log("commetRes ", response);
  return response;
};

/* like a tweet */
export const likeTweet = async (id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const body = JSON.stringify({ tweetId: id });
  const response = await axios.put("/api/tweet/like", body, config);
  return response;
};

/* unlike a tweet */

export const unlikeTweet = async (id) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const body = JSON.stringify({ tweetId: id });
  const response = await axios.put("/api/tweet/unlike", body, config);
  return response;
};
