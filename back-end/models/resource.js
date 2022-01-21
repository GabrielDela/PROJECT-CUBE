const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, require: true },
});

module.exports = mongoose.model('Resource', resourceSchema)