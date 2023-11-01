const mongoose = require("mongoose");

const expressexportMWLSchema = new mongoose.Schema({
  prices: { type: [[Number]], required: true },
});

module.exports = mongoose.model("airExpressExportMWL", expressexportMWLSchema);
