const Trade = require("../models/trade.model");
const country = require("../models/country.model");
const ShipperDetail = require("../models/shipperDetail.model");
const ReceiverDetail = require("../models/receiverDetail.model");
const AirExpressTransportServices = require("../models/transportCompanyAirExpress.model");
const Price = require("../models/pricing.model");
const Airport = require("../models/airport.model");
const Airline = require("../models/airline.model");
const AirFreightCharges = require("../models/airfreightcharge.model");
const Seaport = require("../models/seaports.model");
const databases = require("../ports.json");

const airExpressImportDHL = require("../models/airexpressimportDHL.model");
const airExpressExportDHL = require("../models/airexpressexportDHL.model");
const airExpressImportMWL = require("../models/airexpressimportMWL.model");
const mongoose = require("mongoose");
const airexpresscountries = require("../models/airexpresscountries");
const { ObjectId } = require("mongoose").Types;
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

const tradeStepOne = async (req, res) => {
  try {
    const { tradeType, serviceType, serviceTypeOpt } = req.body;
    const trade = new Trade({
      tradeType,
      serviceType,
      serviceTypeOpt: serviceTypeOpt,
      // countryName: "Pakistan",
    });
    console.log(trade);
    const savedData = await trade.save();
    res
      .status(200)
      .json({ message: "Step 1 done successfully", tradeId: savedData?._id });
  } catch (err) {
    console.log("error", err.message);
    res.status(500).json({ error: "An error occurred during step 1" });
  }
};
const tradeStepTwo = async (req, res) => {
  try {
    const { tradeId, shipperData } = req.body;
    const shipper = new ShipperDetail(shipperData);

    const savedShipper = await shipper.save();
    //console.log(savedShipper)
    await Trade.findByIdAndUpdate(tradeId, { shipperId: savedShipper._id });

    res.status(200).json({ message: "Step 2 done successfully" });
  } catch (error) {
    console.log("first error", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const tradeStepThree = async (req, res) => {
  try {
    const { tradeId, receiverData } = req.body;
    const receiver = new ReceiverDetail(receiverData);
    const savedReceiver = await receiver.save();
    await Trade.findByIdAndUpdate(tradeId, { receiverId: savedReceiver._id });
    res.status(200).json({ message: "Step 3 done successfully" });
  } catch (err) {
    console.log("last error", err);
    res.status(500).json({ error: "An error occurred" });
  }
};

const tradeStepFour = async (req, res) => {
  try {
    const {
      tradeId,
      natureofpackage,
      noofpackages,
      totalWeight,
      totalCbm,
      totalVolumetricWeight,
      tradeItem,
      chargeableWeight,
      status,
    } = req.body;
    console.log(req.body);
    // const savedData = await Trade.findByIdAndUpdate(tradeId, { status: status, natureofpackage: natureofpackage, noofpackages: noofpackages, totalWeight: totalWeight, totalCbm: totalCbm, totalVolumetricWeight: totalVolumetricWeight, tradeItem: tradeItem, chargeableWeight: chargeableWeight })

    const savedData = await Trade.findByIdAndUpdate(tradeId, {
      status: status,
      natureofpackage: natureofpackage,
      noofpackages: noofpackages,
      totalWeight: totalWeight,
      totalCbm: totalCbm,
      totalVolumetricWeight: totalVolumetricWeight,
      tradeItem: tradeItem,
      chargeableWeight: chargeableWeight,
    });

    console.log(savedData);
    res
      .status(200)
      .json({ message: "Step 4 done successfully", savedData: savedData });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during step 4" });
  }
};
const tradeStepFive = async (req, res) => {
  try {
    const { tradeId, quote, userId } = req.body;
    await Trade.findByIdAndUpdate(tradeId, {
      totalPrice: quote,
      userId: userId,
    });
    console.log("Price and user Id inserted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Data not inserted" });
  }
};

const getAirExpressServiceData = async (req, res) => {
  try {
    const services = await AirExpressTransportServices.find().lean();
    res.status(200).json({
      airexpressService: services,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// const getAllCountryName = async (req, res) => {
//   try {
//     const data = await country.find().lean();

//     if (data.length === 0) {
//       return res.status(404).json({ error: "No data found in the database" });
//     }

//     res.status(200).json({
//       message: "Data fetched successfully",
//       data: data,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "An error occurred while fetching data" });
//   }
// };
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
//getting all trades according to user id
//if service type is selected then the data acc to userid and serviceType
const getAirExpressCountries = async (req, res) => {
  try {
    const data = await airexpresscountries.find().lean();
    if (data.length === 0) {
      return res.status(404).json({ error: "No data found in the database" });
    }
    res.status(200).json({
      message: "Data fetched successfully",
      data: data[0],
    });
    console.log(data);
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
const getTrade = async (req, res) => {
  try {
    const { userId } = req.params;
    const { serviceType } = req.query;
    const query = { userId: userId };
    if (serviceType) {
      query.serviceType = serviceType;
    }
    const trade = await Trade.find(query);
    if (trade.length === 0) {
      return res.json({ message: "no data" });
    }
    res.json({
      trade: trade,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
const getSeaPort = async (req, res) => {
  try {
    const { country } = req.params;
    res.json({ trade: trade });

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

    if (!data) {
      return res.status(404).json({ error: "Data not found" });
    }

    const filtered = data.value.filter((x) => x.countryName === country);
    res.send(filtered);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};
const getExpressRates = async (req, res) => {
  if (
    req?.query?.countryIndex == undefined &&
    req?.query?.weight == undefined &&
    req?.params?.tradeType == undefined
  ) {
    res.send("Data not defined");
  } else {
    try {
      const { weight, countryIndex } = req.query;
      // console.log("checking...", req?.query?.countryIndex, req?.query?.weight);

      const tradeType = parseInt(req.params.tradeType);
      let data;

      if (tradeType === 1) {
        const importMWLData = await airExpressImportMWL.aggregate([
          {
            $project: {
              row: { $arrayElemAt: ["$prices", parseInt(weight - 1)] },
            },
          },
          {
            $project: {
              val: { $arrayElemAt: ["$row", parseInt(countryIndex)] },
            },
          },
        ]);
        const importDHLData = await airExpressImportDHL.aggregate([
          {
            $project: {
              row: { $arrayElemAt: ["$prices", parseInt(weight - 1)] },
            },
          },
          {
            $project: {
              val: { $arrayElemAt: ["$row", parseInt(countryIndex)] },
            },
          },
        ]);

        data = [
          { serviceName: "MWL", rate: importMWLData[0].val.toFixed(2) },
          { serviceName: "DHL", rate: importDHLData[0].val.toFixed(2) },
        ];
      } else if (tradeType === 2) {
        const exportMWLData = await airExpressExportDHL.aggregate([
          {
            $project: {
              row: { $arrayElemAt: ["$prices", parseInt(weight - 1)] },
            },
          },
          {
            $project: {
              val: { $arrayElemAt: ["$row", parseInt(countryIndex)] },
            },
          },
        ]);
        const exportDHLData = await airExpressImportDHL.aggregate([
          {
            $project: {
              row: { $arrayElemAt: ["$prices", parseInt(weight - 1)] },
            },
          },
          {
            $project: {
              val: { $arrayElemAt: ["$row", parseInt(countryIndex)] },
            },
          },
        ]);

        data = [
          { serviceName: "MWL", rate: exportMWLData[0].val.toFixed(2) },
          { serviceName: "DHL", rate: exportDHLData[0].val.toFixed(2) },
        ];
      } else {
        return res
          .status(400)
          .json({ error: "Invalid tradeType or transport company" });
      }

      if (!data) {
        return res.status(404).json({ error: "Data not found" });
      }

      return res.status(200).json({
        message: "Data Successfully found",
        data,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data" });
    }
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

const getAllAirport = async (req, res) => {
  try {
    const { country } = req.params;

    const data = await Airport.find().lean();
    if (!country) {
      const airports = data.map((airport) => airport.AIRPORTCITY);
      res.send(airports).status(200);
    } else {
      country;
      const countryAirports = data
        .filter((airport) => airport.COUNTRY === country)
        .map((airport) => airport.AIRPORTCITY);
      res.send(countryAirports).status(200);
    }
  } catch (err) {
    res.status(500).json({ error: "An error occurred while fetching data" });
    console.log(err);
  }
};

const getAllSeaport = async (req, res) => {
  try {
    const { country } = req.qbody;
    const data = await Seaport.find().lean();
  } catch {}
};

const getAirline = async (req, res) => {
  try {
    const data = await Airline.find().lean();

    if (data.length === 0) {
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

const getFreightCharges = async (req, res) => {
  try {
    const getFreightcharges = await AirFreightCharges.find({});
    let { chargeableweight, termofshipment, stackable, item } = req.body;

    let Emirates = { cost: 0, fuelsurcharge: 0 };
    let Qatar = { cost: 0, fuelsurcharge: 0 };
    let Pia = { cost: 0, fuelsurcharge: 0 };

    for (let element of item) {
      if (element.natureOfPackage === false) {
        element.natureOfPackage = 950;
      } else {
        element.natureOfPackage = 0;
      }
    }

    let exwCharges = 0;

    let destinationCharges = 0;

    let exwChargesDescription = [
      {
        chargeName: "PICKUP CHARGES",
        minCharge: 150,
        ratePerKg: 1,
        chargeableWeight: chargeableweight,
        charged: 0,
      },
      {
        chargeName: "AIRWAY BILL FEES",
        minCharge: 10,
        ratePerKg: "N/A",
        chargeableWeight: chargeableweight,
        charged: 10,
      },
      {
        chargeName: "MISCELLANEOUS",
        minCharge: "N/A",
        ratePerKg: "N/A",
        chargeableWeight: chargeableweight,
        charged: 2,
      },
    ];

    let destinationChargesdescription = [
      {
        chargeName: "MAC SERVICE",
        minCharge: "N/A",
        ratePerKg: "N/A",
        chargeableWeight: chargeableweight,
        charged: 25,
      },
      {
        chargeName: "Transportation",
        minCharge: 70,
        ratePerKg: 1,
        chargeableWeight: chargeableweight,
        charged: 0,
      },
    ];

    for (let item of getFreightcharges) {
      let emiratesrate = parseFloat(item.Emirates.rate);
      let qatarrate = parseFloat(item.Qatar.rate);
      let piarate = parseFloat(item.PIA.rate);

      originpickupcharges =
        chargeableweight * 1 < item.PICKUPCHARGES
          ? item.PICKUPCHARGES
          : chargeableweight;

      Mac = item["Mac Service"];
      transportation = item.Transportation;
      Airwaybillfee = parseFloat(item.AIRWAYBILLFEE);
      Miscellaneous = item.MISCELLANEOUS;

      if (
        emiratesrate * chargeableweight <
        parseFloat(item.Emirates.mincharge)
      ) {
        Emirates.cost = parseFloat(item.Emirates.mincharge);
        Emirates.fuelsurcharge = parseFloat(
          item.Emirates.fuelsurcharge * chargeableweight
        );
      } else {
        Emirates.cost = emiratesrate * chargeableweight;
        Emirates.fuelsurcharge = parseFloat(
          item.Emirates.fuelsurcharge * chargeableweight
        );
      }

      if (qatarrate * chargeableweight < parseFloat(item.Qatar.mincharge)) {
        Qatar.cost = parseFloat(item.Qatar.mincharge);
        Qatar.fuelsurcharge = parseFloat(
          item.Qatar.fuelsurcharge * chargeableweight
        );
      } else {
        Qatar.cost = qatarrate * chargeableweight;
        Qatar.fuelsurcharge = parseFloat(
          item.Qatar.fuelsurcharge * chargeableweight
        );
      }

      if (piarate * chargeableweight < parseFloat(item.PIA.mincharge)) {
        Pia.cost = parseFloat(item.PIA.mincharge);
        Pia.fuelsurcharge = parseFloat(
          item.PIA.fuelsurcharge * chargeableweight
        );
      } else {
        Pia.cost = piarate * chargeableweight;
        Pia.fuelsurcharge = parseFloat(
          item.PIA.fuelsurcharge * chargeableweight
        );
      }

      if (termofshipment == 4 || termofshipment == 3) {
        exwCharges =
          (1 * chargeableweight > item.PICKUPCHARGES
            ? chargeableweight
            : item.PICKUPCHARGES) +
          item.AIRWAYBILLFEE +
          item.MISCELLANEOUS;

        exwChargesDescription[0].charged =
          1 * chargeableweight > item.PICKUPCHARGES
            ? chargeableweight
            : item.PICKUPCHARGES;
      } else {
        exwCharges = item.AIRWAYBILLFEE + item.MISCELLANEOUS;
      }

      if (termofshipment == 2 || termofshipment == 4) {
        destinationCharges = item["Mac Service"] + item.Transportation;

        destinationChargesdescription[1].charged = item.Transportation;
      } else {
        destinationCharges += item["Mac Service"];
      }
    }
    let serviceCharges = [
      {
        key: 1,
        companyname: "Pakistan International Airlines",
        noofpackage: item.length,
        chargeableWeight: chargeableweight,
        minCharge: 110,
        totalDestCharges: destinationCharges,
        totalExwCharges: exwCharges,
        ratePerKg: 1.9,
        totalCharges:
          parseFloat(Pia.cost.toFixed(1)) + exwCharges + destinationCharges,
        ratefsc: 0.6,
        fsc: parseFloat(Pia.fuelsurcharge.toFixed(1)),
        stackable: stackable === true ? 995 : 0,
      },
      {
        key: 2,
        companyname: "Emirates Sky Cargo",
        noofpackage: item.length,
        chargeableWeight: chargeableweight,
        minCharge: 250,
        totalDestCharges: destinationCharges,
        totalExwCharges: exwCharges,
        ratePerKg: 1.5,
        totalCharges:
          parseFloat(Emirates.cost.toFixed(1)) +
          exwCharges +
          destinationCharges,
        ratefsc: 0.07,
        fsc: parseFloat(Emirates.fuelsurcharge.toFixed(1)),
        stackable: stackable === true ? 995 : 0,
      },
      {
        key: 3,
        companyname: "Qatar Airways",
        noofpackage: item.length,
        chargeableWeight: chargeableweight,
        minCharge: 150,
        totalDestCharges: destinationCharges,
        totalExwCharges: exwCharges,
        ratePerKg: 1.7,
        totalCharges:
          parseFloat(Qatar.cost.toFixed(1)) + exwCharges + destinationCharges,
        ratefsc: 0.0,
        fsc: parseFloat(Qatar.fuelsurcharge.toFixed(1)),
        stackable: stackable === true ? 995 : 0,
      },
    ];
    res.status(200).json({
      exwCharges: {
        totalCharge: exwCharges,
        chargeDescription: exwChargesDescription,
      },
      destCharges: {
        totalCharge: destinationCharges,
        chargeDescription: destinationChargesdescription,
      },
      serviceCharges: serviceCharges,
      items: item,
    });
  } catch (err) {
    console.log(err);
  }
};

const getSeaPortByName = async (req, res) => {
  try {
    const { country } = req.params;
    var result = [];
    for (var i in databases) {
      if (databases[i].country.includes(country))
        result.push({
          name: databases[i].name,
          city: databases[i].city,
          country: databases[i].country,
          coordinates: databases[i].coordinates,
        });
    }
    // const resultss = await Seaport.insertMany(result);
    console.log(result);

    res.send({ data: result });
  } catch (err) {
    console.log("mongoose_Error", err);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

// const paymentStripe=async()=>{
// let {amount,id}=req.body;
// try {
//   const payment=await stripe.paymentIntents.create({
//     amount,
//     currency:"USD",
//     payment_method:id,
//     confirm:true
//   })
//   console.log("payment",payment)
//   res.json({
//     message:"payment successful",
//     success:true
//   })
// } catch (error) {
//   console.log("Error",error)
//   res.json({
//     message:"Payment failed",
//     success:false
//   })
// }
// }

module.exports = {
  tradeStepOne,
  tradeStepTwo,
  tradeStepThree,
  tradeStepFour,
  tradeStepFive,
  // getAllCountryName,
  tradeCount,
  getAirExpressServiceData,
  getExpressRates,
  getTrade,
  getAllAirport,
  getAirline,
  getFreightCharges,
  getSeaPortByName,
  getAirExpressCountries,
};
