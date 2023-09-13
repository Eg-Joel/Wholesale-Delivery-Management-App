const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {type: String, required:true }, 
    price: {type: Number},
    category: {type: String},
    image: {type: String},
    vendorId: { type: String, required: true },
  },
  {timestamps: true}
);

module.exports = mongoose.model("Products", productSchema);