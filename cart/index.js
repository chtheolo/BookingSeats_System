const express = require('express');
const Cart = require('./model');
const Sessions = require('../session/model');


/* ---------------------------- CREATE ---------------------------------*/
exports.create = function(req, res) {

    let cart = new Cart({
        owner: res.locals.user._id,
        state: "inactive",
        total: 0,
        reservations: []
    })

    cart.save(function(error, cart){
        if (error) {
            console.log(error);
            return;
        }
        console.log(cart);
        return;
    })
}

/* ---------------------------- UPDATE ---------------------------------*/
exports.update = function(session, seats, user_id) { 
    var pos = session[0].reservations.length;

    Cart.updateOne({
        owner: user_id,
    },{
        $push: {
            reservations: {
                session_id: session[0]._id,
                cart_id: session[0].reservations[pos-1]._id,
                seats: seats,
                price: session[0].price,
                total: session[0].price * seats.length
            }
        },
        $inc: { total: session[0].price * seats.length },
        $set: { modifiedOn: new Date() }
    },{
        upsert: true
    },
    function(error, result){
        if (error) {
            console.log(error);
        }
        else {
            console.log("result: \n")
            console.log(result);
        }
    });
}

/* ---------------------------- FETCH ---------------------------------*/
exports.fetch = function(req, res) {
    var carts = Cart.find({ "owner": { "$eq": req.user._id } });

    carts
    .exec(function(error, cart){
        if (error) {
            return res.status(422).send(error);
        }
        return res.send(cart);

    })
}

/* ---------------------------- DELETE ---------------------------------*/
exports.delete = function(req, res, next) {
    if (req.params.cId) {
        Cart.find({"reservations" : { "$elemMatch": { "cart_id": req.params.cId} } })
            .exec(function(error, carts){
                if (error) {
                    console.log(error);
                }
                var elementPrice;
                carts[0].reservations.forEach(element => {

                   if(element.cart_id == req.params.cId)  {
                       elementPrice = element.total;
                   }
                });

                Cart.updateOne({
                    owner: req.user._id
                },{
                    $inc: { total: -elementPrice},
                    $pull: {
                        reservations: {
                            cart_id: req.params.cId
                        }
                    }
                },function(error, c){
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
    else if (res.locals.bookedReservations) {
        var query = Cart.find({"owner": { "$eq" : req.user._id } })
        query
        .exec(function(error, cart) {
            if(error) {
                console.log(error);
            }

            var Seats = [];
            cart[0].reservations.forEach(element => {
                Seats.push(element.seats);
            })

            query.update({
                owner: req.user._id
            },{
                $inc: { total: -cart[0].total },
                $pull: { reservations: { seats: Seats } },
                $set: { status: "Done" }
            },function(error, cart){
                if (error) {
                    console.log(error);
                    return;
                }
                return next();
            })
        })
    }
    else {
        /** Delete the whole cart from a user. This should be an admin operation. */
        Cart.findOneAndDelete({ "owner": { "$eq": req.user._id }})
        .exec(function(error, cart){
            if (error) {
                return res.send(error);
            }

            return res.status(200).json({
                message: "Cart deleted!"
            });
        });
    }

}