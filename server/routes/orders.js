const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Order = require("../models/Order");

router.post("/users/:id/orders", async (req, res) => {
  console.log("🔔 checkout route hit");
  try {
    const userId = req.params.id;
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in order." });
    }

    const order = new Order({
      user: userId,
      items, // Already has full info
      totalAmount, // Calculated on client
    });

    await order.save();

    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json({ message: "Order placed successfully.", order });
  } catch (err) {
    console.error("Checkout failed:", err);
    res.status(500).json({ error: "Failed to place order." });
  }
});

module.exports = router;
