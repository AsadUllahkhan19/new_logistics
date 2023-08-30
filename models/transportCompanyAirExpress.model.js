const mongoose=require("mongoose")
const transportCompanySchema=new mongoose.Schema(
    {
        name:{type:String, required:true},
        internationalCharges:{
            oversize:{type:Number},
            overweight:{type:Number},
            stackable:{type:Number},
            fuelsurcharge:{type:Number},
            emergency:{type:Number},
            remoteAreaPickup:{type:Number},
            remoteAreaDelivery:{type:Number}
        },
     
        
    }    
)
module.exports=mongoose.model('transportCompanyAirExpress',transportCompanySchema)
