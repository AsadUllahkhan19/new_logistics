const mongoose = require("mongoose");

const chargeSchema = new mongoose.Schema({
  elevatedrisk: {
    price: String,
    countries: [String],
  },
  restricteddestination: {
    price: String,
    countries: [String],
  },
  addresscorrection: {
    price: {
      international: String,
      domestic: String,
    },
  },
  oversize: {
    price: {
      international: String,
      domestic: String,
    },
  },
  overweight: {
    price: {
      international: String,
      domestic: String,
    },
  },
  nonstackable: {
    price: {
      international: String,
      domestic: String,
    },
  },
  fuelcharges: {
    price: {
      international: String,
      domestic: String,
    },
  },
});

// Create a model for the "charges" collection
module.exports = mongoose.model("dhlcharge", chargeSchema);
