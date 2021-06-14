const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../user/model');
const config = require('../config/main');
const Cart = require('../cart/index');

function generateToken(user) {
	return jwt.sign(user, config.secret, {
		expiresIn: 3600 * 24 * 365 // in seconds
	});
}

// Set user info from request
function setUserInfo(request) {

	return {
        _id: request._id,
        username: request.username,
		email: request.email,
		role: request.role,
		firstName: request.profile.firstName,
		lastName: request.profile.lastName,
		// phone: request.profile.phone,
		// address: request.profile.address,
		// dob: request.profile.dob,
		// job: request.profile.job,
		// ar_mitrooy_OSDE: request.profile.ar_mitrooy_OSDE,
		// afm: request.profile.afm,
		// deviceID: request.profile.deviceID,
		// db_project: request.db_project,
		// mobile_token: request.mobile_token
	};

}

exports.login = function (req, res) {
	let userInfo = setUserInfo(req.user);
	// console.log(req.headers.device);

	// console.log(req.user._id);
	User.findById(req.user._id, function (err, user) {
		if (err)
			return res.status(422).send(err);
		if (req.headers.device && req.headers.device === "Android") {
			console.log(req.user._id, req.body.token);
			User.findByIdAndUpdate(req.user._id, { mobile_token: req.body.token })
				.exec(function (err, user) {
					if (err)
						return res.status(422).send(err);
					console.log(user);
				});
		}
		res.status(200).json({
			message: 'Login successful',
			token: 'JWT ' + generateToken(userInfo),
			user: userInfo
		});
	});

}
exports.register = function (req, res , next) {
	let mobile;
	if (req.headers.device && req.headers.device === "Android")
		mobile = req.body.token;
	else
		mobile = " ";
	console.log(req.body.token);
	// console.log(mobile);
	let user = new User({
		email: req.body.email,
        password: req.body.password,
        username: req.body.username,
		profile: {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			// phone: req.body.phone,
			// address: req.body.address,
			// dob: req.body.dob,
			// job: req.body.job,
			// ar_mitrooy_OSDE: req.body.ar_mitrooy_OSDE,
			// afm: req.body.afm,
			// deviceID: req.body.deviceID
		},
		// mobile_token: mobile,
		// db_project: req.body.db_project,
		role: req.body.role,
	});
	if (!(req.headers.device === undefined) && (req.headers.device === "Android"))
		req.body.token;

	user.save(function (err, user) {
		if (err)
			return res.status(422).send(err);
		let userInfo = setUserInfo(user);
		console.log(userInfo);
		res.status(201).json({
			message: 'User successfully created!',
			token: 'JWT ' + generateToken(userInfo),
			user: userInfo
		});

		/** When user registration complete successfully, then create a cart which belongs to him. */
		return next(Cart.create(user));
	});
}

exports.user = function (req, res) {
	let userInfo = setUserInfo(req.user);

	User.findById(req.user._id, function (err, user) {
		if (err)
			return res.status(422).send(err);
		res.status(200).json({
			message: 'Now you can get userId',
			user: userInfo
		});
	});
}
exports.roleAuthorization = function (role) {
	return function (req, res, next) {
		const user = req.user;

		User.findById(user._id, function (err, foundUser) {
			if (err) {
				res.status(422).json({ error: 'No user was found.' });
				return res.status(422).send(err);
			}
			// If user is found, check role.
			if (foundUser.role == role)
				return next();

			res.status(401).json({ error: 'You are not authorized to view this content.' });
			return next('Unauthorized');
		});
	}
}
exports.testroute = function (req, res) {
	res.sendStatus(200);
}
