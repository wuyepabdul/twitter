import axios from "axios";
import { getCookie } from "../helpers/cookies";

/* signup a user */
export const signup = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const response = await axios.post("/api/user/signup", data, config);
  return response;
};

/* signin a user */
export const signin = async (data) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      //   Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const response = await axios.post("/api/user/signin", data, config);
  return response;
};

/* get user data */
export const getUserData = async () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const response = await axios.get("/api/user", config);
  return response;
};

/* get user profile */

export const getUserProfile = async (userId) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    };
    const response = await axios.get(`/api/user/profile/${userId}`, config);
    return response;
  } catch (error) {
    console.log("getUserProfile error", error.message);
  }
};

/* follow a user  */
export const followUser = async (followId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };

  const body = JSON.stringify({ followId });

  const response = await axios.put("/api/user/follow", body, config);
  return response;
};

/* unfollow a user */

export const unfollowUser = async (unfollowId) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const body = JSON.stringify({ unfollowId });

  const response = await axios.put("/api/user/unfollow", body, config);
  return response;
};

/* update profile photo */
export const updateProfilePhoto = async (photo) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getCookie("token")}`,
    },
  };
  const body = JSON.stringify({ photo: photo });

  const response = await axios.put("/api/user/updatePhoto", body, config);
  return response;
};
