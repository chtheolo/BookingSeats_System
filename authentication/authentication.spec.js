const mongoose = require("mongoose");
const User = require('../user/model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');

const should = chai.should();
chai.use(chaiHttp);

describe('/auth',function() {
	before('Clear users db',function(done) {
		User
		.remove({})
		.exec(function(err){
			done();
		})
	});
	before('Create user',function(done) {
		let existingUser = new User({	 // Used for duplication and login checks
			profile:{
				firstName: "Γιώργος",
				lastName: "Μπρουσγουίλης"
			},
			email: "dup_giorgosbrucewillys@gmail.com",
			password: "123456"
		});
		existingUser.save(function(err){
			done();
		});
	});
	describe('/register', function() {
		it('it should register a user', function(done) {
			let user = {
				firstName: "Γιώργος",
				lastName: "Μπρουσγουίλης",
				email: "giorgosbrucewillys@gmail.com",
				password: "123456"
			};
			chai.request(server)
			.post('/auth/register')
			.send(user)
			.end(function(err, res){
				res.should.have.status(201);
				res.body.should.be.a('object');
				res.body.should.have.property('message').eql('User successfully created!');
				res.body.should.have.property('token');
				res.body.should.have.property('user');
				res.body.user.should.have.property('email');
				done();
			});
		});
		it('it should NOT register a user without an email field', function(done) {
			let user = {
				firstName: "Γιώργος",
				lastName: "Μπρουσγουίλης",
				// email: "giorgosbrucewillys@gmail.com",
				password: "123456"
			};
			chai.request(server)
			.post('/auth/register')
			.send(user)
			.end(function(err, res){
				res.should.have.status(422);
				res.body.should.be.a('object');
				res.body.should.have.property('errors');
				res.body.errors.should.have.property('email');
				res.body.errors.email.should.have.property('kind').eql('required');
				done();
			});
		});
		it('it should NOT register a user without a unique email field', function(done) {
			let user = {
				firstName: "Γιώργος",
				lastName: "Μπρουσγουίλης",
				email: "dup_giorgosbrucewillys@gmail.com",
				password: "123456"
			};
			chai.request(server)
			.post('/auth/register')
			.send(user)
			.end(function(err, res){
				res.should.have.status(422);
				res.body.should.be.a('object');
				res.body.should.have.property('code').eql(11000);
				res.body.should.have.property('errmsg').include("email");
				res.body.should.have.property('errmsg').include("duplicate key");
				done();
			});
		});
		it('it should NOT register a user without a password field', function(done) {
			let user = {
				firstName: "Γιώργος",
				lastName: "Μπρουσγουίλης",
				email: "giorgosbrucewillys@gmail.com",
				// password: "123456",
			};
			chai.request(server)
			.post('/auth/register')
			.send(user)
			.end(function(err, res){
				res.should.have.status(422);
				res.body.should.be.a('object');
				res.body.should.have.property('errors');
				res.body.errors.should.have.property('password');
				res.body.errors.password.should.have.property('kind').eql('required');
				done();
			});
		});
	});
	describe('/login', function() {
		it('it should login an existing user', function(done) {
			let login_info = {
				email: "dup_giorgosbrucewillys@gmail.com",
				password: "123456"
			};
			chai.request(server)
			.post('/auth/login')
			.send(login_info)
			.end(function(err, res){
				res.should.have.status(200);
				res.body.should.be.a('object');
				res.body.should.have.property('token');
				res.body.should.have.property('user');
				res.body.user.should.have.property('email');
				done();
			});
		});
		it('it should NOT login an existing user without an email field', function(done) {
			let login_info = {
				// email: "dup_giorgosbrucewillys",
				password: "123456"
			};
			chai.request(server)
			.post('/auth/login')
			.send(login_info)
			.end(function(err, res){
				res.should.have.status(400);
				done();
			});
		});
		it('it should NOT login an existing user without a password field', function(done) {
			let login_info = {
				email: "dup_giorgosbrucewillys@gmail.com",
				// password: "123456"
			};
			chai.request(server)
			.post('/auth/login')
			.send(login_info)
			.end(function(err, res){
				res.should.have.status(400);
				done();
			});
		});
		it('it should NOT login an existing user without a correct email', function(done) {
			let login_info = {
				email: "dup_giorgosbrucewillys@gmail.com_WRONG_CREDENTIALS",
				password: "123456"
			};
			chai.request(server)
			.post('/auth/login')
			.send(login_info)
			.end(function(err, res){
				res.should.have.status(401);
				done();
			});
		});
		it('it should NOT login an existing user without a correct password', function(done) {
			let login_info = {
				email: "dup_giorgosbrucewillys@gmail.com",
				password: "123456_WRONG_CREDENTIALS"
			};
			chai.request(server)
			.post('/auth/login')
			.send(login_info)
			.end(function(err, res){
				res.should.have.status(401);
				done();
			});
		});
	});
	describe('/protected', function() {
		it('it should access a jwt-protected route', function(done) {
			let login_info = {
				email: "dup_giorgosbrucewillys@gmail.com",
				password: "123456"
			};
			chai.request(server)
			.post('/auth/login')
			.send(login_info)
			.end(function(err, res){
				chai.request(server)
				.get('/auth/protected')
				.set('Authorization',res.body.token)
				.end(function(err, res){
					res.should.have.status(200);
					done();
				});
			});
		});
	});
	after('Clear users db',function(done) {
		User
		.remove({})
		.exec(function(err){
			done();
		})
	});
});