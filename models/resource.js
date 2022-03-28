const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, require: true },
    image: { type: String, require: true },
    content: { type: JSON, require: true },
    user_id: { type: String, require: true },
    desactivated: { type: Boolean, required: false, default: 0 },
    likes: { type: Number, required: false, default: 0 },
    share: { type: Number, required: false, default: 0 },
    deleted: { type: Boolean, required: false, default: 0 },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: false },
});

module.exports = mongoose.model('Resource', resourceSchema)