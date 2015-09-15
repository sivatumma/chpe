module.exports = function(mongoose) {

	var Schema = mongoose.Schema;
	var serverConfig = require("./serverConfig.js")
	var _ = require('lodash');

	var schemeSchema = Schema({
		//	Metadata to be used while creating the scheme. 
		//	These fields collectively identify a scheme uniquely
		metadata: {
			name: {
				type: String,
				//required: true,
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
			locations: [{
				type: String
			}],
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
			createdLatlng: {

			},
			published: {
				type: Boolean
			},
			type: {
				type: String,
				enum: "ADD_ON,COUPON,GIFT_CARD".split(","),
				//required: true
			},
			defaultLife: {
				//required: false,
				type: String,
				enum: ",REGULAR,DAY,WEEK,MONTH".split(","),
				default: "REGULAR"
			}
		},

		//	This is the specification of the Scheme. 
		//	A scheme's behaviour can not be altered once published
		behaviour: {
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
				type: String
			},

			defaultDiscount: {
				type: Number
			},

			startDate: {
				type: Date
			},

			endDate: {
				type: Date
			},

			discount: {

				type: Number
			},
			// Service Rate Categories (SRC imply High Margin, low margin kind 
			// of products categorized, grouped already)
			serviceRateCategoryDiscounts: [{
				srcTypes: [{
					type: String
				}],
				discount: {
					type: Number
				},
				discountType: {
					type: String
				},
				discountLength: {
					type: Number,
					default: 1
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

			doctorLevelDiscounts: {
				"systemAllocationDiscount": {
					type: Number
				},
				"systemAllocationDiscountType": {
					type: String,
					enum: "Flat,%".split(",")
				},
				"userChosenDiscount": {
					type: Number
				},
				"userChosenDiscountType": {
					type: String,
					enum: "Flat,%".split(",")
				},
				"userChosenDiscountLength": {
					type: Number,
					default: 1
				},
				"systemChosenDiscountLength": {
					type: Number,
					default: 1
				},
			},

			modeOfPaymentDiscounts: [{

				mop: {
					type: String,
					enum: "ePay,cod,cheque".split(",")


				},
				discount: {
					type: Number
				},
				discountType: {
					type: String
				},
				discountLength: {
					type: Number,
					default: 1
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
				discountLength: {
					type: Number,
					default: 1
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
				myChips: {},
				locations: [{
					type: String
				}]
			}],

			serviceLevelDiscounts: [{
				selectedServices: {},
				services: [{
					type: String
				}],
				discount: {
					type: Number
				},
				discountLength: {
					type: Number,
					default: 1
				},
				discountType: {
					type: String
				}
			}],

			createdAt: {
				type: Date
			},

			updateAt: {

				type: Date
			}
		}

		//	This is a record of all the usages
		//	Somethings are provided by businesses, 
		//	some we will have to note for our analysis
	});

	schemeSchema.couponValidate(next) {
		if (this.metadata.defaultLife !== undefined) {
			var startDate = new Date(this.behaviour.startDate);
			var daysCount = {
				"DAY": 1,
				"WEEK": 7,
				"MONTH": 30
			};
			this.behaviour.endDate = startDate;
			this.behaviour.endDate.setDate(startDate.getDate() + daysCount[this.metadata.defaultLife]);
		}

		if (this.behaviour && !this.behaviour.startDate) {
			this.behaviour.startDate = this.behaviour.endDate = new Date(),
				this.behavior.endDate.setFullYear(this.behaviour.endDate.getFullYear() + 10);
		}

		this.behaviour.maximumUsages = this.behaviour.maximumUsages || 15;
		this.behaviour.defaultDiscount = this.behaviour.defaultDiscount || 0;
		this.behaviour.discountType = this.behaviour.discountType || '%';

	}

	var validators = {"COUPON":couponValidate, "GIFT_CARD":giftCardValidate, "ADD_ON": addOnValidate};

	schemeSchema.pre('save', function(next) {

		validators[this.metadata.type]();
		if (this.behaviour.locationOfServices[0].locations.length <= 0) {


			this.behaviour.locationOfServices = [{

					"myChips": [{
						"_lowername": "alllocation",
						"name": "AllLocation"
					}],

					"locations": [
						"AllLocation"
					]
				}

			];


		}



		if (this.behaviour.discountType == "%" && this.behaviour.defaultDiscount > 9) {
			return next(new Error("defaultDiscount should be below 9 percentage"));
		}



		//service Discount validate


		var serviceDiscount = _.map(this.behaviour.serviceLevelDiscounts, function(x) {
			if (x.discountType == "%") {
				return x.discount;

			}
		});


		var serviceMaxval = _.max(serviceDiscount, function(serviceDiscount) {
			return serviceDiscount;
		});


		if (serviceMaxval > 9) {

			return next(new Error("serviceLevelDiscount should be below 9"));
		}



		//billValueDiscount validate

		var billValueDiscounts = _.map(this.behaviour.billValueDiscounts, function(x) {

			if (x.discountType == "%") {
				return x.discount;

			}
		});

		var billMaxval = _.max(billValueDiscounts, function(billValueDiscounts) {

			return billValueDiscounts;

		});
		if (billMaxval > 9) {

			return next(new Error("billValueDiscounts should be below 9"));
		}



		//serviceRateCategoryDiscounts validate

		var serviceRateCategoryDiscounts = _.map(this.behaviour.serviceRateCategoryDiscounts, function(x) {
			if (x.discountType == "%") {
				return x.discount;
			}
		});
		var serviceRateMaxVal = _.max(serviceRateCategoryDiscounts, function(serviceRateCategoryDiscounts) {

			return serviceRateCategoryDiscounts;
		});

		if (serviceRateMaxVal > 9) {
			return next(new Error("serviceRateCategoryDiscounts should be below 9"));
		}



		//doctorLevelDiscounts


		if ((this.behaviour.doctorLevelDiscounts.userChosenDiscount > 9 && this.behaviour.doctorLevelDiscounts.userChosenDiscountType == "%") || (this.behaviour.doctorLevelDiscounts.systemAllocationDiscount > 9 && this.behaviour.doctorLevelDiscounts.systemAllocationDiscountType == "%")) {

			return next(new Error("doctorLevelDiscounts discount should be less than 9"));

		}

		//modeOfPaymentDiscounts validate

		var discountPayment = null;



		_.each(this.behaviour.modeOfPaymentDiscounts, function(single, index) {

			if (single.discount > config[config.loginuser].Discount && single.discountType == "%")

			{


				return next(new Error(single.mop + "- NOT ALLOW DISCOUNT MORE THAN 9"))

			}
		})

		next();
	});


	var Scheme = mongoose.model('Scheme', schemeSchema);

	return Scheme;

}