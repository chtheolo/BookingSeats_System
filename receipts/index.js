const express = require('express');
const Receipt = require('./model');
const Cart = require('../cart/model');

/* ---------------------------- CREATE ---------------------------------*/
exports.create = function(req, res, next) {
    var cart = Cart.find({"owner": { "$eq": req.user._id }});
    cart
    .exec(function(error, carts){
        if (error) {
            console.log(error);
            return res.status(422).send(error);
        }

        res.locals.bookedReservations = []; 
        carts[0].reservations.forEach(element => {
            res.locals.bookedReservations.push({
                seats: element.seats,
                cartID: element.cart_id,
                sessionID: element.session_id
            });
        });
        
        let receipt = new Receipt({
            owner: req.user._id,
            reservations: carts[0].reservations,
            total: carts[0].total
        });

        receipt
        .save(function(error, receipt){
            if(error) {
                return res.status(422).send(error);
            }
            res.status(200).send(receipt);
            return next(); //going to update cart, be removing the booked seats

        });
    });
}

exports.fetch = function (req, res) {
    var receipt = Receipt.find({"owner": { "$eq": req.user._id }});

    receipt
    .exec(function(error, receipts){
        if(error) {
            return res.status(422).send(error);
        }
        return res.status(200).send(receipts);
    })
}

exports.delete = function(req, res) {
    Receipt.findOneAndDelete({ "owner": { "$eq": req.user._id } })
    .exec(function(error, receipt){
        if(error) {
            return res.status(422).send(error);
        }
        return res.status(200).json({
            message: "Receipts Deleted!"
        })
    })
}