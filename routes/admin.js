const route = require("express").Router();
const {updateAirFreightCharges,updateAirlineExpress}=require("../Controllers/admin.controller")
// const {updateTransportCompany}=require("../Controllers/admin.controller")
route.patch("/updateFreightCharges/:termofshipment", updateAirFreightCharges)
// route.patch("/updateTransportCompany/:name", updateTransportCompany)
route.patch("/updateAirlineExpress/:companyname",updateAirlineExpress)


module.exports = route;
