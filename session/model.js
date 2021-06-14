const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const schema_opts = {
	timestamps: true
};

const SessionsSchema = new Schema({
	name: String,
	date: Date,
	price: Number,
	seatsAvailable: Number,
	seats: { type: Schema.Types.Mixed, default:[] },
	reservations: [{
		// cart_id: { type: Schema.Types.ObjectId },
		seats: { type: Schema.Types.Mixed, default:[] },
		price: Number,
		total: Number
	}]
},schema_opts);

module.exports = mongoose.model('Sessions', SessionsSchema);