const mongoose = require("mongoose");

const truckDriverSchema  = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true},
    mobileNumber: { type: String, required: true, unique: true },
    address: { type: String },
    drivingLicenseDetails: { type: String },
  },
   
);

module.exports = mongoose.model("TruckDriver", truckDriverSchema );