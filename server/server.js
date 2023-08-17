"use strict";

const { app } = require("./handlers"); // Import 'app' from handlers.js
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./models/user"); // Import the User model

mongoose.connect(
  "mongodb+srv://ryanganeshgosine:TWiE1Jo7AohV006X@cluster0.zvnb2sn.mongodb.net/Shop",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use(
  session({
    secret: "4187798012",
    resave: false,
    saveUninitialized: true,
  })
);

const validCredentials = async (email, password) => {
  try {
    const user = await User.findOne({ email: email });
    console.log("user", user);
    if (user) {
      console.log("user password:", user.password);
      console.log("hashed password:", password);
      const passwordMatch = await user.comparePassword(password);
      console.log("passwordMatch", passwordMatch);
      return passwordMatch;
    } else {
      console.log("User not found for email:", email);
      return false;
    }
  } catch (error) {
    console.error("Error in validCredentials:", error);
    return false;
  }
};

// ENDPOINTS
// ---------------------------------

// Login

app.post("/login", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    if (await validCredentials(email, password)) {
      req.session.user = { email };
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in /login:", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Registration

app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password: await bcrypt.hash(password, 10) });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error); // Log the error to the console
    res.status(500).json({ error: error.message });
  }
});

// Catch-all endpoint
app.get("*", (req, res) => {
  res.status(404).json({
    status: 404,
    message: "This is obviously not what you are looking for.",
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
// const express = require("express");
// const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");

// mongoose.connect(
//   "mongodb+srv://ryanganeshgosine:TWiE1Jo7AohV006X@cluster0.zvnb2sn.mongodb.net/Shop",
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   }
// );

// app.use(json());

// const app = express();
// Below are methods that are included in express(). We chain them for convenience.
// --------------------------------------------------------------------------------

// This will give us will log more info to the console. see https://www.npmjs.com/package/morgan
// app
//   .use(morgan("tiny"))
//   .use(express.json())
//   .use(bodyParser.json())

//   .use(express.static("public"));
// Any requests for static files will go into the public folder
