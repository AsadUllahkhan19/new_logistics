const mongoose = require("mongoose");
const pricingSchema = new mongoose.Schema({
  priceId: { type: mongoose.Schema.Types.ObjectId },
  locationPrice: [
    {
      countryName: { type: String }, // You can change the type of the 'location' field as needed
      price: { type: Number },
    },
  ],
});

module.exports = mongoose.model("Pricing", pricingSchema);