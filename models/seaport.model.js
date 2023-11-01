const moongoose = require("mongoose")
const seaportSchema = new moongoose.Schema(
    {
        name: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        coordinates: [Number],
        img: { type: String, required: true },
        key: { type: Number, required: true }
    },
    
)


module.exports = moongoose.model("seaport", seaportSchema);