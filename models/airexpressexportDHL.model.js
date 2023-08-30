const mongoose=require("mongoose")

const expressexportDHLSchema = new mongoose.Schema({
    weight:{type:Number,required:true},
    value:[
        {countryName:String,
        price:Number}
    ]
  });
  
  module.exports = mongoose.model("airExpressExportDHL", expressexportDHLSchema);