var chUtils = require('../../lib/chUtils.js').chUtils;
var _ = require('lodash');

module.exports = {
	calculateSLDiscounts: function(serviceLevelDiscounts, bodydata) {
		console.log("Inside calculateSLDiscounts module method", serviceLevelDiscounts, bodydata.servicesAmount);
		var servicelevel = _.filter(serviceLevelDiscounts, function(item) {
			var finalservice = _.intersection(item._services, bodydata.services);
			if (finalservice.length == item._services.length)
				return item;
		});
		console.log("This is the servicelevel", servicelevel);
		var discountAmount = chUtils.callDiscount(bodydata.servicesAmount, servicelevel[0].discount, servicelevel[0].discountType)
		console.log(discountAmount);
		return discountAmount;
	},
	calculateSRCDiscounts: function(serviceLevelDiscounts, servicesAmount) {
		return discountAmount;
	},
	calculateDLDiscounts: function(serviceLevelDiscounts, servicesAmount) {
	},
	createSchema: function(data) {
		return data;
	},
	updateSchema: function(data) {
		var query = {
			"metadata.name": data.metadata.name
		};
		return query;
	},
	findSchema: function(data) {
		var query = {};
		query.push(data);
		return query;
	},
	suggestDiscounts: function(data) {
		var query = {
			"metadata.name": data.name,
			"behavior.locationOfServices.name": {
				$in: [data.locationOfService, "AllLocation"]
			},
			"behavior.startDate": {
				$lte: new Date(data.orderDate)
			},
			"behavior.endDate": {
				$gte: new Date(data.orderDate)
			},
			"metadata.published": true
		};
		return query;
	},
	findOrderQuery: function(req) {
		var query = {
			schemeName: req.body.name,
			userId: req.body.userId
		}
		return query;
	},
	shcemaFindQuery: function(query) {
		return query;
	},
	saveOrder: function(bodydata, data) {
		console.log("Inside saveOrder");
		if (data[0].metadata.type in ["GIFT_CARD", "COUPON"]) {
			bodydata.finalAmount = chUtils.callDiscount(bodydata.billAmount, data[0].behavior.discount, data[0].behavior.discountType);
		} else if (data[0].metadata.type == "ADD_ON") {
			this.calculateSLDiscounts(data[0].behavior.serviceLevelDiscounts, bodydata);
		}

		var query = {
			schemeName: bodydata.name,
			userId: bodydata.userId,
			businessName: bodydata.businessName,
			dateOfService: new Date(bodydata.dateOfService),
			services: bodydata.services,
			billAmount: bodydata.billAmount,
			successfullyApplied: false,
			businessOrderId: bodydata.businessOrderId,
			locationOfService: bodydata.orderLocationOfService,
			finalAmount: bodydata.finalAmount
		};
		return query;
	}
};