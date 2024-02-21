const mongoose = require('mongoose');
const User = require('./user');
const { Schema } = mongoose;

const forgotPasswordSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    active: {
        type: Boolean,
        default: true
    },
    expiresBy: {
        type: Date,
        required: true
    }
});

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);

module.exports = ForgotPassword;
