const router = require("express").Router();
const emergencySurcharge = require("../Controllers/emergencycharges.controller");

router.post(
  "/emergencySurcharges",
  emergencySurcharge.InsertEmergencySurcharges
);

module.exports = router;
