const router = require("express").Router();
const Authentication = require("../middleware/auth");
const tradeController = require("../Controllers/trade.controller");
require("dotenv").config();
// router.post("/calculation",tradeController.trade)
router.post("/stepOne", tradeController.tradeStepOne);

router.post("/stepTwo", tradeController.tradeStepTwo);
router.post("/stepThree", tradeController.tradeStepThree);
router.post("/stepFour", tradeController.tradeStepFour);
router.post("/stepFive", tradeController.tradeStepFive);

// router.post("/getValuesByWeightAndZoneIds",tradeController.getValuesByWeightAndZoneIds)
router.get(
  "/getAirExpressServiceData",
  tradeController.getAirExpressServiceData
);
router.get("/getAirExpressCountries", tradeController.getAirExpressCountries);
// router.get("/getCountryName", tradeController.getAllCountryName);
router.get("/getExpressRates/:tradeType", tradeController.getExpressRates);
router.get("/getAirport/:country", tradeController.getAllAirport);
router.get("/getAirline", tradeController.getAirline);
//////////////////////////////////////////////////////////////////////

router.post("/getFreightCharges", tradeController.getFreightCharges);

//router.post("/getPayment",tradeController.paymentStripe)
router.get("/getTrade/:userId", tradeController.getTrade);
router.get("/sea-ports-name/:country", tradeController.getSeaPortByName);

// router.post("/snd",tradeController.tradeCount)
// router.post("/getCountryZoneId",tradeController.getCountryZoneId)
// router.post("/countryZoneId",tradeController.countryZoneId)
// router.post("/expWeightZone",tradeController.expWeightZone)
// router.post("/impWeightZone",tradeController.impWeightZone)
// router.post("/tradeCompanyAirExpress",tradeController.tradeCompanyAirExpress)

module.exports = router;
