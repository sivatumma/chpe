var chUtils = require('../../lib/chUtils.js').chUtils;
var _ = require('lodash');

module.exports = {
	calculateSLDiscounts: function(serviceLevelDiscounts, bodydata) {
		var servicelevel = _.filter(serviceLevelDiscounts, function(item) {
			var finalservice = _.intersection(item._services, bodydata.services);
			if (finalservice.length == item._services.length)
				return item;
		});
		var discountAmount = chUtils.callDiscount(bodydata.servicesAmount, servicelevel[0].discount, servicelevel[0].discountType);
		return discountAmount;
	},
	calculateSRCDiscounts: function(SRCData,SRCAmount,SRCServices) {
		var SRCDiscount = _.filter(SRCData, function(item) {
			var finalservice = _.intersection(item._srcTypes, SRCServices);
			if (finalservice.length == item._srcTypes.length)
				return item;
		});
		var discountAmount = chUtils.callDiscount(SRCAmount, SRCDiscount[0].discount, SRCDiscount[0].discountType);
		return discountAmount;
	},
	calculateDLDiscounts: function(DLData, DLAmount, DCType) {
		var doctorDiscount = _.filter(DLData, function(item) {
			if (item.type == DCType) return item;
		});
		var discountAmount = chUtils.callDiscount(DLAmount, doctorDiscount[0].discount, doctorDiscount[0].discountType);
		return discountAmount;
	},
	calcualateMOP: function(MOPData, MOPAmount, MOPType) {
		var MOPDiscount = _.filter(MOPData, function(item) {
			if (item.MOP == MOPType) return item;
		});
		var discountAmount = chUtils.callDiscount(MOPAmount, MOPDiscount[0].discount, MOPDiscount[0].discountType);
		return discountAmount;

	},
	calculateBVDiscount : function(BLSData,finalAmount)
	{
     var BLSDiscount =  _.filter(BLSData, function(item){ if(finalAmount > item.billRange.from && finalAmount < item.billRange.to) return item;});
     var discountAmount = chUtils.callDiscount(finalAmount,BLSData[0].discount,BLSData[0].discountType);
     return discountAmount;
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
		var finalData ={};
		console.log("Inside saveOrder");
		if (data[0].metadata.type in ["GIFT_CARD", "COUPON"]) {
			bodydata.finalAmount = chUtils.callDiscount(bodydata.billAmount, data[0].behavior.discount, data[0].behavior.discountType);
		} else if (data[0].metadata.type == "ADD_ON") {
		finalData.billAmount    = parseInt(bodydata.servicesAmount) + parseInt( bodydata.doctorAmount) + parseInt(bodydata.SRCAmount);
		finalData.SLDisocunt  = this.calculateSLDiscounts(data[0].behavior.serviceLevelDiscounts, bodydata);
        finalData.DLDiscount  = this.calculateDLDiscounts(data[0].behavior.doctorLevelDiscounts,bodydata.doctorAmount,bodydata.doctorChoiceType);
	    finalData.SRCDiscount = this.calculateSRCDiscounts(data[0].behavior.serviceRateCategoryDiscounts,bodydata.SRCAmount,bodydata.SRCServices);
	    var finalAmount       = parseInt(finalData.billAmount) - parseInt(finalData.SLDisocunt)- parseInt(finalData.DLDiscount)- parseInt(finalData.SRCDiscount);
        finalData.BLS        = this.calculateBVDiscount(data[0].behavior.billValueDiscounts,finalAmount);
        finalAmount          = finalData.billAmount  -  finalData.SLDisocunt -finalData.DLDiscount - finalData.BLS-finalData.SRCDiscount;
        finalData.MOP        = this.calcualateMOP(data[0].behavior.modeOfPaymentDiscounts,finalAmount);
		finalData.finalAmount = parseInt(finalAmount)- parseInt(finalData.MOP);

		}
		var query = {
			schemeName: bodydata.name,
			userId: bodydata.userId,
			businessName: bodydata.businessName,
			dateOfService: new Date(bodydata.dateOfService),
			services: bodydata.services,
			billAmount: finalData.billAmount,
			successfullyApplied: false,
			businessOrderId: bodydata.businessOrderId,
			locationOfService: bodydata.orderLocationOfService,
			finalAmount:finalData.finalAmount
		};
		return query;
	}
};