const mongoose = require('mongoose');

const relationSchema = mongoose.Schema({
    id_from: { type: String, required: true },
    id_to: { type: String, require: true },
    relation: { type: String, require: true, default: "Ami" },
});

module.exports = mongoose.model('Relation', relationSchema)