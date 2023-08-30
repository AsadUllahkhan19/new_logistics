const mongoose =require('mongoose')
const shipperSchema = new mongoose.Schema({
    shipperId:{type:mongoose.Schema.Types.ObjectId},
    sen_companyName:{type:String,required:true},
    sen_companyEmail:{type:String,required:true},
    sen_contactPersonName:{type:String,required:true},
    sen_contactPersonNumber:{type:String,required:true},
    sen_country:{type:String,required:true},
    sen_city:{type:String,required:true},
    sen_phoneNumber:{type:String,required:true},
    sen_districtArea:{type:String},
    sen_buildingName:{type:String},
    sen_nearestLandmark:{type:String}
},{collection:"shipperDetail"})

module.exports= mongoose.model("shipperDetail",shipperSchema)
