const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  productId: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const CartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
