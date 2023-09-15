
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AssistanceSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true, auto: true },
    numeroDocumento: { type: Number, required: true },
    fechaDeAsistencia: { type: Date, required: true },
});

module.exports = mongoose.model('assistance', AssistanceSchema);