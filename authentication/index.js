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
	};

}

exports.login = function (req, res) {
	let userInfo = setUserInfo(req.user);

	res.status(200).json({
		message: 'Login successful',
		token: 'JWT ' + generateToken(userInfo),
		user: userInfo
	});

}
exports.register = function (req, res, next) {

	let user = new User({
		email: req.body.email,
        password: req.body.password,
        username: req.body.username,
		profile: {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
		},
		role: req.body.role,
	});

	user.save(function (err, user) {
		if (err)
			return res.status(422).send(err);

		let userInfo = setUserInfo(user);

		res.status(201).json({
			message: 'User successfully created!',
			token: 'JWT ' + generateToken(userInfo),
			user: userInfo
		});

		/** When user registration complete successfully, then create a cart which belongs to him. */
		return next(Cart.create(user));
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
