const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
        {
         productId: {type: String },
          quantity: { type: Number, required: true },
        },
      ],
      truckDriverId: { type: String, required: true },
      vendorId: { type: String, required: true },
      totalAmount: { type: Number },
      collectedAmount: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Oders", orderSchema);