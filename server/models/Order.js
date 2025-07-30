const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: String },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: Number,
  },
  { timestamps: true } // adds createdAt, updatedAt
);

module.exports = mongoose.model("Order", OrderSchema);
