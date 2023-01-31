const mongoose = require('mongoose');
const crypto = require('crypto');


// user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        max: 40
    },
    email: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
    },
    sessionToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetTokenExpires: {
        type: Date,
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);