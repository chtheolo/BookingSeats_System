const express = require('express');
const Sessions = require('./model');
const Cart = require('../cart/index');


/* ---------------------------- CREATE ---------------------------------*/

/** Inner calls */
exports.Create = async function(date) {
	return new Promise(function(resolve, reject){

		let session = new Sessions({
			name: "Rivera",
			date: date,
			price: 9,
			seatsAvailable: 113,
			seats: [
				[0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
				[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
			]
		});

		session.save(function(err,session){
			if(err) {
				reject(err);
			}
			resolve(session);
		})
	});
}

/** HTTP calls */
exports.create = function(req,res){
	let session = new Sessions({
		name: req.body.name,
		date: req.body.date,
		price: req.body.number,
		seatsAvailable: req.body.seatsAvailable,
		seats: req.body.seats
	});
	session.save(function(err,session){
		if(err)
			return res.status(422).send(err.message);
		return res.send(session._id);
	});
}

/* ---------------------------- UPDATE ---------------------------------*/
exports.update = function(req,res){
	// Sessions.findByIdAndUpdate(req.params.fId,req.body)
	// .where('owner').equals(req.user._id)

	Sessions.findOneAndUpdate({ "date": { "$eq": req.query.date } }, req.body)
	.exec(function(err,sessions){
		if(err)
			return res.status(422).send(err);
		return res.send(sessions);
	})
}

/* ---------------------------- FETCH ---------------------------------*/
exports.fetch = function(req,res){
	let query;
	if (req.query.date) {
		query = Sessions.find({ "date": { "$eq": req.query.date } });
	}
	else if(req.params.sId) {
		query = Sessions.findById(req.params.sId)
	}
	else {
		query = Sessions.find()
	}
	
	query
	.exec(function(err,sessions){
		if(err) {
			console.log(err);
			return res.status(422).send(err);
			
		}
		console.log(sessions);
		if (sessions.length == 0) {
			console.log("create!");

			let session = new Sessions({
				name: "Rivera",
				date: req.query.date,
				price: 9,
				seatsAvailable: 113,
				seats: [
					[0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
				],
				reservations: []
			});

			session.save(function(err,Session){
				if(err) {
					console.log(err);
				}
				return res.status(200).json(Session);
			})
 		}
		else {
			return res.json(sessions);
		}
	});
}

/* ---------------------------- DELETE ---------------------------------*/
exports.delete = function(req, res, next){
	if (req.params.cId) {
		Sessions.find({"reservations._id": { "$eq": req.params.cId} })
			.exec(function(error, session){
				if (error) {
					console.log(error);
				}
				if (session.length != 0) {
					var setSeatsSelection = {};

					session[0].reservations.forEach(element => {
						if(element._id == req.params.cId) {
							for (let i = 0; i<element.seats.length; i++) {
								setSeatsSelection['seats.' + element.seats[i][0] + '.' + element.seats[i][1]] = 0;
							}

							Sessions.updateOne({
								date: session[0].date
							},{
								$set: setSeatsSelection,
								$inc: { seatsAvailable: +element.seats.length },
								$pull: {
									reservations: {
										_id: req.params.cId
									}
								}
							},function(error, session){
								if (error) {
									console.log(error);
									return;
								}
								console.log(session);
								return;
							})
						}
					});
				}
			})
	}
	else if (req.params.sId) {
		console.log(req.body._id)
		var query = Sessions.find({"_id": {"$eq": req.params.sId } })
		query
		.exec(function(error, session){
			if(error) {
				console.log(error);
			}
			console.log(session);
			var seats = [];

			session[0].reservations.forEach(element => {
				console.log(element);
				if (element._id == req.body._id) {
					console.log("find it");
					seats = element.seats;
					console.log("seats:")
					console.log(seats);
				}
			})

			var setSeatsSelection = {};

			for (let i=0; i<seats.length; i++) {
				setSeatsSelection['seats.' + seats[i][0] + '.' + seats[i][1]] = 0;
			}

			query.update({
				_id: req.params.sId
			},{
				$inc: { seatsAvailable: +seats.length },
				$set: setSeatsSelection,
				$pull: { reservations: { _id: req.body._id } }
			},function(error, session){
				if (error) {
					return res.status(422).send(error);
				}
				res.status(200).json({
					message: "Deleted!"
				})
				return next();
			});

		})
	}
	else if (req.query.date) {
		var query = Sessions.findOneAndDelete({date: {"$eq": req.query.date }})

		query
		.exec(function(error, session) {
			if (error) {
				return res.status(422).send(error);
			}
			return res.status(304).json({
				message: "Session Deleted!"
			})
		})
	}
	else if (res.locals.bookedReservations) {
		res.locals.bookedReservations.forEach(element => {
			Sessions.updateOne({
				"_id": {"$eq": element.sessionID }
			},{
				$pull: {
					reservations: {seats: element.seats }
				}
			},function(error, sessions){
				if (error) {
					console.log(error);
				}
				console.log(sessions);
			})
		})
		return;
	} 
}


/* ---------------------------- BOOK ---------------------------------*/
exports.book = function(req, res) {
	var seatsQuery = [];
	var setSeatsSelection = {};

	var sessions = Sessions.find({ "date": { "$eq": req.body.date } });
	sessions
	.exec(function(error, session) {
		if (error) {
			return res.status(422).send(error);
		}

		for (let i = 0; i< req.body.seats.length; i++) {
			var seatSelector = {};
			var seatSelection = 'seats.' + req.body.seats[i][0] + '.' + req.body.seats[i][1];

			/** Build the $and query in order to check if seat is free */
			seatSelector[seatSelection] = 0;
			seatsQuery.push(seatSelector);

			/** query for $set operation in order to set seat as occupied */
			setSeatsSelection[seatSelection] = 1;
		}

		// sessions.update({
		sessions.updateOne({
			date: req.body.date,
			$and: seatsQuery,
		}, { 
			$set: setSeatsSelection,
			$inc: { seatsAvailable: -req.body.seats.length },
			$push: {
				reservations: {
					seats: req.body.seats,
					price: session[0].price,
					total: session[0].price * req.body.seats.length
				}
			}
		},function(error, result){
			if(error) {
				return res.status(422).send(error);
			}

			if (result.nModified == 0) {
				return res.json({
					message: "Reservation request could not accepted."
				});
			}
			else if (result.nModified == 1) {
				Sessions
					.find({"date": { "$eq": req.body.date } })
					.exec(function(error, s){
						Cart.update(s, req.body.seats ,req.user._id);
					})

				return res.status(200).json({
					message: "Reservation request was accepted."
				});
			}
		})
	})
}