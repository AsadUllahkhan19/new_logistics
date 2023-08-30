// const mongoose = require("mongoose")
// const profileSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     username: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     phonenumber: { type: String, required: true },
//     companyname: { type: String, required: true },
//     companyaddress: { type: String, required: true },
//     country: { type: String, required: true },
//     city: { type: String, required: true },
//     vat: { type: String },
//   }, { collection: 'profile' });


//   module.exports = mongoose.model("Profile",profileSchema)

const mongoose = require("mongoose");
const userProfileSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  phonenumber: { type: String, required: true },
  userId : {type : mongoose.Schema.Types.ObjectId , ref : 'user'},
  vat_certificate: { type: Object },
  trade_certificate:{type:Object},
  country: { type: String, required: true },
  city: { type: String, required: true },
  companyname: { type: String, required: true },
  companyaddress: { type: String, required: true },
  createdAt: {type : Date, default : Date.now},
  updatedAt: {type : Date,default : null},
  deletedAt: {type : Date,default : null}
});
module.exports = mongoose.model("profile", userProfileSchema);