const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String },
    contactInformation: { type: String },
    email: { type: String },
    products:{ type:Array },
  },
   
);

module.exports = mongoose.model("Vendor", vendorSchema);