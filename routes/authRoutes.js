const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

require("dotenv").config();
const requireToken = require("../middleware/auth");

// nodemailer
async function mailer(recieveremail, code) {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,

    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: `${process.env.EMAIL}`, // generated ethereal user
      pass: `${process.env.PASSWORD}`, // generated ethereal password
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: `${process.env.EMAIL}`, // sender address
    to: `${recieveremail}`, // list of receivers
    subject: "Signup Verification", // Subject line
    text: `Your Verification Code is ${code}`, // plain text body
    html: `<b>Your Verification Code is ${code}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);

  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

router.post("/verify", (req, res) => {
  // console.log('sent by client - ', req.body);
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  User.findOne({ email: email }).then(async (savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }
    try {
      let VerificationCode = Math.floor(100000 + Math.random() * 900000);
      let user = [
        {
          firstName,
          lastName,
          email,
          password,
          VerificationCode,
        },
      ];
      await mailer(email, VerificationCode);
      res.send({
        message: "Verification Code Sent to your Email",
        udata: user,
      });
    } catch (err) {
      console.log(err);
    }
  });
});

router.post("/signup", (req, res) => {
  //   res.send('Welcome');
  // console.log(req.body);
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName || !email || !password) {
    return res.status(422).send({ error: "Enter all the required fields" });
  }
  User.findOne({ email: email }).then(async (saveUser) => {
    if (saveUser) {
      return res.status(422).send({ error: "Invalid Credentials" });
    }
    const user = new User({
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    try {
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      res.send({ token });
    } catch (error) {
      console.log("Error 31 authRouters");
      return res.status(422).send({ error: error.message });
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).send({ error: "Enter all the required fields" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).send({ error: "Invalid Credentials" });
    }

    try {
      bcrypt.compare(password, savedUser.password, (err, payload) => {
        if (payload) {
          const token = jwt.sign(
            { _id: savedUser._id },
            process.env.JWT_SECRET
          );
          res.send({ token });
        } else {
          res.status(422).send({ error: "Invalid Credentials" });
        }
      });
    } catch (error) {
      console.log("Error 62 authRouters");
      return res.status(422).send({ error: error.message });
    }
  });
});

router.get("/profile", requireToken, (req, res) => {
  const current_user = req.user;

  res
    .status(200)
    .send({
      firstName: current_user.firstName,
      lastName: current_user.lastName,
      email: current_user.email,
    });
});

module.exports = router;
