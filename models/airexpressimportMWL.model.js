const mongoose = require("mongoose");

const airexpressimportMWLSchema = new mongoose.Schema({
  weight: { type: Number, required: true },
  value: [{ countryName: String, price: Number }],
});

module.exports = mongoose.model(
  "airexpressimportmwls",
  airexpressimportMWLSchema
);
