const mongoose = require("mongoose");
require("dotenv").config();
const connection = () => {
  mongoose.connect(
    process.env.MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (err) => {
      try {
        if (!err) {
          console.log("Connection to Mongodb Established");
        }
      } catch (error) {
        console.log("error connecting to mongodb", error);
      }
    }
  );
};

module.exports = connection;
