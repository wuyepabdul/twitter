const express = require("express");
require("dotenv").config();
const connection = require("./db/connection");
const cors = require("cors");

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

connection();

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
