const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const schema_opts = {
    timestamps: true
};

const tokenSchema = new Schema({
    _userId: { 
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, required: true,
        default: Date.now,
        expires: 43200 //verification token document will automatically delete itself after 12 hours
    }
},schema_opts);

module.exports = mongoose.model('VerificationToken', tokenSchema);