const mongoose= require("mongoose")
const airlineSchema=new mongoose.Schema(
    {
        key:{type:Number, required:true},
        companyname:{type:String,required:true},
        serviceName:[
            String
        ],
        minCharge:{type:Number,required:true},
        rateperkg:[
            Number
        ]
    }
    

    
)
module.exports = mongoose.model("Airline", airlineSchema);
