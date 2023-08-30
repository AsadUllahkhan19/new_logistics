const mongoose=require("mongoose")
const airportSchema=new mongoose.Schema({
code:{
    type:String, required:true
},
airportcity:{type:String, required:true},
country:{
    type:String, required:true
}
})
module.exports=mongoose.model("Airport", airportSchema)