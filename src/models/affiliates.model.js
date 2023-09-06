
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AffiliatesSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  tipoDocumento: { type: String, required: true },
  numeroDocumento: { type: Number, required: true },
  nombreCompleto: { type: String, required: true },
  email: { type: String, required: false },
  celular: { type: Number, required: true },
  genero: { type: String, required: true },
  fechaNacimiento: { type: Date, required: true },
  fechaIngreso: { type: Date, required: true },
  eps: { type: String, required: true },
  direccion: { type: String, required: false },
  estatura: { type: Number, required: false },
  peso: { type: Number, required: false },
  contactoEmergenciaNombre: { type: String, required: true },
  contactoEmergenciaCelular: { type: Number, required: true },
  horarioElegido: { type: String, required: true },
});

module.exports = mongoose.model("affiliates", AffiliatesSchema);