const route = require("express").Router();
const alldhlcharges = require("../Controllers/dhlcharges");

route.post("/allcharges", alldhlcharges.getAllCharges);

module.exports = route;
