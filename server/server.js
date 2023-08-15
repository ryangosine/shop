"use strict";

const { app } = require("./handlers"); // Import 'app' from handlers.js
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

mongoose.connect(
  "mongodb+srv://ryanganeshgosine:TWiE1Jo7AohV006X@cluster0.zvnb2sn.mongodb.net/Shop",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const User = require("./models/user");

app.use(cors());
app.use(bodyParser.json());

// ENDPOINTS
// ---------------------------------
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
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
