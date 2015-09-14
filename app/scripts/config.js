var schemeData = {};
var metadata = {};
var behaviour = {};
var restApiUrls = {};
var constants = {};
var stateVariables = {};

//setting constants

constants = {
	apiHost:'http://localhost:90/api/pricingengine'
};

//init metadata as per schema
metadata = {
    name: "",
    type: "",
    createdBy: "",
    published: false,
    defaultLife: "",
    toIds: []
};

//init behaviour as per schema
behaviour = {
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
        points: 100
    }],
    doctorLevelDiscounts: {
        userChosenDiscountType: "%",
        doctorChosenDiscountType: "%"
    },
    advancePaidDiscounts: [{
        points: 100,
        amount: 0
    }],
    billValueDiscounts: [{
        billRange: {
            from: 1000,
            to: 1000
        },
        discount: 1,
        discountType: "%"
    }],
    modeOfPaymentDiscounts: [{
        epay: {
            discount: 1,
            discountType: "%"
        },
        cod: {
            discount: 2,
            discountType: "%"
        }
    }]
};

//declaring state variables
stateVariables = {
		isLoggedIn:false , 
		schemeType:""
	};

//setting restApiUrls 

restApiUrls = {
	scheme:{
		basic:constants.apiHost+'?API_KEY=MEDIBUS-12ed15e7-bc20-45c5-88dc-684bb32a9dd9'
	}
};
