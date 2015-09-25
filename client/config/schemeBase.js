function schemeBase(scheme){    //init metadata as per schema
    if (scheme == undefined || scheme == null) scheme = {
        "metadata": {},
        "behavior": {}
    };

    var metadata = {
        name: "",
        createdBy: "",
        toIds: [{id:1,name:""}],
        userID:"",
        location:{longitude:0, latitude:0,ip:""},
        published: false,
        type: "",
        defaultLife: "",
    };

    //init behavior as per schema
    var behavior = {
        maximumUsages: 0,
        startDate: "",
        endDate: "",
        discountType: "%",
        discount: 0,
        locationOfServices:[],
        serviceRateCategoryDiscounts: [{
            discount: 0,
            discountType: "%",
            srcTypes: [],
            maxLength:9
        }],
        serviceLevelDiscounts: [{
            discount: 0,
            discountType: "%",
            services: [],
            maxLength:9
        }],
        cumulativeAmountPoints: [{
            amount: 0,
            points: 0
        }],
        doctorLevelDiscounts: [
            {type:"user",discount:0,discountType:"%",maxLength:9},
            {type:"system",discount:0,discountType:"%",maxLength:9}
        ],
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
            discountType: "%",
            maxLength:9
        }],
      modeOfPaymentDiscounts: [{
         mop:"",
         discount: 0,
         discountType:"%",
         maxLength:9
        }]
    };

    scheme.metadata = metadata;
    scheme.behavior = behavior;

    return scheme;

}
var module = module || {};
if (typeof module != undefined && module != null && module.exports) module.exports = schemeBase();


console.log(schemeBase().metadata, schemeBase().behavior);
