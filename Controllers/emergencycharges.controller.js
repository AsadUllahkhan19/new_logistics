const emergencySurchargeModel = require("../models/emergencySurcharge");

const InsertEmergencySurcharges = async (req, res) => {
  try {
    const { Country1, Country2, chargesperkg } = req.body;
    const newSurcharge = new emergencySurchargeModel.insertMany([
      {
        Country1,
        Country2,
        chargesperkg,
      },
    ]);

    const result = await newSurcharge.save();
    res.status(201).json(result);
  } catch (error) {
    res.status(404).json({ error: "Failed to create emergency surcharge." });
    res.status(500).json({ error: "Failed to create emergency surcharge." });
  }
};

module.exports = { InsertEmergencySurcharges };
