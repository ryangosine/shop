const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.put("/:_id/password", async (req, res) => {
  const { _id } = req.params;
  console.log("received userId in the backend:", _id);
  const { newPassword } = req.body;

  try {
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
