const Trade = require("../models/trade.model");
const country = require("../models/country.model");
const ShipperDetail = require("../models/shipperDetail.model");
const ReceiverDetail = require("../models/receiverDetail.model");
const AirExpressTransportServices =require('../models/transportCompanyAirExpress.model')
const Price = require("../models/pricing.model")
const Airport = require("../models/airport.model")
const Airline = require("../models/airline.model")
const AirFreightCharges=require("../models/airfreightcharge.model")

const airExpressImportDHL=require("../models/airexpressimportDHL.model")
const airExpressExportDHL=require("../models/airexpressexportDHL.model")
const airExpressImportMWL =require("../models/airexpressimportMWL.model")
const mongoose = require("mongoose");
const { ObjectId } = require('mongoose').Types;

const tradeStepOne = async (req, res) => {
  try {
    const { tradeType, serviceType, serviceTypeOpt } = req.body;
    const trade = new Trade({ tradeType, serviceType, serviceTypeOpt });
    const savedData = await trade.save();
    res
      .status(200)
      .json({ message: "Step 1 done successfully", tradeId: savedData?._id });
  } catch (err) {
    res.status(500).json({ error: "An error occurred during step 1" });
  }
};
const tradeStepTwo = async (req, res) => {
    try {
        const { tradeId, shipperData } = req.body;
    
        const shipper = new ShipperDetail(shipperData);
    
        const savedShipper = await shipper.save();
    
        await Trade.findByIdAndUpdate(tradeId, { shipperId: savedShipper._id });
    
        res.status(200).json({ message: "Step 2 done successfully" });
      } catch (error) {
        res.status(500).json({ error: "An error occurred" });
      }
  };
  
  const tradeStepThree =async(req,res)=>{
    try{
        const {tradeId,receiverData}=req.body;
        const receiver = new ReceiverDetail(receiverData);
        const savedReceiver = await receiver.save();
        await Trade.findByIdAndUpdate(tradeId,{receiverId:savedReceiver._id});
        res.status(200).json({ message: "Step 3 done successfully" });
    }
    catch(err){
        res.status(500).json({ error: "An error occurred" });
    }
  }

  
const tradeStepFour =async(req,res)=>{

  try{
    const {tradeId,natureofpackage,noofpackages,totalWeight,totalCbm,totalVolumetricWeight,tradeItem,chargeableWeight,locationPrice,paymentTypeFreight}=req.body;
    const price = new Price({locationPrice})
    const savedData = await price.save();
    await Trade.findByIdAndUpdate(tradeId,{priceId:savedData._id,natureofpackage:natureofpackage,noofpackages:noofpackages,totalWeight:totalWeight,totalCbm:totalCbm,totalVolumetricWeight:totalVolumetricWeight,tradeItem:tradeItem,chargeableWeight:chargeableWeight,paymentTypeFreight:paymentTypeFreight})
    
   console.log(savedData?._id)
    res
    .status(200) 
    .json({ message: "Step 4 done successfully", priceId: savedData?._id });
  }
  catch(error){
    res.status(500).json({ error: "An error occurred during step 4" });

  }
}


const getAirExpressServiceData = async (req, res) => {
  try {
    const services = await AirExpressTransportServices.find().lean();
    res.status(200).json({
      airexpressService: services
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getAllCountryName = async (req, res) => {
  try {
    const data = await country.find().lean();

    if (data.length===0) {
      return res.status(404).json({ error: "No data found in the database" });
    }

    res.status(200).json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const tradeCount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const options = { session, new: true };
    const { countryName, zoneId } = req.body;
    const count = new Country({ countryName, zoneId });
    const savedData = await count.save();
    await session.commitTransaction();
    res.status(200).json({ message: "Step 1 done successfully" });
  } catch (err) {
    res.status(500).json({ error: "An error occurred during step 1" });
    await session.abortTransaction();
  } finally {
    session.endSession();
  }
};



// const getRate = async (req, res) => {
//   try {
//     const { weight, country, transportCompany } = req.query;
//     const tradeType = parseInt(req.params.tradeType);
// console.log(tradeType)
// console.log(transportCompany,weight)

//     let data;

//     if (tradeType === 1 && transportCompany==1) {
//       data = await airExpressImportDHL.findOne({ weight: weight }).lean();
//     } else if (tradeType === 2 && transportCompany==2) {
//       data = await airExpressExportDHL.findOne({ weight: weight }).lean();
//     } else {
//       return res.status(400).json({ error: "Invalid tradeType or transport company" });
//     }

//     if (!data) {
//       return res.status(404).json({ error: "Data not found" });
//     }

//     const filtered = data.value.filter((x) => x.countryName === country);
//     res.send(filtered);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "An error occurred while fetching data" });
//   }
// };
const getRate = async (req, res) => {
  try {
    const { weight, country} = req.query;
    const tradeType = parseInt(req.params.tradeType);

    console.log(tradeType);
    console.log( weight);

    let data;

    if (tradeType === 1 ) {
      const importDHLData = await airExpressImportDHL.findOne({ weight: weight }).lean();
      const importMWLData = await airExpressImportMWL.findOne({ weight: weight }).lean();

// console.log("importMWLData",importMWLData)
      data = mergeData(importDHLData, importMWLData);
    } else if (tradeType === 2 ) {
 
      data = await airExpressExportDHL.findOne({ weight: weight }).lean();
    } else {
      return res.status(400).json({ error: "Invalid tradeType or transport company" });
    }

    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    }

    const filtered = data.value.filter((x) => x.countryName === country);
    res.send(filtered);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const mergeData = (...datasets) => {

  const mergedData = { value: [] };

  datasets.forEach((dataset) => {
    if (dataset && dataset.value) {
      mergedData.value.push(...dataset.value);
    }
  });

  return mergedData;
};

//get all airports, if a country is given then get all airports of that country

const getAllAirport=async (req,res)=>{
  try {
    const {country}=req.body;
    const data = await Airport.find().lean();

    if (!country) {
      const airports=data.map(airport=>airport.airportcity)
      res.send(airports).status(200)
    }
    else{(country)
    const countryAirports=data.filter(airport=>airport.country===country).map(airport=>airport.airportcity)
    res.send(countryAirports).status(200)
    }
} catch(err){
  res.status(500).json({ error: "An error occurred while fetching data" });
  console.log(err)
}
}
const getAirline=async (req,res)=>{
  try {
    const data = await Airline.find().lean();

    if (data.length===0) {
      return res.status(404).json({ error: "No data found in the database" });
    }

    res.status(200).json({
      message: "Data fetched successfully",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
}

const getFreightCharges=async(req,res)=>{
  try{
   const{ termofshipment,chargeableweight}=req.params;
   const data = await AirFreightCharges.findOne({termofshipment:termofshipment}).lean();   
   console.log('check', data)
   const result = (({ _id, termofshipment, ...rest }) => rest)(data);
   //console.log(result)
 let totalprice=0
 
 for (const key in result) {
     const rate = result[key].rateperkg;
     const minimum = result[key].minimum;
 
     const price = Math.max(chargeableweight * rate, minimum);
     totalprice=totalprice+price}
 
 res.status(200).json({"price":totalprice,"data":data})
 
 }
 catch(err){
console.log(err)
 }
}









module.exports = {
  tradeStepOne,
  tradeStepTwo,
  tradeStepThree,
  tradeStepFour,
  getAllCountryName,
  tradeCount,
  getAirExpressServiceData,
  getRate,
  getAllAirport,
  getAirline,
  getFreightCharges

};
