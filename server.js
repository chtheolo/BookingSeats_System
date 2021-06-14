const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const router = require('./router');
const config = require('./config/main');

const enviroment = app.get('env');

if (['production', 'development', 'production_insecure', 'development_insecure'].indexOf(enviroment) == -1) {
	console.log(`${app.get('env')} is not an acceptable parameter`);
	return;
}
mongoose.connect(config[enviroment].database, { 
	useNewUrlParser: true,
	useUnifiedTopology: true
});
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);


app.use(bodyParser.urlencoded({ extended: false })); // For parsing req.body (json and normal)
app.use(bodyParser.json());

// Enable CORS
const http_colors = {
	FgBlack: "\x1b[30m",
	delete: "\x1b[31m",
	body: "\x1b[32m",
	put: "\x1b[33m",
	FgBlue: "\x1b[34m",
	post: "\x1b[35m",
	GET: "\x1b[36m",
	url: "\x1b[37m"
};
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Accept, Authentication, Authorization, Content-Type, X-Requested-With, Range');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');

	// intercepts OPTIONS method
	if (req.method === 'OPTIONS')
		return res.sendStatus(200);
	else {
		if (req.method == 'POST' || req.method == 'PUT')
			console.log(req.body);

		console.log(`${req.protocol}\t${req.method}\t${req.originalUrl}`);
		next();
	}
});
var server
// if( app.get('env').includes('insecure') )
    server = app.listen(config[enviroment].port);
// else
    // server = https.createServer(credentials, app).listen(config[enviroment].port)
    // server = http.createServer(app).listen(config[enviroment].port)
console.log(`Mode: ${enviroment}. Your server is running on port ${config[enviroment].port}.`);

// Import routes to be served
router(app);

// necessary for testing
module.exports = server;
