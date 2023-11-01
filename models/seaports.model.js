const mongoose = require("mongoose");

const seaportSchema = new mongoose.Schema({
  // code: {
  //   type: String,
  //   required: true,
  //   unique: true, // Ensure codes are unique
  // },
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  alias: [String], // An array of alias strings
  regions: [String], // An array of region strings

  coordinates: {
    type: [Number],
    required: true,
  },
  province: String,
  timezone: String,
  unlocs: [String], // An array of UNLOC codes
});

module.exports = mongoose.model("Seaport", seaportSchema);
