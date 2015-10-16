
var chUtils = require('../../lib/chUtils.js').chUtils;
module.exports = {

	createSchema: function(data) {

		return data;
	},
	updateSchema : function(data)
	{
		var query = {"metadata.name":data.metadata.name};

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
	saveOrder: function(bodydata,data)
	{

		if (data[0].metadata.type != "ADD_ON") {

			bodydata.finalAmount = chUtils.callDiscount(bodydata.billAmount, data[0].behavior.discount, data[0].behavior.discountType);
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