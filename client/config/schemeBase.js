var scheme = {};
var metadata = {};
var behavior = {};

//init metadata as per schema
metadata = {
    name: "",
    type: "",
    createdBy: "",
    published: false,
    defaultLife: "",
    toIds: []
};

//init behavior as per schema
behavior = {
	defaultDiscount:0,
    maximumUsages: 0,
    startDate: "",
    endDate: "",
    discountType:"%",
    locationOfServices: [{
    	locations:[]
    }],
    serviceRateCategoryDiscounts: [{
        discount: 0,
        discountType: "%",
        srcTypes: []
    }],
    serviceLevelDiscounts: [{
        discount: 0,
        discountType: "%",
        services: []
    }],
    cumulativeAmountPoints: [{
        amount: 0,
        points: 0
    }],
    doctorLevelDiscounts: {
        userChosenDiscountType: "%",
        doctorChosenDiscountType: "%"
    },
    advancePaidDiscounts: [{
        points: 0,
        amount: 0
    }],
    billValueDiscounts: [{
        billRange: {
            from: 0,
            to: 0
        },
        discount: 0,
        discountType: "%"
    }],
    modeOfPaymentDiscounts: [{
        epay: {
            discount: 0,
            discountType: "%"
        },
        cod: {
            discount: 0,
            discountType: "%"
        }
    }]
};

scheme.metadata = metadata;
scheme.behavior = behavior;


//module.export = scheme;