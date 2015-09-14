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
    maximumUsages: "",
    startDate: "",
    endDate: "",
    discountType:"%",
    locationOfServices: [{
    	locations:[]
    }],
    serviceRateCategoryDiscounts: [{
        discount: "",
        discountType: "%",
        srcTypes: []
    }],
    serviceLevelDiscounts: [{
        discount: "",
        discountType: "%",
        services: []
    }],
    cumulativeAmountPoints: [{
        amount: "",
        points: ""
    }],
    doctorLevelDiscounts: {
        userChosenDiscountType: "%",
        doctorChosenDiscountType: "%"
    },
    advancePaidDiscounts: [{
        points: "",
        amount: ""
    }],
    billValueDiscounts: [{
        billRange: {
            from: "",
            to: ""
        },
        discount: "",
        discountType: "%"
    }],
    modeOfPaymentDiscounts: [{
        epay: {
            discount: "",
            discountType: "%"
        },
        cod: {
            discount: "",
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
