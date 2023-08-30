const mongoose=require("mongoose")

const expressimportDHLSchema = new mongoose.Schema({
    weight:{type:Number,required:true},
    value:[
        {countryName:String,
        price:Number,
    }
    ]
  });
  
  module.exports = mongoose.model("airExpressImportDHL", expressimportDHLSchema);