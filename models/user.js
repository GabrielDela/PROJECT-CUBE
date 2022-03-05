const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, require: true },
    email: { type: String, require: true },
    avatar: { type: String, require: false },
    password: { type: String, require: false },
    description: { type: String, require: false },
    age: { type: Number, require: false },
    role_id: { type: Number, require: false, default: 0 },
    first_connection: { type: Boolean, require: false, default: false},
    google_id: { type: String, require: false },
});

module.exports = mongoose.model('User', userSchema)