function schemeBase(scheme){    //init metadata as per schema
    if (scheme == undefined || scheme == null) scheme = {
        "metadata": {},
        "behavior": {}
    };

    var metadata = {
        name: "",
        type: "",
        createdBy: "",
        published: false,
        defaultLife: "",
        toIds: []
    };

    //init behavior as per schema
    var behavior = {
        defaultDiscount: 0,
        maximumUsages: 0,
        startDate: "",
        endDate: "",
        discountType: "%",
        locationOfServices: [{
            locations: []
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

    return scheme;

}
var module = module || {};
if (typeof module != undefined && module != null && module.exports) module.exports = schemeBase();


console.log(schemeBase().metadata, schemeBase().behavior);