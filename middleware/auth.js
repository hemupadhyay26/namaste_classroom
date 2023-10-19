const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

require("dotenv").config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  // console.log(authorization);
  if (!authorization) {
    return res.status(401).send({ error: "token not assigned to you " });
  }

  const data = authorization.replace("Bearer ", "");
  const token = data.replace(/"/g, '');
  // console.log(token);

  jwt.verify(token, process.env.JWT_SECRET,(error, payload) => {
    if (error) {
      return res.status(401).send({ error: "You not have an valid token id" });
    }
    const { _id } = payload;
    User.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
//   next();
};
