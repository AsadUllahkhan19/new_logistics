const mongoose = require("mongoose");

const airfreightchargeSchema = new mongoose.Schema({
  Emirates: {
    mincharge: Number,
    rate: Number,
    fuelsurcharge: Number,
  },
  Qatar: {
    mincharge: Number,
    rate: Number,
    fuelsurcharge: Number,
  },
  PIA: {
    mincharge: Number,
    rate: Number,
    fuelsurcharge: Number,
  },
  PICKUPCHARGES: Number,
  AIRWAYBILLFEE: Number,
  AIRPORTHANDLING: {
    AIRPORT: Number,
    EXPORTDECLARATION: Number,
    EXPORTDOCUMENTATION: Number,
    CUSTOMSCLEARENCE: Number,
    "XRAY-SCREENINGCHARGES": Number,
  },
  MISCELLANEOUS: Number,
  DeliveryOrder: Number,
  AirportHandling2: Number,
  AirlineTransfer: Number,
  AIRPORTSYSTEMFEE: Number,
  CustomsClearance: Number,
  Transportation: Number,
  Inspectionfee: Number,
  "Mac Service": Number,
});
module.exports = mongoose.model("Airfreightcharges", airfreightchargeSchema);
