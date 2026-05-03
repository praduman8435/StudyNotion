const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60, // The document will be automatically deleted after 5 minutes of its creation time
    }

});


module.exports = mongoose.model('OTP', OTPSchema);
