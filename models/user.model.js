// const mongoose = require("mongoose");
// const userSchema = new mongoose.Schema({
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     companyname: { type: String, required: true },
//     companyaddress: { type: String, required: true },
//     country: { type: String, required: true },
//     city: { type: String, required: true },
//     vat: { type: String },
//     licence: { type: String },
//     phonenumber: { type: String, required: true },
//     isVerified: { type: Boolean, default: false }, 


// },{ collection: 'users' });
// module.exports = User = mongoose.model("user", userSchema);
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  phonenumber: { type: String, required: true },
  companyname: { type: String, required: true },
  companyaddress: { type: String, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  vat_certificate: { type: Object },
 trade_certificate:{type:Object},
  isVerified: { type: Boolean, default: false },
  refreshToken: {type: String, required : false,default : null},
  verifyToken: { type: String,default : null },
  createdAt: {type : Date, default : Date.now},
  updatedAt: {type : Date,default : null},
  deletedAt: {type : Date,default : null}
});
module.exports =  mongoose.model("user", userSchema);
// ejs
// sns
// express-validator
// subscription mai bhi user id jahy gi

// user info table
// user schema ka relation user info 
// user info connected with subscription

// jwt k sth refreesh token rakwana hoga 

//isi server ma stripe integrate hogi
// user schhema mai is verfgied
// is creaded at 
// upodated at
// isDeleted 

//delated at