const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    activated: { type: Boolean, default: true },
    firstname: { type: String, required: true },
    lastname: { type: String, require: true },
    tag : { type: String, require: true },
    biography: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    google_id: { type: String, require: false },
    avatar: { type: String, require: false },
    age : { type: Number, require: true },
    role : { type: String, require: true, default: 'user' },
    favorites: [{ type: String, require: false }],
});

module.exports = mongoose.model('User', userSchema);