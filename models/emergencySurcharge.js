const mongoose = require("mongoose");

const emergencySurcharge = new mongoose.Schema({
  Country1: { type: String, require: true },
  Country2: { type: String, require: true },
  chargesperkg: { type: String, require: true },
});
module.exports = mongoose.model("emergencysurcharge", emergencySurcharge);
