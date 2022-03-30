const mongoose = require('mongoose');

const resourceSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, require: true },
    image: { type: String, require: true },
    content: { type: JSON, require: true },
    user_id: { type: String, require: true },
    desactivated: { type: Boolean, required: false, default: false },
    likes: { type: Number, required: false, default: 0 },
    share: { type: Number, required: false, default: 0 },
    deleted: { type: Boolean, required: false, default: false },
    category_id : { type: String, required: false, default: null },
    type_id : { type: String, required: false, default: null },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: false },
    status : { type: String, required: false, default: 'En attente' },
});

module.exports = mongoose.model('Resource', resourceSchema)