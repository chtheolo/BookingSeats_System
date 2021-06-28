const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;
const schema_opts = {
	timestamps: true
};
const UserSchema = new Schema({
    email: { type: String, lowercase: true, unique: true, required: true },
    username: { type: String, lowercase: true, unique: true, required: true },
	password: { type: String, required: true },
    profile: {
		firstName: String,
		lastName: String,

		// phone: { type: String, unique: true, required: false},
		// address: String,
		// dob: Date,
	},
	// isVerified: { type: Boolean, default: false },
	role: { type: String, enum: ['Member', 'Admin'], default: 'Member' },
	resetPasswordToken: String,
	resetPasswordExpires: Date
}, schema_opts);

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
	const user = this,
        SALT_FACTOR = 5;

    if(user.profile && user.profile.lastName)
        user.profile.lastName = user.profile.lastName.toUpperCase().trim()
    if(user.profile && user.profile.firstName)
        user.profile.firstName = user.profile.firstName.toUpperCase().trim()

	if (!user.isModified('password'))
		return next();

	bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
		if (err)
			return next(err);

		bcrypt.hash(user.password, salt, null, function (err, hash) {
			if (err)
				return next(err);
			user.password = hash;
			next();
		});
	});
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err)
			return cb(err);
		cb(null, isMatch);
	});
}

module.exports = mongoose.model('User', UserSchema);
