const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

router.put("/:_id/password", async (req, res) => {
  const { _id } = req.params;
  console.log("received userId in the backend:", _id);
  const { newPassword } = req.body;

  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(
      _id,
      { password: hashedNewPassword },
      { new: true }
    );
    console.log("Password Changed Successfully");
    res.status(200).json({ message: "Password Successfully Changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    const existingUser = await User.findOne({ email });
    res.json({ exists: !!existingUser });
  } catch (err) {
    console.error("Error checking email:", err);
    res.status(500).json({ error: "Failed to check email" });
  }
});

router.get("/:userId/orders", async (req, res) => {
  const { userId } = req.params;

  try {
    const userOrders = await Order.find({ userId });
    res.status(200).json(userOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
