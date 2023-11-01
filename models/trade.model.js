const mongoose = require("mongoose");
const tradeSchema = new mongoose.Schema(
  {
    tradeId: { type: mongoose.Schema.Types.ObjectId },
    //will have to change it to profile--will do it in future
    // profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },

    tradeType: { type: Number },
    serviceType: { type: Number },
    serviceTypeOpt: { type: Number },
    shipperId: { type: mongoose.Schema.Types.ObjectId, ref: "shipperDetail" },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "receiverDetail" },
    transportCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transportCompany ",
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "succeeded"],
    },
    sessionId: { type: String },
    natureofpackage: { type: Boolean },
    noofpackage: { type: Number },
    totalWeight: { type: Number },
    //paymentTypeFreight:{type:String, enum:["Prepaid","Collect","Third Party"]},
    hazardous: { type: Boolean },
    stackable: { type: Boolean },
    timebound: { type: Boolean },
    oversize: { type: Boolean },
    totalPrice: { type: Number },
    totalCbm: { type: Number },
    totalVolumetricWeight: { type: Number },
    chargeableWeight: { type: Number },

    tradeItem: [
      {
        weight: { type: Number },
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        packageType: { type: String },
      },
    ],
    // Additional Shipment Details
    // countryName: { type: String, unique: true },
    fromCountry: { type: String },
    fromCity: { type: String },
    toCountry: { type: String },
    toCity: { type: String },
  },
  { collection: "trades" }
);

module.exports = mongoose.model("trade", tradeSchema);
