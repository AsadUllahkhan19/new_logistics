const router = require("express").Router();
const seaportController = require("../Controllers/seaport.controller");

router.get("/getports", seaportController.getCountries);
