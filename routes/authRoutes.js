const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const moment = require("moment");
const momentTimezone = require("moment-timezone");

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

  res.status(200).send({
    firstName: current_user.firstName,
    lastName: current_user.lastName,
    email: current_user.email,
    gender: current_user.gender,
    age: current_user.age,
    address: current_user.address,
    phoneNo: current_user.phoneNo,
    profile: current_user.profile,
  });
});
router.post("/profile", requireToken, async (req, res) => {
  try {
    const current_user = req.user;
    console.log(req.body);

    const userData = await User.findByIdAndUpdate(
      { _id: current_user._id },
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          age: req.body.age,
          address: req.body.address,
          gender: req.body.gender,
          phoneNo: req.body.phoneNo,
          profile: req.body.profile,
        },
      }
    );
    res.send("Profile Updated");
  } catch (error) {
    res.send("error message" + error.message);
  }
  // current_user.firstName = firstName;
  // current_user.lastName = lastName;
  // current_user.email = email;
  // current_user.gender = gender;
  // current_user.phoneNo = phoneNo;
  // current_user.age = age;
  // current_user.address = address;
  // res.send("done modification");
});

// profile photo request

const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const Room = require("../models/Room");

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,
});

const BUCKET = process.env.BUCKET;
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: BUCKET,
    key: function (req, file, cb) {
      // console.log(file);
      cb(null, file.originalname);
    },
  }),
});

router.post(
  "/upload",
  upload.single("profile"),
  async function (req, res, next) {
    // res.json(req.file.location);
    const filename = req.file.originalname;
    console.log(filename);
    let params = { Bucket: BUCKET, Key: filename };
    s3.getSignedUrl("getObject", params, async function (err, url) {
      if (err) {
        console.log(err);
      }
      res.send({
        url: url,
        filename: filename,
      });
      // const current_user = req.user;
      // console.log(req.body);

      // const userData = await User.findByIdAndUpdate(
      //   { _id: current_user._id },
      //   {
      //     $set: {
      //       profile: filename
      //     },
      //   }
      // );
      // res.send("Profile Updated");
    });
  }
);

router.get("/list", async (req, res) => {
  let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
  let x = r.Contents.map((item) => item.Key);
  res.send(x);
});

// extract URL
router.get("/url/:filename", async (req, res) => {
  const filename = req.params.filename;
  let params = { Bucket: BUCKET, Key: filename };
  s3.getSignedUrl("getObject", params, function (err, url) {
    if (err) {
      console.log(err);
    }
    res.send(url);
  });
});

router.get("/download/:filename", async (req, res) => {
  const filename = req.params.filename;
  let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
  res.send(x.Body);
});

router.delete("/delete/:filename", async (req, res) => {
  const filename = req.params.filename;
  await s3.deleteObject({ Bucket: BUCKET, Key: filename }).promise();
  res.send("File Deleted Successfully");
});

// room routers

router.get("/rooms", (req, res) => {
  Room.find()
    .then((rooms) => {
      res.json(rooms);
    })
    .catch((error) => {
      res.json({ error });
    });
});

// Function to convert UTC JS Date object to a Moment.js object in AEST
const dateAEST = (date) => {
  return momentTimezone(date).tz("Asia/Kolkata");
};

// Function to calculate the duration of the hours between the start and end of the booking
const durationHours = (bookingStart, bookingEnd) => {
  // convert the UTC Date objects to Moment.js objeccts
  let startDateLocal = dateAEST(bookingStart);
  let endDateLocal = dateAEST(bookingEnd);

  // calculate the duration of the difference between the two times
  let difference = moment.duration(endDateLocal.diff(startDateLocal));

  // return the difference in decimal format
  return difference.hours() * 60 + difference.minutes();
};

// Make a booking
router.put("/rooms/:id", requireToken, (req, res) => {
  const { id } = req.params;
  // const current_user = req.user;
  console.log(req.boby);
  // If the recurring array is empty, the booking is not recurring
  if (req.body.recurring.length === 0) {
    Room.findByIdAndUpdate(
      id,
      {
        $addToSet: {
          bookings: {
            user: req.user,
            // The hour on which the booking starts, calculated from 12:00AM as time = 0
            startHour: dateAEST(req.body.bookingStart).format("H.mm"),
            // The duration of the booking in decimal format
            duration: durationHours(req.body.bookingStart, req.body.bookingEnd),
            // Spread operator for remaining attributes
            roomId: id,
            ...req.body,
          },
        },
      },
      { new: true, runValidators: true, context: "query" }
    )
      .then((room) => {
        res.status(201).json(room);
      })
      .catch((error) => {
        res.status(400).json({ error });
      });

    // If the booking is a recurring booking
  } else {
    // The first booking in the recurring booking range
    let firstBooking = req.body;
    firstBooking.user = req.user;
    firstBooking.startHour = dateAEST(req.body.bookingStart).format("H.mm");
    firstBooking.duration = durationHours(
      req.body.bookingStart,
      req.body.bookingEnd
    );

    // An array containing the first booking, to which all additional bookings in the recurring range will be added
    let recurringBookings = [firstBooking];

    // A Moment.js object to track each date in the recurring range, initialised with the first date
    let bookingDateTracker = momentTimezone(firstBooking.bookingStart).tz(
      "Asia/Kolkata"
    );

    // A Moment.js date object for the final booking date in the recurring booking range - set to one hour ahead of the first booking - to calculate the number of days/weeks/months between the first and last bookings when rounded down
    let lastBookingDate = momentTimezone(firstBooking.recurring[0]).tz(
      "Asia/Kolkata"
    );
    lastBookingDate.hour(bookingDateTracker.hour() + 1);

    // The number of subsequent bookings in the recurring booking date range
    let bookingsInRange =
      req.body.recurring[1] === "daily"
        ? Math.floor(lastBookingDate.diff(bookingDateTracker, "days", true))
        : req.body.recurring[1] === "weekly"
        ? Math.floor(lastBookingDate.diff(bookingDateTracker, "weeks", true))
        : Math.floor(lastBookingDate.diff(bookingDateTracker, "months", true));

    // Set the units which will be added to the bookingDateTracker - days, weeks or months
    let units =
      req.body.recurring[1] === "daily"
        ? "d"
        : req.body.recurring[1] === "weekly"
        ? "w"
        : "M";

    // Each loop will represent a potential booking in this range
    for (let i = 0; i < bookingsInRange; i++) {
      // Add one unit to the booking tracker to get the date of the potential booking
      let proposedBookingDateStart = bookingDateTracker.add(1, units);

      // Check whether this day is a Sunday (no bookings on Sundays)
      if (proposedBookingDateStart.day() !== 0) {
        // Create a new booking object based on the first booking
        let newBooking = Object.assign({}, firstBooking);

        // Calculate the end date/time of the new booking by adding the number of units to the first booking's end date/time
        let firstBookingEndDate = momentTimezone(firstBooking.bookingEnd).tz(
          "Asia/Kolkata"
        );
        let proposedBookingDateEnd = firstBookingEndDate.add(i + 1, units);

        // Update the new booking object's start and end dates
        newBooking.bookingStart = proposedBookingDateStart.toDate();
        newBooking.bookingEnd = proposedBookingDateEnd.toDate();

        // Add the new booking to the recurring booking array
        recurringBookings.push(newBooking);
      }
    }

    // Find the relevant room and save the bookings
    Room.findByIdAndUpdate(
      id,
      {
        $push: {
          bookings: {
            $each: recurringBookings,
          },
        },
      },
      { new: true, runValidators: true, context: "query" }
    )
      .then((room) => {
        res.status(201).json(room);
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
});

// Delete a booking
router.delete("/rooms/:id/:bookingId", (req, res) => {
  const { id } = req.params;
  const { bookingId } = req.params;
  Room.findByIdAndUpdate(
    id,
    { $pull: { bookings: { _id: bookingId } } },
    { new: true }
  )
    .then((room) => {
      res.status(201).json(room);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
});

// Load user bookings

router.get("/mybookings", requireToken, async (req, res) => {
  // const current_user = ;
  const userId = req.user._id;
  console.log(userId);
  try {
    const bookings = await Room.find({
      "bookings.user": userId,
    }).populate("bookings.user");
    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user." });
    }

    res.status(201).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user bookings." });
  }
});

module.exports = router;
