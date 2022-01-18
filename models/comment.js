const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    id_relationship: { type: String, required: true },
    id_user: { type: String, require: true },
    comment: { type: String, require: true },
    deleted: { type: Boolean, required: false },
});

module.exports = mongoose.model('Comment', commentSchema)