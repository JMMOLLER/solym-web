const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const somlySchema = new Schema({
    results: { type: Array, required: true },
    fileId: { type: mongoose.Types.ObjectId, required: true },
    date: { type: Date, default: Date.now },
    trackID: { type: Number, required: false },
});

const Somly = mongoose.model('solym_datas', somlySchema);

module.exports = Somly;
