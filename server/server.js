const express = require("express");
require("dotenv").config();
const connection = require("./db/connection");
const cors = require("cors");
const path = require("path");

connection();

const app = express();

//===============================================MIDDLEWARES=========================================================================

const tweetRoute = require("./routes/tweetRoute");
const userRoute = require("./routes/userRoute");
const uploadRoutes = require("./routes/uploadRoute");

app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/tweet", tweetRoute);
app.use("/api/upload", uploadRoutes);

// const __dirname = path.resolve();
app.use("/uploads", express.static("uploads"));

//heroku build
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running ...");
  });
}
//===============================================SERVER CONFIG=========================================================================

app.listen(process.env.PORT || 5000, (err) => {
  try {
    if (!err) {
      console.log(`Server started at port ${process.env.PORT}`);
    }
  } catch (error) {
    console.log(`Error encountered while starting server`, error);
  }
});
