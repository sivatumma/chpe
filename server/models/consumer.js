var bcrypt = require("bcrypt-nodejs"),
	SALT_WORK_FACTOR = 10,
	MAX_LOGIN_ATTEMPTS = 5,
	LOCK_TIME = 2 * 60 * 60 * 1000;
module.exports = function(mongoose) {
	var Schema = mongoose.Schema;
	var ConsumerSchema = Schema({
		username: {
			type: String,
			required: true,
			index: {
				unique: true
			}
		},
		password: {
			type: String,
			required: true
		},
		active: {
			type: Boolean,
			default: true
		},
		loginAttempts: {
			type: Number,
			required: true,
			default: 0
		},
		lockUntil: {
			type: Number
		},
		roles: {
			type: String,
			default: 'subscriber'
		},
		created_at: {
			type: Date,
			default: Date.now
		},
		updated_at: Date,
		tokens: [{
			token: {
				type: String
			},
			token_created: {
				type: Date
			},
			token_expires: {
				type: Date
			}
		}],
		provider: {
			type: String,
			enum: 'web,facebook'.split(','),
			default: 'web'
		},
		sex: {
			type: String,
			default: 'male',
			enum: 'male,female'.split(',')
		},
		age: {
			type: Number,
			default: 21
		}
	});



	ConsumerSchema.virtual('isLocked').get(function() {
		return !!(this.lockUntil && this.lockUntil > Date.now());
	});
	ConsumerSchema.pre('save', function(next) {
		var user = this;
		user.updated_at = new Date();
		if (!user.isModified('password')) return next();
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) return next(err);
			bcrypt.hash(user.password, salt, null, function(err, hash) {
				if (err) return next(err);
				user.password = hash;
				next();
			});
		});
	});

	ConsumerSchema.methods.comparePassword = function(candidatePassword, cb) {
		bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
			if (err) return cb(err);
			cb(null, isMatch);
		});
	};

	ConsumerSchema.methods.incLoginAttempts = function(cb) {
		if (this.lockUntil && this.lockUntil < Date.now()) {
			return this.update({
				$set: {
					loginAttempts: 1
				},
				$unset: {
					lockUntil: 1
				}
			}, cb);
		}
		var updates = {
			$inc: {
				loginAttempts: 1
			}
		};
		if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
			updates.$set = {
				lockUntil: Date.now() + LOCK_TIME
			};
		}
		return this.update(updates, cb);
	};

	var reasons = ConsumerSchema.statics.failedLogin = {
		NOT_FOUND: 0,
		PASSWORD_INCORRECT: 1,
		MAX_ATTEMPTS: 2
	};


	ConsumerSchema.statics.getAuthenticated = function(username, password, cb) {
		this.findOne({
			username: username
		}, function(err, user) {
			if (err) return cb(err);

			if (!user) {
				return cb(null, null, reasons.NOT_FOUND);
			}
			if (user.isLocked) {
				return user.incLoginAttempts(function(err) {
					if (err) return cb(err);
					return cb(null, null, reasons.MAX_ATTEMPTS);
				});
			}

			user.comparePassword(password, function(err, isMatch) {
				if (err) return cb(err);
				if (isMatch) {
					if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
					var updates = {
						$set: {
							loginAttempts: 0
						},
						$unset: {
							lockUntil: 1
						}
					};
					return user.update(updates, function(err) {
						if (err) return cb(err);
						return cb(null, user);
					});
				}

				user.incLoginAttempts(function(err) {
					if (err) return cb(err);
					return cb(null, null, reasons.PASSWORD_INCORRECT);
				});
			});
		});
	};

	ConsumerSchema.statics.authorize = function(req, res, next) {
		if (!req.headers['token']) res.send(401, {
			message: 'Authentication token required.'
		});
		mongoose.model('mUser').findOne({
			'tokens.token': req.headers['token']
		}, function(err, user) {
			if (err) return res.send(500, {
				message: err
			});
			if (!user) return res.send(403, {
				message: 'This request authentication  required.'
			});
			req.user = user;
			next();
		});
	};
	var Consumer = mongoose.model('Consumer', ConsumerSchema);

	return Consumer;
}