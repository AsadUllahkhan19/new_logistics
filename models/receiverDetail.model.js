const mongoose =require('mongoose')
const receiverSchema = new mongoose.Schema({
    receiverId:{type:mongoose.Schema.Types.ObjectId},
    rec_companyName:{type:String,required:true},
    rec_companyEmail:{type:String,required:true},
    rec_contactPersonName:{type:String,required:true},
    rec_contactPersonNumber:{type:String,required:true},
    rec_country:{type:String,required:true},
    rec_city:{type:String,required:true},
    rec_phoneNumber:{type:String,required:true},
    rec_districtArea:{type:String},
    rec_buildingName:{type:String},
    rec_nearestLandmark:{type:String}
},{collection:"receiverDetail"})

module.exports= mongoose.model("receiverDetail",receiverSchema)
