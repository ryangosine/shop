/*────────────────────────  server.js  ────────────────────────*/
"use strict";

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const helmet = require("helmet");

const { app } = require("./handlers"); // your existing express() instance
const User = require("./models/user");
const usersRoutes = require("./routes/users"); // any non‑address routes

/*─────────────────  1. Mongo connection  ─────────────────*/
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ Mongo connection error:", err);
    process.exit(1);
  });

/*─────────────────  2. Middleware  ─────────────────*/
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json()); // replaces body‑parser

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

/*─────────────────  3. Helper  ─────────────────*/
const validCredentials = async (email, pass) => {
  const user = await User.findOne({ email });
  return user ? user.compareHashedPassword(pass) : false;
};

/*─────────────────  4. Auth routes  ─────────────────*/
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Email and password are required." });

    if (!(await validCredentials(email, password)))
      return res.status(401).json({ error: "Invalid credentials." });

    req.session.user = { email };
    const user = await User.findOne({ email });
    return res.status(200).json({
      message: "Login successful",
      firstName: user.firstName,
      _id: user._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: "Logout failed." });
    res.status(200).json({ message: "Logout successful." });
  });
});

app.put("/api/users/:id/password", async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword)
      return res.status(400).json({ error: "Password is required." });

    const hash = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: hash },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found." });
    res.status(200).json({ message: "Password successfully changed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/*─────────────────  5. Email check & registration  ─────────────────*/
app.get("/api/users/check-email", async (req, res) => {
  try {
    const exists = !!(await User.findOne({ email: req.query.email }));
    res.json({ exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check email." });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password, address } = req.body;
    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ error: "All fields are required." });

    if (await User.findOne({ email }))
      return res.status(400).json({ error: "Email is already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashed,
      addresses: address ? [{ ...address, isDefault: true }] : [],
    });

    await user.save();
    res.status(201).json({ message: "User registered." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/*─────────────────  6. Address router  ─────────────────*/
const addrRouter = express.Router({ mergeParams: true });

const postalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
const validateAddr = (a) =>
  !a.street || !a.city || !a.province || !postalRegex.test(a.postalCode)
    ? "Invalid or incomplete address."
    : null;

/* GET all */
addrRouter.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user.addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* ADD new */
addrRouter.post("/", async (req, res) => {
  try {
    const errMsg = validateAddr(req.body);
    if (errMsg) return res.status(400).json({ error: errMsg });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    if (req.body.isDefault)
      user.addresses.forEach((a) => (a.isDefault = false));
    user.addresses.push(req.body);
    await user.save();

    res
      .status(201)
      .json({ message: "Address added.", addresses: user.addresses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* EDIT */
addrRouter.put("/:aid", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const addr = user.addresses.id(req.params.aid);
    if (!addr) return res.status(404).json({ error: "Address not found." });

    const errMsg = validateAddr({ ...addr.toObject(), ...req.body });
    if (errMsg) return res.status(400).json({ error: errMsg });

    if (req.body.isDefault)
      user.addresses.forEach((a) => (a.isDefault = false));
    Object.assign(addr, req.body);
    await user.save();

    res.json({ message: "Address updated.", address: addr });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/* DELETE */
addrRouter.delete("/:aid", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found." });

    const addrIndex = user.addresses.findIndex(
      (a) => a._id.toString() === req.params.aid
    );
    if (addrIndex === -1)
      return res.status(404).json({ error: "Address not found." });

    user.addresses.splice(addrIndex, 1);
    await user.save();

    res.json({ message: "Address removed." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.use("/api/users/:id/addresses", addrRouter);

/*─────────────────  7. Other routes  ─────────────────*/
app.use("/api/users", usersRoutes); // keep anything else you already had

/*─────────────────  8. 404 fallback  ─────────────────*/
app.all("*", (_, res) => res.status(404).json({ error: "Route not found." }));

/*─────────────────  9. Start server  ─────────────────*/
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀  Server listening on ${PORT}`));
