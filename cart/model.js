const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const schema_opts = {
	timestamps: true
};

const CartSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    state: { type: String, default: "Active", required: true },
    total: Number,
    reservations: [{
        session_id: { type: Schema.Types.ObjectId, ref: 'Sessions', required: true },
        cart_id: { type: Schema.Types.ObjectId , required: true },
		seats: { type: Schema.Types.Mixed, default:[] },
		price: Number,
		total: Number
    }]
},schema_opts);

module.exports = mongoose.model('Cart', CartSchema);