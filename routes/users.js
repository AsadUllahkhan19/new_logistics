const route = require("express").Router();
const Authentication = require("../middleware/auth");

const { validator, validate } = require("../validator/validator");
const {
  registerUser,
  verifyUser,
  loginUser,
  reviveToken,
  logout,
  getUser,
} = require("../Controllers/user.controller");
// const Authentication = require('../middleware/auth')

// route.post("/register",Authentication,validator('registerUser'),validate,registerUser)
route.post("/register", validator("registerUser"), validate, registerUser);

route.get("/verify", verifyUser);
route.post("/login", validator("loginUser"), validate, loginUser);
route.post("/revive", reviveToken);
route.post("/logout", logout);
route.get("/getUser/:id", getUser);


const seaportController=require("../Controllers/seaport.controller")


route.get("/getcities/:country",seaportController.getPortsByCountry)
route.get("/getallcountries",seaportController.getAllCountries)
route.get("/searchcountry/:query" , seaportController.searchCountry)
route.get("/getports/:city" , seaportController.getPorts)



// route.post("/tokenIsValid",tokenIsValid)

module.exports = route;
