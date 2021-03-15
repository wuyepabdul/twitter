import axios from "axios";
import { getCookie } from "../helpers/cookies";

const uploadHandler = async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("photo", file);

  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getCookie("token")}`,
      },
    };

    const data = await axios.post("/api/upload", formData, config);
    return data;
  } catch (error) {
    console.log("uploadHandler error", error.message);
  }
};

export default uploadHandler;
