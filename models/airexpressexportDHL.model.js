const mongoose = require("mongoose");

const expressexportDHLSchema = new mongoose.Schema({
  prices: { type: [[Number]], required: true },
});

module.exports = mongoose.model("airExpressExportDHL", expressexportDHLSchema);
