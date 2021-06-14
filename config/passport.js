const passport = require('passport');
const User = require('../user/model');
const config = require('./main');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Setting up local login strategy (afou exei ginei token extraction apo to jwt)
const express = require('express')
const app = express();
var localLogin;

if(app.get('env').includes('production')){
    console.log("Username auth")
    localLogin = new LocalStrategy((username, password, done) => {
        User.findOne({ username: username }, (err, user) => {
            if(err)
                return done(err);
            if(!user)
                return done(null, false, { error: 'Your login details could not be verified. Please try again.' });

            user.comparePassword(password, (err, isMatch) => {
                if(err)
                    return done(err);
                if(!isMatch)
                    return done(null, false, { error: 'Your login details could not be verified. Please try again.' });

                return done(null, user);
            });
        });
    });
}
else{
    console.log("Email auth")
    localLogin = new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({ email: email }, (err, user) => {
            if(err)
                return done(err);
            if(!user)
                return done(null, false, { error: 'Your login details could not be verified. Please try again.' });

            user.comparePassword(password, (err, isMatch) => {
                if(err)
                    return done(err);
                if(!isMatch)
                    return done(null, false, { error: 'Your login details could not be verified. Please try again.' });

                return done(null, user);
            });
        });
    });
}

// Setting up JWT login strategy
const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
	secretOrKey: config.secret
};
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	User.findById(payload._id, (err, user) => {
		if(err)
			return done(err, false);
		if(user)
			done(null, user);
		else
			done(null, false);
	});
});

passport.use(jwtLogin);
passport.use(localLogin);