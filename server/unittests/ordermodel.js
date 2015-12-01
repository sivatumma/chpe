var expect = require('expect.js');
var mongoose = require('mongoose');
var scheme = require('../models/scheme.js')(mongoose);
var order = require('../models/order.js')(mongoose);

mongoose.connect('mongodb://localhost/pricingEngine');
describe('Model', function() {
	this.timeout(5000);
	it('Order Model Field Name Missing', function() {

		var data = {
			"schemeName": "a109",
			"userId": "123",
			"businessName": "Double",
			"dateOfService": "2015-10-24",
			"billAmount": 21100,
			"businessOrderId": "2344433",
			"finalAmount": 17994,
			"successfullyAvailed": false,
			"services": [
				"Econsult",
				"Drugs@Home"
			],
			"locationOfService": {
				"name": "hyderbad",
				"geoLocation": [
					122,
					30
				]
			}
		};
		order(data).save().then(function(data) {
			if (err) {
				console.log(err, ".. some error");
			} else {
				console.log("Success.");
				expect(docs.schemeName).to.be.ok();
			}
		}, function(err) {
			console.log("Some error, ps inspect.");
		});

		// done();
	});

});