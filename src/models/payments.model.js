
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    idAfiliado: { type: Schema.Types.ObjectId, ref: "affiliates", required: true },
    fechaDePago: { type: Date, required: true },
    valorDePago: { type: Number, required: true },
    medioDePago: { type: String, required: true },
});

module.exports = mongoose.model('payments', PaymentSchema);