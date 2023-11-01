const airfreightcharges=require("../models/airfreightcharge.model")
const transportCompanyAirExpress=require("../models/transportCompanyAirExpress.model")
const airline =require("../models/airline.model")


const updateAirFreightCharges=async (req,res)=>{
    try {
        const {termofshipment}=req.params;
        const updatedData=req.body;
        const result = await airfreightcharges.updateOne({termofshipment: termofshipment }, { $set: updatedData });
        const updated=await airfreightcharges.find({termofshipment: termofshipment})
        res.json({data:updated}).status(200)
    } catch (error) {
        res.json({error:error}).status(400)
    }
}
//some issue with this api as it is deleting the data that is not part of the req.body

// const updateTransportCompany=async (req,res)=>{
//     try {
//         const {name}=req.params;
//        const updatedData=req.body;
//     const result =await transportCompanyAirExpress.updateOne({name:name}, { $set: updatedData});
//         const updated=await transportCompanyAirExpress.find({name:name})
//         res.json({data:updated}).status(200)
//     } catch (error) {
//         res.json({error:error}).status(400)
//     }
// }
const updateAirlineExpress=async(req,res)=>{
try {
    const {companyname}=req.params;
    const updatedData=req.body;
    const result =await airline.updateOne({companyname:companyname},{$set:updatedData});
    const updated=await airline.find({companyname:companyname})
    res.json({data:updated}).status(400)

} catch (error) {
    res.json({error:error})
}
}
module.exports={
    updateAirFreightCharges,
   // updateTransportCompany,
    updateAirlineExpress
}