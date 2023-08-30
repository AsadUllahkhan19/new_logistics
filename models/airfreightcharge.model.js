const mongoose=require("mongoose")

const airfreightchargeSchema=new mongoose.Schema(
    {
        termofshipment:{type:Number, required:true},
       
        
                    airway:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },

                   airporthandling:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
                
                   deliveryorder:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
                    airlinetransfer:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
                
                 airporsystemfee:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
                
                   customsclearance:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
                
                   transportation:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
            
                    pickupcharges:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}

                },
                
                    exportdeclaration:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
                
                    exportdocumentation:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
                
                    xrayscreening:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
                   miscellaneous:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },
                macservice:{
                    rateperkg:{type:Number},
                    minimum:{type:Number},
                    flag:{type:Boolean}
                },                  
            }       
)
module.exports=mongoose.model("Airfreightcharges", airfreightchargeSchema)

