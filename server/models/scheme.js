"use strict";

var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	config = require("../config/config.js"),
	schemeBase = require('../../client/config/schemeBase.js'),
	_ = require('lodash');
module.exports = function(mongoose) {
	var schemeSchema = Schema({
		orders: [{
			type: Schema.Types.ObjectId,
			ref: 'order'
		}],
		metadata: {
			name: {
				type: String,
				required: true,
				index: {
					unique: true
				}
			},
			toIds: [{
				id: {
					type: Number
				},
				name: {
					type: String
				}
			}],
			userID: {
				//  MCID
				type: String /* This should be unique across all the businesses that request our services    */
			},
			createdBy: {
				type: String
			},
			creationTime: {
				type: Date,
				default: Date.now()
			},
			lastUpdated: {
				type: Date,
			},
			lastUpdatedBy: {
				type: String
			},
			location: {},
			published: {
				type: Boolean
			},
			type: {
				type: String,
				enum: "ADD_ON,COUPON,GIFT_CARD".split(","),
				required: true
			},
			defaultLife: {
				//required: false,
				type: String,
				enum: ",REGULAR,DAY,WEEK,MONTH".split(","),
				default: "REGULAR"
			}
		},
		behavior: {
			maximumUsages: {
				type: Number
			},
			startDate: {
				type: Date
			},
			endDate: {
				type: Date
			},
			discountType: {
				type: String,
				enum: "%,FLAT".split(","),
				default: "%"
			},
			discount: {
				type: Number
			},
			discountPattern:{
				type:String
			},
			// validityPeriod: [{
			// 	startDate: {
			// 		type: Date
			// 	},
			// 	endDate: {
			// 		type: Date
			// 	}
			// }],
			// Service Rate Categories (SRC imply High Margin, low margin kind 
			// of products categorized, grouped already)
			serviceRateCategoryDiscounts: [{
				services: [{
					id: {
						type: Number
					},
					name: {
						type: String
					}
				}],

				_services:[
				{
                type: String
                
				}],

				discount: {
					type: Number
				},
				discountType: {
					type: String
				},
				maxLength: {
					type: Number
				},
				discountPattern:{
					type:String
				}
			}],
			advancePaidPoints: [{
				amount: {
					type: Number
				},
				points: {
					type: Number
				}
			}],
			doctorLevelDiscounts: [{
				type: {
					type: String
				},
				discount: {
					type: Number
				},
				discountType: {
					type: String
				},
				maxLength: {
					type: Number
				},
				discountPattern:{
					type:String
				}
			}],
			modeOfPaymentDiscounts: [{
				mop: {
					type: String,
					enum: ",EPAY,COD,CHEQUE".split(","),
					default: "EPAY"
				},
				discount: {
					type: Number
				},
				discountType: {
					type: String
				},
				maxLength: {
					type: Number,
					default: 9
				},
				discountPattern:{
					type:String
				}
			}],
			billValueDiscounts: [{
				billRange: {
					from: {
						type: Number
					},
					to: {
						type: Number
					}
				},
				discount: {
					type: Number
				},
				discountType: {
					type: String
				},
				maxLength: {
					type: Number,
					default: 1
				},
				discountPattern:{
					type:String
				}
			}],
			cumulativeAmountPoints: [{
				amount: {
					type: Number
				},
				points: {
					type: Number
				}
			}],
			locationOfServices: [{
				id: {
					type: Number
				},
				name: {
					type: String
				}
			}],
			serviceLevelDiscounts: [{
				services: [{
					id: {
						type: Number
					},
					name: {
						type: String
					}
				}],
				_services:[{

					type:String
				}],
				discount: {
					type: Number
				},
				maxLength: {
					type: Number,
					default: 9
				},
				discountType: {
					type: String
				},
				discountPattern:{
					type:String
				}
			}],
			createdAt: {
				type: Date
			},
			updateAt: {
				type: Date
			}
		}
	});
	schemeSchema.virtual("serviceLevelDiscounts._services").get(function() {
	    return _.pluck(this.serviceLevelDiscounts._services,"name");
	});
	schemeSchema.methods.beforeSaveDefaultValidation = function() {

		if (this.behavior && !this.behavior.startDate) {
			this.behavior.startDate = new Date();
			var d = new Date();
			d.setFullYear(d.getFullYear() + 10);
			this.behavior.endDate = d;
		}
		if (!this.behavior.maximumUsages) {
			this.behavior.maximumUsages = 15;

		}
		if (!this.behavior.defaultDiscount) {
			this.behavior.defaultDiscount = 0;
			this.behavior.discountType = '%';

		}
		// If locationOfServices empty here we adding Default Locations
		if (this.behavior.locationOfServices.length <= 0) {
			this.behavior.locationOfServices = [{
				id: 0,
				name: "AllLocation"
			}];

		}
		// If serviceRateCategoryDiscounts empty here we adding empty array

		console.log(typeof this.behavior.serviceRateCategoryDiscounts);
		if (typeof this.behavior.serviceRateCategoryDiscounts == undefined) {
				this.behavior.serviceRateCategoryDiscounts = [];
			}
			        
        // If serviceLevelDiscounts empty here we adding empty array

		if (typeof this.behavior.serviceLevelDiscounts == undefined) {
				this.behavior.serviceLevelDiscounts = [];
			}
			
		// If advancePaidPoints empty here we adding empty array

		if (typeof this.behavior.advancePaidPoints == undefined) {
			this.behavior.advancePaidPoints = [];
		}

		// If billValueDiscounts empty here we adding empty array

		if (typeof this.behavior.billValueDiscounts == undefined) {
			this.behavior.billValueDiscounts = [];
		}
		
		// If cumulativeAmountPoints empty here we adding empty array

		if (typeof this.behavior.cumulativeAmountPoints == undefined) {
			this.behavior.cumulativeAmountPoints = [];
		}
       
		// If cumulativeAmountPoints empty here we adding empty array
		if (typeof this.metadata.toIds == undefined) {
			this.metadata.toIds = [];
		}

		if (this.behavior.discountType == "%" && this.behavior.discount > 9) {

			return next(new Error("defaultDiscount should be below 9 percentage"));
		}
	};
	schemeSchema.methods.beforeSaveCouponValidation = function() {
		if (this.metadata.type == "COUPON" && this.metadata.defaultLife !== undefined) {
			var startDate = new Date(this.behavior.startDate);
			var daysCount = {
				"DAY": 1,
				"WEEK": 7,
				"MONTH": 30
			};
			this.behavior.endDate = startDate;
			this.behavior.endDate.setDate(startDate.getDate() + daysCount[this.metadata.defaultLife]);
		}
	};
	schemeSchema.methods.beforeSaveGiftCardValidation = function() {
		console.log(this.metadata.toIds.length);

		if (this.metadata.published == true && this.metadata.toIds.length > 0) {
			return next(new Error("Provide Benifecary"));
		}
	};
	schemeSchema.methods.beforeSaveAddOnValidation = function() {


var promise = new Promise(function(resolve, reject) {

		console.log("Inside promise");
		//service Discount validate
		var serviceDiscount = _.map(this.behavior.serviceLevelDiscounts, function(x) {
			if (x.discountType == "%") {
				return x.discount;
			}
		});

		var serviceMaxval = _.max(serviceDiscount, function(serviceDiscount) {
			return serviceDiscount;
		});

		if (serviceMaxval > 9) {

console.log("hwlo ");
			reject(new Error("serviceLevelDiscount should be below 9"));
			//return next(new Error("serviceLevelDiscount should be below 9"));
		}

		//billValueDiscount validate
		var billValueDiscounts = _.map(this.behavior.billValueDiscounts, function(x) {
			if (x.discountType == "%") {
				return x.discount;
			}
		});

		var billMaxval = _.max(billValueDiscounts, function(billValueDiscounts) {
			return billValueDiscounts;
		});

		if (billMaxval > 9) {

			reject(new Error("billValueDiscounts should be below 9"));
		}

		//serviceRateCategoryDiscounts validate
		var serviceRateCategoryDiscounts = _.map(this.behavior.serviceRateCategoryDiscounts, function(x) {
			if (x.discountType == "%") {
				return x.discount;
			}
		});

		var serviceRateMaxVal = _.max(serviceRateCategoryDiscounts, function(serviceRateCategoryDiscounts) {
			return serviceRateCategoryDiscounts;
		});

		if (serviceRateMaxVal > 9) {
		reject(new Error("serviceRateCategoryDiscounts should be below 9"));
		}

		//doctorLevelDiscounts
		if ((this.behavior.doctorLevelDiscounts.userChosenDiscount > 9 && this.behavior.doctorLevelDiscounts.userChosenDiscountType == "%") || (this.behavior.doctorLevelDiscounts.systemAllocationDiscount > 9 && this.behavior.doctorLevelDiscounts.systemAllocationDiscountType == "%")) {
			reject(new Error("doctorLevelDiscounts discount should be less than 9"));
		}

		//modeOfPaymentDiscounts validate
		var discountPayment = null;
		_.each(this.behavior.modeOfPaymentDiscounts, function(single, index) {
			if (single.discount > config.configVariable[config.configVariable.loginUser].Discount && single.discountType == "%") {
				reject(new Error(single.mop + "- NOT ALLOW DISCOUNT MORE THAN 9"))
			}
		});

});
 return promise;
	};

/*	schemeSchema.pre('save', function(next) {

		this.beforeSaveDefaultValidation();

		if (this.metadata.type == "COUPON") {
			this.beforeSaveCouponValidation();
		} else if (this.metadata.type == "ADD_ON") {
			this.beforeSaveAddOnValidation();
		} else if (this.metadata.type == "GIFT_CARD") {
			this.beforeSaveGiftCardValidation();
		}

		next();
	});*/
	schemeSchema.pre('update', function(next) {
		console.log(this.schema);
		// if (this.metadata.type == "COUPON") {
		// 	this.beforeSaveCouponValidation();
		// } else if (this.metadata.type == "ADD_ON") {
		// 	this.beforeSaveAddOnValidation();
		// } else if (this.metadata.type == "GIFT_CARD") {
		// 	this.beforeSaveGiftCardValidation();
		// }

		next(null, this);
	});

	var Scheme = mongoose.model('scheme', schemeSchema);
	return Scheme;
}