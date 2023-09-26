
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AffiliatesSuscriptionSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    idAfiliado: { type: Schema.Types.ObjectId, ref: "affiliates", required: true },
    fechaDePago: { type: Date, required: true },
    medioDePago: { type: String, required: true },
    activo: { type: Boolean, required: true },
    mesesPagados: { type: Number, required: false },
});

module.exports = mongoose.model("affiliatesSuscription", AffiliatesSuscriptionSchema);