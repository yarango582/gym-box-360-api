const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UsersSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    numeroDocumento: { type: Number, required: true },
    contrasena: { type: String, required: true },
});

module.exports = mongoose.model("users", UsersSchema);