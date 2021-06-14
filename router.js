const express = require('express');
const passport = require('passport');
const multer = require('multer');
// const passportService = require('./config/passport');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('image');


// Route Controllers
const controllers = {
	confirmation: require('./verification_token'),
	receipts: require('./receipts'),
	session: require('./session'),
	auth: require('./authentication'),
	cart: require('./cart'),
	user: require('./user'),
};
// Route Groups
const routes = {
	confirmation: express.Router(),
	receipts: express.Router(),
	session: express.Router(),
	auth: express.Router(),
	cart: express.Router(),
	user: express.Router(),
	api: express.Router(),
};

// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Constants for role types
const REQUIRE_ADMIN = "Admin";
const REQUIRE_MEMBER = "Member";

module.exports = function (app) {

	/*		confirmation		*/
	routes.api.use('/confirmation', routes.confirmation);
	routes.confirmation
		.post('/', controllers.confirmation.confirm);


	/*		receipts		*/
	routes.api.use('/receipts', requireAuth, routes.receipts);
	routes.receipts
		.get('/', controllers.receipts.fetch)
		.delete('/',controllers.receipts.delete)
		.post('/',controllers.receipts.create, controllers.cart.delete, controllers.session.delete);


	/* 		session			*/
	routes.api.use('/sessions', requireAuth, routes.session);
	routes.session
		.get('/:sId', controllers.session.fetch)
		.put('/:sId', controllers.session.update)
		.post('/:sId', controllers.session.book)
		.put('/', controllers.session.update)
		.delete('/:sId'/*,controllers.auth.roleAuthorization(REQUIRE_ADMIN)*/, controllers.session.delete,controllers.cart.delete)
		.post('/'/*,controllers.auth.roleAuthorization(REQUIRE_ADMIN)*/, controllers.session.create)
		.get('/', controllers.session.fetch)
		.delete('/'/*,controllers.auth.roleAuthorization(REQUIRE_ADMIN)*/, controllers.session.delete);


	/* 		auth			*/
	routes.api.use('/auth', routes.auth);
	routes.auth
		.post('/register', controllers.auth.register)//, controllers.cart.create)
		.post('/login', requireLogin, controllers.auth.login)
		.get('/protected', requireAuth, controllers.auth.testroute)


	/* 		cart			*/
	routes.api.use('/cart', requireAuth, routes.cart);
	routes.cart
		.get('/', controllers.cart.fetch)
		.delete('/:cId',controllers.cart.delete, controllers.session.delete)
		.delete('/', controllers.cart.delete);


	/* 		users			*/
	routes.api.use('/users', requireAuth, routes.user);
	routes.user
		.delete('/:uId', controllers.auth.roleAuthorization(REQUIRE_ADMIN), controllers.user.delete)
		.get('/:uId', controllers.user.fetch)
		.put('/:uId', controllers.user.update)
		.get('/', controllers.auth.roleAuthorization(REQUIRE_ADMIN), controllers.user.fetch);


	// Set url for API group routes
	app.use('/', routes.api);
};
