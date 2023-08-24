"use strict";

const { app } = require("./handlers"); // Import 'app' from handlers.js
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const usersRoutes = require("./routes/users");

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

app.use("/api/users", usersRoutes);

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
      const user = await User.findOne({ email });
      res
        .status(200)
        .json({ message: "Login successful", firstName: user.firstName });
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
    console.log("requestbody", req.body);
    const { firstName, email, password } = req.body;
    const user = new User({
      firstName,
      email,
      password: await bcrypt.hash(password, 10),
    });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error); // Log the error to the console
    res.status(500).json({ error: error.message });
  }
});

// logout

app.post("/logout", (req, res) => {
  console.log("Logout Request Received");
  try {
    req.session.destroy();
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.error("Error during Logout", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// update password

app.put("/api/users/:userId/password", async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { password: newPassword },
      { new: true }
    );
    console.log("Password Changed Successfully");
    res.status(200).json({ message: "Password Successfully Changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
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
