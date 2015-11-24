var expect = require('expect.js');
var mongoose = require('mongoose');
var user = require('../models/user.js')(mongoose);
mongoose.connect('mongodb://localhost/pricingEngine') ;
describe('Model',function(){
	this.timeout(5000);
	it('User Model Field Name Missing', function(done) {
		var data = {
			username: "usr",
			password: "$2a$10$UWeFroLcQaD2ZlXNfDxPDeT.0W3gX8y41ARJNjG6ifq5dW88/nAeC",
			active: true,
			loginAttempts: 0,
			lockUntil: 1,
			roles: [
				"creator",
				"editor",
				"publisher"
			],
			roleCount: 3,
			provider: true,
			created_at: "2015-07-13",
			updated_at: "2015-09-23",
			tokens: [{
				"token": "585fa6d0-c69e-448e-bd1f-1ab59f23d879",
				"token_created": "2015-07-13T10:04:58.396Z",
				"token_expires": "2015-07-13T10:19:58.679Z"
			}],
			profile: {
				"interests": [],
				"children_under_18": 0,
				"married": false,
				"age": 21,
				"gender": "male"
			},
			avatar: "one.jpg"
		};
		mongoose.model('User')(data).save(function(err, docs) {
			if (err) return done(err);
		});
		expect(mongoose.model('User').schema.methods.comparePassword).to.be.a('function');
		expect(mongoose.model('User').schema.methods.incLoginAttempts).to.be.a('function');
		expect(mongoose.model('User').schema.statics.getAuthenticated).to.be.a('function');
		expect(mongoose.model('User').schema.statics.ssoLogin).to.be.a('function');
		expect(mongoose.model('User').schema.statics.ssoLogout).to.be.a('function');
		expect(mongoose.model('User').schema.statics.authorize).to.be.a('function'); 
		done();
	});

});