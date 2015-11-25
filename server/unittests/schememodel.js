var expect = require('expect.js');
var mongoose = require('mongoose');
var user = require('../models/scheme.js')(mongoose);
mongoose.connect('mongodb://localhost/pricingEngine');
describe('Model', function() {
	this.timeout(5000);

	it('User Model Field Name Missing', function(done) {
		function makeid() {
			var text = "";
			var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			for (var i = 0; i < 5; i++)
				text += possible.charAt(Math.floor(Math.random() * possible.length));
			return text;
		}

		var data = {
			"behavior": {
				"serviceLevelDiscounts": [{
					"discount": 3,
					"discountType": "%",
					"maxLength": 9,
					"services": [{
						"id": 234,
						"name": "Econsult"
					}]
				}],
				"locationOfServices": [],
				"cumulativeAmountPoints": [],
				"billValueDiscounts": [{
					"discount": 7,
					"discountType": "%",
					"maxLength": 1,
					"billRange": {
						"from": 10000,
						"to": 100000
					}
				}],
				"modeOfPaymentDiscounts": [{
					"discount": 5,
					"discountType": "%",
					"maxLength": 9,
					"mop": "EPAY"
				}, {
					"discount": 1,
					"discountType": "%",
					"maxLength": 9,
					"mop": "COD"
				}, {
					"discount": 1,
					"discountType": "%",
					"maxLength": 9,
					"mop": "CHEQUE"
				}],
				"doctorLevelDiscounts": [{}],
				"advancePaidPoints": [],
				"serviceRateCategoryDiscounts": [{
					"discount": 7,
					"discountType": "%",
					"srcTypes": [{
						"id": 234,
						"name": "High Level Products"
					}, {
						"id": 456,
						"name": "Low Level Products"
					}]
				}],
				"discountType": "%"
			},
			"metadata": {
				"type": "ADD_ON",
				"name": makeid(),
				"defaultLife": "REGULAR",
				"toIds": []
			},
			"orders": []
		};

		mongoose.model('scheme')(data).save(function(err, docs) {
			if (err) return done(err);
			else {
				expect(docs.metadata.name).to.be.ok();
				expect(docs.metadata.type).to.be.ok();
				expect(docs.behavior.maximumUsages).to.be.ok();
				expect(docs.behavior.endDate).to.be.ok();
				expect(docs.behavior.startDate).to.be.ok();
				expect(docs.behavior.discount).to.be.ok();
				expect(docs.behavior.discountType).to.be.ok();
				expect(docs.behavior.serviceLevelDiscounts).to.be.ok();
				expect(docs.behavior.locationOfServices).to.be.ok();
				expect(docs.behavior.cumulativeAmountPoints).to.be.ok();
				expect(docs.behavior.billValueDiscounts).to.be.ok();
				expect(docs.behavior.modeOfPaymentDiscounts).to.be.ok();
				expect(docs.behavior.advancePaidPoints).to.be.ok();
				expect(docs.behavior.serviceRateCategoryDiscounts).to.be.ok();
				expect(docs.behavior.doctorLevelDiscounts).to.be.ok();
				expect(docs.behavior.defaultDiscount).to.be.ok();
				expect(docs.behavior.discountType).to.be.ok();

			}
		});

		data.metadata.name = makeid();
		data.metadata.type = "COUPON";
		mongoose.model('scheme')(data).save(function(err, docs) {
			if (err) return done(err);
			else {
				expect(docs.metadata.name).to.be.ok();
				expect(docs.metadata.type).to.be.ok();
				expect(docs.metadata.defaultLife).to.be.ok();
				expect(docs.behavior.maximumUsages).to.be.ok();
				expect(docs.behavior.endDate).to.be.ok();
				expect(docs.behavior.startDate).to.be.ok();
				expect(docs.behavior.discount).to.be.ok();
				expect(docs.behavior.discountType).to.be.ok();
				expect(docs.behavior.serviceLevelDiscounts).to.be.ok();
				expect(docs.behavior.locationOfServices).to.be.ok();
				expect(docs.behavior.cumulativeAmountPoints).to.be.ok();
				expect(docs.behavior.billValueDiscounts).to.be.ok();
				expect(docs.behavior.modeOfPaymentDiscounts).to.be.ok();
				expect(docs.behavior.advancePaidPoints).to.be.ok();
				expect(docs.behavior.serviceRateCategoryDiscounts).to.be.ok();
				expect(docs.behavior.doctorLevelDiscounts).to.be.ok();
				expect(docs.behavior.defaultDiscount).to.be.ok();
				expect(docs.behavior.discountType).to.be.ok();
			}
		});
		data.metadata.name = makeid();
		data.metadata.type = "GIFT_CARD";
		mongoose.model('scheme')(data).save(function(err, docs) {
			if (err) return done(err);
			else {
				expect(docs.metadata.name).to.be.ok();
				expect(docs.metadata.type).to.be.ok();
				expect(docs.metadata.defaultLife).to.be.ok();
				expect(docs.behavior.maximumUsages).to.be.ok();
				expect(docs.behavior.endDate).to.be.ok();
				expect(docs.behavior.startDate).to.be.ok();
				expect(docs.behavior.discount).to.be.ok();
				expect(docs.behavior.discountType).to.be.ok();
				expect(docs.behavior.serviceLevelDiscounts).to.be.ok();
				expect(docs.behavior.locationOfServices).to.be.ok();
				expect(docs.behavior.cumulativeAmountPoints).to.be.ok();
				expect(docs.behavior.billValueDiscounts).to.be.ok();
				expect(docs.behavior.modeOfPaymentDiscounts).to.be.ok();
				expect(docs.behavior.advancePaidPoints).to.be.ok();
				expect(docs.behavior.serviceRateCategoryDiscounts).to.be.ok();
				expect(docs.behavior.doctorLevelDiscounts).to.be.ok();
				expect(docs.behavior.defaultDiscount).to.be.ok();
				expect(docs.behavior.discountType).to.be.ok();
			}
		});
		expect(mongoose.model('scheme').schema.methods.beforeSaveDefaultValidation).to.be.a('function');
		expect(mongoose.model('scheme').schema.methods.beforeSaveCouponValidation).to.be.a('function');
		expect(mongoose.model('scheme').schema.methods.beforeSaveGiftCardValidation).to.be.a('function');
		expect(mongoose.model('scheme').schema.methods.beforeSaveAddOnValidation).to.be.a('function');
		done();
	});

});