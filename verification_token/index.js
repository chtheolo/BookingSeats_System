const VerificationToken = require('./model');
const User = require('../user/model');
const mongoose = require('mongoose');
const express = require('express');

exports.confirm = function(req, res) {
    VerificationToken.findOne({ token: req.body.token }, function(error, token) {
        if (!token) {
            return res.status(400).send({ type: 'not-verified', message: 'We were unable to find a valid token. Your token may have expired.'});
        }
        User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
            if (!user) {
                return res.status(400).send({ message: 'We were unable to find a user for this token.'});
            }
            if (user.isVerified == true) {
                return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
            }

            user.isVerified = true;
            user.save(function (err) {
                if (err) { 
                    return res.status(500).send({ msg: err.message }); 
                }
                res.status(200).send({
                    message: 'The account has been verified. Please log in.',
		        	token: 'JWT ' + generateToken(userInfo),
		        	user: userInfo
                });
            });
        });
    });
}