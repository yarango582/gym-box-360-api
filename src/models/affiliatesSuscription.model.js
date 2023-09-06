
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AffiliatesSuscriptionSchema = new Schema({
    _id: Schema.Types.ObjectId,
    idAfiliado: { type: Schema.Types.ObjectId, ref: "affiliates", required: true },
    fechaDePago: { type: Date, required: true },
    valorDePago: { type: Number, required: true },
    medioDePago: { type: String, required: true },
    activo: { type: Boolean, required: true },
});

module.exports = mongoose.model("affiliatesSuscription", AffiliatesSuscriptionSchema);