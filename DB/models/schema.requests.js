const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const symlySchema = new Schema({
    results: { type: Array, required: true },
    fileId: { type: mongoose.Types.ObjectId, required: true },
    date: { type: Date, default: Date.now }
});

const Symly = mongoose.model('symly_data', symlySchema);

module.exports = Symly;