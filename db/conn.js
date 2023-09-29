const mongoose = require("mongoose");
require('dotenv').config();
const db = process.env.MONGO_URI


// mongoose.Promise = global.Promise

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

module.exports = mongoose;
