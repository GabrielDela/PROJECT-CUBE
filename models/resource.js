const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, require: true },
    desactivated: { type: Boolean, required: true },
    deleted: { type: Boolean, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});

module.exports = mongoose.model('Resource', resourceSchema)