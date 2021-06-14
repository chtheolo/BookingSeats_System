var port = {
	production: 4002,
    development: 4001,
    production_insecure: 4041,
	development_insecure: 4042
};

var database = {
	// production: ''mongodb://mongo:27017/prod_booking',
	development: 'mongodb://mongo:27017/dev_booking'
}

module.exports = {
	secret: 'booking_signature_sauce', // Secret key for JWT signing and encryption
	production: {
		port: port.production,
		database: database.production
	},
	development: {
		port: port.development,
		database: database.development
    },
    production_insecure: {
		port: port.production_insecure,
		database: database.production
	},
	development_insecure: {
		port: port.development_insecure,
		database: database.development
	}
}
