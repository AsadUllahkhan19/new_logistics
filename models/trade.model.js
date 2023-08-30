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
    priceId: { type: mongoose.Schema.Types.ObjectId, ref: "pricing" },
    transportCompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "transportCompany ",
    },
    natureofpackage: { type: Boolean },
    noofpackage: { type: Number },
    totalWeight: { type: Number },
    //paymentTypeFreight:{type:String, enum:["Prepaid","Collect","Third Party"]},
    hazardous:{type:Boolean},
    stackable:{type:Boolean},
    timebound:{type:Boolean},
    oversize:{type:Boolean},
    
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
  },
  { collection: "trade" }
);

module.exports = mongoose.model("trade", tradeSchema);
