const mongoose = require("mongoose");

const airexpressimportMWLSchema = new mongoose.Schema({
  prices: { type: [[Number]], required: true },
});

module.exports = mongoose.model(
  "airexpressimportmwls",
  airexpressimportMWLSchema
);
