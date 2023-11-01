const mongoose=require("mongoose")

const expressimportDHLSchema = new mongoose.Schema({
    prices: { type: [[Number]], required: true },
  });
  
  module.exports = mongoose.model("airExpressImportDHL", expressimportDHLSchema);