var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    display_name: String,
    description: String,
    is_admin: {type: Boolean, boolean: false},
    is_super: {type: Boolean, boolean: false},
    image: String,
});

module.exports = mongoose.model('User', UserSchema);
