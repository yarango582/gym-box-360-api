
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AffiliatesSchema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: true, auto: true },
  tipoDocumento: { type: String, required: true },
  numeroDocumento: { type: Number, required: true },
  nombreCompleto: { type: String, required: true },
  email: { type: String, required: false },
  celular: { type: Number, required: true },
  genero: { type: String, required: false },
  fechaNacimiento: { type: Date, required: false },
  fechaIngreso: { type: Date, required: true },
  eps: { type: String, required: false },
  direccion: { type: String, required: false },
  estatura: { type: Number, required: false },
  peso: { type: Number, required: false },
  contactoEmergenciaNombre: { type: String, required: false },
  contactoEmergenciaCelular: { type: Number, required: false },
  horarioElegido: { type: String, required: true },
  diasDeCortesia: { type: Number, required: false, default: 0 },
});

module.exports = mongoose.model("affiliates", AffiliatesSchema);