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
    if (user) {
      const passwordMatch = await user.compareHashedPassword(password);
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
      res.status(200).json({
        message: "Login successful",
        firstName: user.firstName,
        _id: user._id,
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error in /login:", error); // Log the error
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//check to see if email is taken

app.get("/api/users/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    const existingUser = await User.findOne({ email });
    res.json({ exists: !!existingUser });
  } catch (err) {
    console.error("Check email error:", err);
    res.status(500).json({ error: "Failed to check email" });
  }
});

// Registration

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Ensure all required fields are present
    if (!firstName || !lastName || !email || !password) {
      console.log("Missing fields in registration");
      return res.status(400).json({ error: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    console.log("Existing user found for email", email, ":", existingUser);
    if (existingUser) {
      console.log(
        `Email ${email} is already registered. Sending error response.`
      );
      return res.status(400).json({ error: "Email is already Registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("New user saved to DB:", newUser);
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000 && error.keyValue.email) {
      return res.status(400).json({ error: "Email is already registered." });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

// app.post("/register", async (req, res) => {
//   try {
//     console.log("requestbody", req.body);
//     const { firstName, lastName, email, password, passwordConfirm } = req.body;

//     if (!firstName || !lastName || !email || !password || !passwordConfirm) {
//       return res.status(400).json({ error: "All Fields Are Required" });
//     }
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ error: "User Already Exists" });
//     }
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).+8,$/;
//     if (!passwordRegex.test(password)) {
//       return res.status(400).json({
//         error:
//           "Password must include at least one lowercase letter, one uppercase letter, and one special character and be at least 8 characters long.",
//       });
//     }

//     if (password !== passwordConfirm) {
//       return res.status(400).json({ error: "Passwords do not match." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//     });
//     await user.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

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

app.put("/api/users/:_id/password", async (req, res) => {
  const { _id } = req.params;
  const { newPassword } = req.body;

  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(
      _id,
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
