const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const schema_opts = {
    timestamps: true
};

const ReceiptSchema = new Schema({
    owner: { type: Schema.Types.ObjectId },
    reservations: { type: Schema.Types.Mixed, default:[] },
    total: Number
},schema_opts);

module.exports = mongoose.model('Receipts', ReceiptSchema);