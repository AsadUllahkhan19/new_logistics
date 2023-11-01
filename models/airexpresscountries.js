const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  val: String,
  data: [String],
});
const expressCountriesSchema = new mongoose.Schema({
  countries: dataSchema,
});

module.exports = mongoose.model("airexpresscountry", expressCountriesSchema);
