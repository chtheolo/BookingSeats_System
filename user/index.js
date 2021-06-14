const express = require('express');
const User = require('./model');

exports.fetch = function (req, res) {
	let query;
	let query_params = req.query;
	if (req.params.uId)
		query = User.findById(req.params.uId);
	else
		query = User.find(query_params);
	query.exec(function (err, users) {
		if (err)
			return res.status(422).send(err);
		return res.json(users);
	});
}
exports.delete = function (req, res) {
	if (req.params.uId) {
		User
			.findByIdAndRemove(req.params.uId)
			.exec(function (err, users) {
				if (err)
					return res.status(422).send(err);
				return res.sendStatus(204);
			});
	}
	else // no user id
		return res.sendStatus(422);
}
exports.update = function (req, res) {
	User.findByIdAndUpdate(req.params.uId, req.body)
		.exec(function (err, users) {
			if (err)
				return res.status(422).send(err);
			return res.json(users);
		});
}
