const mongoose=require('mongoose');

const countrySchema= new mongoose.Schema({
    countryName: { type: String, unique: true },

})

module.exports = mongoose.model("countryName",countrySchema)