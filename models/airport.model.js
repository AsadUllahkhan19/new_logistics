const mongoose = require("mongoose");

const airportSchema = new mongoose.Schema({
  CODE: {
    type: String,
    required: true,
  },
  AIRPORTCITY: { type: String, required: true },
  COUNTRY: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Airport", airportSchema);
