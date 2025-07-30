const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

router.post("/", async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existing = cart.items.find(
      (i) => i.productId.toString() === productId
    );
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    console.error("Cart update failed:", err);
    res.status(500).json({ error: "Failed to update cart." });
  }
});

module.exports = router;
