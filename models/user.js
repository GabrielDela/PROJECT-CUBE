const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, require: true },
    email: { type: String, require: true },
    google_id: { type: String, require: false },
});

module.exports = mongoose.model('User', userSchema)