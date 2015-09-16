 var request = require('request');
 var mongoose = require('mongoose');
 var ObjectId = require('mongodb').ObjectID;
 var async = require('async');
 var _ = require('underscore');
 var requestify = require('requestify');

 var uuid = require('node-uuid');

 var logger = require('../log');

 var models = {
     "user": mongoose.model('User'),
     "scheme": mongoose.model("Scheme"),
     "product": mongoose.model("Product"),
     "associate": mongoose.model("Associate"),
     "consumer": mongoose.model("Consumer"),
     "newscheme": mongoose.model("NewScheme"),
     "order": mongoose.model("Order"),
     "diagnosticsmaster": mongoose.model("DiagnosticsMaster"),
 };
 var dxDiagMasterJsons = require('../api/dxDiagMasterJsons.js');

 var User = mongoose.model('User');
 var parseString = require('xml2js').parseString;
 var TIMEOUT = 30000;
 request.defaults({
     pool: {
         maxSockets: Infinity
     },
     gzip: true
 });

 var requestCount = 0;


 var callDiscount = function(actualAmount, discount, discountType) {
     var afterDiscount = "";

     if (discountType == "%") {
         afterDiscount = perfectValue(actualAmount - (actualAmount * discount / 100));

     }
     if (discountType == "Flat")

     {

         afterDiscount = perfectValue(actualAmount - discount);


     }
     return afterDiscount;


 };
 var proxy_route = function(url) {
     return function(req, res) {
         console.log("req.body before sending to provider API");
         console.log("=======================================");
         console.log(req.body);
         var proxy = null;
         console.log(req.method + " Request :->" + req.originalUrl);
         if (req.method == 'GET') {
             proxy = request.get({
                 uri: url,
                 qs: req.query,
                 timeout: TIMEOUT
             }, function(error, response, body) {
                 if (error) return res.send(500, error);
                 console.log('Response recieved:' + req.originalUrl);
             });
         } else {
             proxy = request[req.method.toLowerCase()]({
                 uri: url,
                 json: req.body,
                 timeout: TIMEOUT
             }, function(error, response, body) {
                 if (error) return res.send(500, error);
                 console.log('Response recieved from :' + req.originalUrl);
                 console.log("==================");
                 console.log(body);
             });
             // console.log(proxy);
         }
         req.pipe(proxy).pipe(res);
     }
 };

 module.exports = function(app) {
     // ...

     // development error handler
     // will print stacktrace
     if (app.get('env') === 'development') {

         app.use(function(err, req, res, next) {
             res.status(err.status || 500);
             res.render('error', {
                 message: err.message,
                 error: err
             });
         });

     }

     // production error handler
     // no stacktraces leaked to user
     app.use(function(err, req, res, next) {
         res.status(err.status || 500);
         res.render('error', {
             message: err.message,
             error: {}
         });
     });

     app.all('/api/associatePortal', User.authorize, proxy_route('/associatePortal'));
     app.all('/api/testPing', User.authorize, function(req, res) {
         res.send("Got the request to server. Success");
     });

     app.all('/api/pricingengine/percentiles', User.authorize, function(req, res) {
         var dataset = req.body;
         dataset.sort(function sortNumber(a, b) {
             return a - b;
         });

         var percentiles = "10,20,30,40,50,60,70,75,80,90,95,98,99,100".split(",");
         var percentileValues = {};
         percentiles.forEach(function(x, index) {
             var percentileIndex = Math.round(percentiles[index] / 100 * dataset.length);
             percentileValues[x] = dataset[percentileIndex];
         });

         console.log(percentiles, percentileValues);
         res.end(200, JSON.stringify(percentileValues));

     });

     app.get('/api/mcid', User.authorize, function(req, res) {

         var databaseType = req.query.databaseType;
         var connection, config = null;

         if (databaseType === "mysql") {
             var mysql = require('mysql');
             connection = mysql.createConnection({
                 host: '192.168.122.8',
                 path: '/phpmyadmin',
                 port: 3306,
                 user: 'mcitrng',
                 password: 'xE2LCJerQdXGpLPZ',
                 database: 'mcitrng'
             });
         } else if (databaseType === "mssql") {
             var mssql = require('mssql');
             config = {
                 user: 'mcitrng',
                 password: 'xE2LCJerQdXGpLPZ',
                 server: 'http://192.168.122.8', // You can use 'localhost\\instance' to connect to named instance
                 database: 'mcitrng',

                 // options: {
                 //     encrypt: true // Use this if you're on Windows Azure
                 // }
             };
         }

         connection.connect();
         connection.query('SELECT user_name FROM user', function(err, rows, fields) {
             if (err) {
                 console.log(err.stack);
                 res.end(JSON.stringify({
                     "status": false,
                     "message": "Some Error while fetching the data"
                 }));
             }
             res.end(JSON.stringify(_.pluck(rows, "user_name")));
         });

         connection.end();

     });

     app.get('/api/pricingengine/staticChips/:tagId', User.authorize, function(req, res) {
         res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
         res.header('Access-Control-Allow-Methods', 'GET');
         res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');

         var serviceRateCategories = ["High Margin Products", "Mid Margin Products", "Low Margin Products", "Statewide Products", "Pan India Products"];
         var services = ["eConsultation", "Drugs", "Delivery", "Diagnostics", "Facilitation", "Care"];
         var mcid = ["Suresh", "Siva", "Mahesh", "Rakesh", "Rajesh", "Sowjanya", "Ajith", "Inthiyaz"];
         var locations = ["Hyderabad", "Vizag", "Vizianagaram", "Vijayawada", "Rohtang"];

         console.log(req.param("tagId"));

         switch (req.param("tagId")) {
             //  Medibus context
             case "serviceRateCategories":
                 res.end(JSON.stringify(serviceRateCategories));
                 break;
             case "services":
                 res.end(JSON.stringify(services));
                 break;
             case "mcid":
                 res.end(JSON.stringify(mcid));
                 break;
             case "locations":
                 res.end(JSON.stringify(locations));
                 break;
             default:
                 res.status(400).end(JSON.stringify({
                     "status": "Fail",
                     "message": "There is no tag for data criteria., /:tagId must be one of [serviceRateCategories, services,mcid]"
                 }));
         }
     });

     app.post('/api/pricingengine/bulk', User.authorize, function(req, res) {

         var dxMasterData = dxDiagMasterJsons();
         dxMasterData = _.map(dxMasterData, function(one) {
             return _.extend(one, {
                 price: 0
             });
         });
         console.log(dxMasterData);
         var dxDocument = models["diagnosticsmaster"];

         dxDocument.collection.insert(dxMasterData, onInsert);

         function onInsert(err, docs) {
             if (err) {
                 // TODO: handle error
                 res.send("Error while inserting");
                 console.log("Error while inserting ", docs.length);
             } else {
                 console.info('%d Diagnostics data were successfully stored.', docs.length);
             }
         } // var bulk = db.diagnosticsmasters.initializeUnorderedBulkOp();
         // console.log(dxDiagMasterJsons());
         res.end("Successfully done");

     });

     app.get('/api/pricingengine/overview', User.authorize, function(req, res) {



         models["newscheme"].find({
                 "behavior.startDate": {
                     $lte: new Date()
                 },
                 "behavior.endDate": {
                     $lte: new Date(new Date().setDate(new Date().getDate() + 7))
                 }
             },

             function(err, updateData) {
                 this.finalData = {};
                 var self = this;

                 self.finalData.expiring = _.countBy(updateData, function(data) {

                     if (data.metadata.type == 'COUPON') return "COUPON";
                     if (data.metadata.type == 'ADD_ON') return "ADD_ON";
                     if (data.metadata.type = "GIFT_CARD") return "GIFT_CARD";
                 })
                
                 models["newscheme"].find({},

                     function(err, allData) {


                         self.finalData.totals = _.countBy(allData, function(data) {

                             if (data.metadata.type == 'COUPON') return "COUPON";
                             if (data.metadata.type == 'ADD_ON') return "ADD_ON";
                             if (data.metadata.type = "GIFT_CARD") return "GIFT_CARD";
                         });

                     });


                 var display = function(data, callback) {



                     models["order"].find().distinct("userId", function(error, orderUsers) {


                         self.finalData.totals = self.finalData.totals || {};
                         self.finalData.totals.people = orderUsers.length;

                         callback(null);

                     });



                 }

                 async.map([1], display, function(err, result) {
                     res.end(JSON.stringify(self.finalData));
                 });



             });

         //   res.end(JSON.stringify({"status":"Fail",message:"Functionality coding is not done"}));


     });

     app.all('/api/pricingengine', User.authorize, function(req, res) {

         logger.info('/api/pricingengine is accessed');

         console.log("Got the ", ++requestCount, "- th request");
         console.log(typeof req.body, req.body);

         res.header('Access-Control-Allow-Origin', req.headers.origin || "*");
         res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,HEAD,DELETE,OPTIONS');
         res.header('Access-Control-Allow-Headers', 'content-Type,x-requested-with');

         if (req.body.operation == "find") {
             console.log(req.body.operation);
             if (req.body.type != undefined && req.body.userName != undefined) {
                 var filterQuery = {
                     "metadata.type": req.body.type,
                     "metadata.createdBy": req.body.userName
                 };
             } else {
                 var filterQuery = req.body.names ? {
                     "metadata.name": {
                         $in: req.body.names
                     }
                 } : null;

             }
             if (req.body.category !== undefined) {
                 var filterQuery = {
                     "category": req.body.category
                 };
             }
             models[req.body.on].find(filterQuery, function(err, schemes) {
                 if (err) res.end("" + err);
                 // console.log(JSON.stringify(schemes, "\t", null));
                 res.end(JSON.stringify(schemes, "\t", null));
             });

         } else if (req.body.operation == "create") {
            console.log(JSON.stringify(req.body.behavior.serviceLevelDiscounts));

             if (req.body.on === "diagnosticsMaster") {
                 console.log("Saving  diagnosticsMaster...");
                 req.body._id = uuid.v4();
                 var m1 = models['diagnosticsmaster'](req.body);
                 m1.save(function(err, data) {
                     if (err) {
                         console.log(err.stack);
                         logger.log('error', err.stack);
                         res.status(500);
                         res.end(JSON.stringify(err, "\t", null));
                     }
                     // console.log(data);
                     res.end(JSON.stringify(data, "\t", null));
                     return;
                 });
             }

             var user = req.user || {};
             user.username = user.username || req.query.API_KEY;

             if (req.body.behavior && !req.body.behavior.startDate) {
                 req.body.behavior.startDate = new Date();

                 var d = new Date();

                 d.setFullYear(d.getFullYear() + 10);

                 req.body.behavior.endDate = d;

             }
             if (!req.body.behavior.maximumUsages) {
                 req.body.behavior.maximumUsages = 15;
             }
             if (!req.body.behavior.defaultDiscount) {

                 req.body.behavior.defaultDiscount = 0;
                 req.body.behavior.discountType = '%';
             }
             if (req.body.behavior.locationOfServices[0].locations.length <= 0) {

                 req.body.behavior.locationOfServices = [{

                         "myChips": [{
                             "_lowername": "alllocation",
                             "name": "AllLocation"
                         }],

                         "locations": [
                             "AllLocation"
                         ]
                     }

                 ]
             }

             if (req.body.metadata.defaultLife == undefined)
                 req.body.metadata.defaultLife = "REGULAR";

             if (req.body.metadata.type == "COUPON" && req.body.metadata.defaultLife !== undefined) {
                 if(req.body.metadata.defaultLife!=="") {
                     var startDate = new Date(req.body.behavior.startDate);
                     var daysCount = {
                         "DAY": 1,
                         "WEEK": 7,
                         "MONTH": 30
                     };
                     req.body.behavior.endDate = startDate;

                     req.body.behavior.endDate.setDate(startDate.getDate() + daysCount[req.body.metadata.defaultLife]);

                 }
             }


             if (user && user.tokens && user.tokens[user.tokens.length - 1])
                 res.header("user", user.tokens[user.tokens.length - 1]);
             // Store the whole data in NewScheme model too
             var m1 = models['newscheme'](req.body);
             m1.behavior.locationOfServices = m1.behavior.locationOfServices || ["Hyderabad"];
             m1.save(function(err, data) {
                 if (err) {
                     logger.log('error', err.stack);
                     res.status(500);
                     res.end(JSON.stringify(err, "\t", null));
                 }
                 // console.log(data);
                 res.end(JSON.stringify(data, "\t", null));
             });


         } else if (req.body.operation == "update") {

             var user = req.user || {};
             if (user && user.tokens && user.tokens[user.tokens.length - 1])
                 res.header("user", user.tokens[user.tokens.length - 1]);
             var tofind = req.body._id;
             delete(req.body._id);

             req.body.metadata.lastUpdated = new Date().toISOString();
             if (user && user.username)
                 req.body.metadata.lastUpdatedBy = user.username;


             models["newscheme"].findOneAndUpdate({
                     _id: ObjectId(tofind)
                 },
                 req.body,
                 function(err, updateData) {

                     res.send(updateData);
                 })
         } else
             res.end(JSON.stringify({
                 "message": "Would serve the data shortly",
                 "status": "Fail"
             }));
     });


     app.put('/api/pricingengine/suggestDiscounts', User.authorize, function(req, res) {

         var user = req.user || {};
         if (user && user.tokens && user.tokens[user.tokens.length - 1]) {
             var tokenobject = {
                 token: user.tokens[user.tokens.length - 1].token,
                 token_created: user.tokens[user.tokens.length - 1].token_created,
                 token_expires: user.tokens[user.tokens.length - 1].token_expires
             };
             res.set(tokenobject);
         }

         var finalResult = {};
         models["newscheme"].find({
             "metadata.name": req.body.name,

             "behavior.locationOfServices.locations": {
                 $in: [req.body.locationOfService, "AllLocation"]
             },
             "behavior.startDate": {
                 $lte: new Date(req.body.orderDate)
             },
             "behavior.endDate": {
                 $gte: new Date(req.body.orderDate)
             },
             "metadata.toIds.to":req.body.userId,
             "metadata.published": true

         }, function(err, data) {
             console.log(data);

             if (!data) {
                 res.end(JSON.stringify({
                     "message": "No Valid Scheme with this criteria ",
                     "status": "Fail"
                 }));
             }

             if (data.length > 0) {

                 if (err) {
                     console.log('There was an error', err);
                     res.status(503).send(err);
                 }
                 // Steps : 
                 // 1.  Check the type
                 // 2.  If type is COUPON / GIFT_CARD, check for simple conditions, return discount applied bill / benefits
                 // 3.  If type is ADD_ON, check for complex conditions, apply discounts, return amount / benefits
                 // 4.  Set successfullyApplied Flag to false, wait for confirmation callback

                 try {
                     if (["COUPON", "GIFT_CARD"].indexOf(data[0].metadata.type) >= 0) {


                         models["order"].find({
                             schemeName: req.body.name,
                             userId: req.body.userId
                         }, function(err, orderData) {

                             if (err) {
                                 res.send(JSON.stringify({
                                     status: "DB error"
                                 }))
                             } else {
                                 var display = function(orderData, callback) {

                                     if (data[0].behavior.maximumUsages >= orderData + 1) {
                                         var discount = data[0].behavior.defaultDiscount;
                                         var ObjectId = mongoose.Types.ObjectId;
                                         var orderData = {
                                             schemeName: req.body.name,
                                             _id: new ObjectId(),
                                             userId: req.body.userId,
                                             businessName: req.body.businessName,
                                             dateOfService: new Date(req.body.dateOfService),
                                             services: req.body.services,
                                             billAmount: req.body.billAmount,
                                             successfullyApplied: false,
                                             businessOrderId: req.body.businessOrderId,
                                             locationOfService: req.body.orderLocationOfService
                                         };
                                         var m1 = models['order'](orderData);

                                         m1.save(function(err, dataOrder) {
                                             if (err) {

                                                 callback(null, "DB error");

                                             } else {
                                                 var finalAmount;
                                                 if (discount) {
                                                     finalAmount = callDiscount(req.body.billAmount, data[0].behavior.defaultDiscount, data[0].behavior.discountType);
                                                 } else {
                                                     finalAmount = req.body.billAmount;
                                                 }
                                                 console.log(ObjectId);
                                                 var finalData = [{
                                                     "orderID": dataOrder._id,
                                                     "locationOfService": req.body.locationOfService,
                                                     "UserID": req.body.userId,
                                                     "name": req.body.name,
                                                     "billAmount": req.body.billAmount,
                                                     "discount": discount,
                                                     "discountType": data[0].behavior.discountType,
                                                     "finalAmount": finalAmount,
                                                     "status": "success"

                                                 }];

                                                 callback(null, finalData);

                                             }
                                         })



                                     } else {
                                         var errormsg = [{
                                             "status": "Fail",
                                             "message": "Completed Maximum Usages"
                                         }];
                                         callback(null, errormsg);

                                     }
                                 };

                                 async.map([orderData.length], display, function(err, result) {


                                     res.status(200).end(JSON.stringify(
                                         result[0]
                                     ));
                                 })


                             }
                         })

                     } else if (data[0].metadata.type === "ADD_ON") {

                         if (data.length > 0) {

                             models["order"].find({
                                 schemeName: req.body.name,
                                 userId: req.body.userId
                             }, function(err, orderData) {

                                 if (err) {
                                     res.send(JSON.stringify({
                                         status: "DB error"
                                     }))
                                 } else {


                                     if (data[0].behavior.maximumUsages >= orderData.length + 1) {

                                         var serverArray = data[0].behavior.serviceLevelDiscounts[0].services;
                                         var databaseArray = req.body.services;
                                         var status = serverArray.equals(databaseArray);
                                         var dataAfterDiscount = [];
                                         var discountAmount = 0;
                                         var discount = 0;
                                         var doctorDiscountAmount = 0;
                                         var doctorDiscount = 0;
                                         var serviceDiscount = 0;
                                         var serviceDiscountType = "";
                                         var finalAmount = 0;


                                         var display = function(sing, callback) {



                                             var serverArray = sing.services;
                                             var databaseArray = req.body.services;

                                             var status = serverArray.equals(databaseArray);
                                             var finalservice=  _.intersection(serverArray,databaseArray);
                                             if (finalservice.length === serverArray.length)
                                              {

                                                 discountAmount = callDiscount(req.body.servicesAmount, sing.discount, sing.discountType)
                                                 serviceDiscount = sing.discount;
                                                 serviceDiscountType = sing.discountType;

                                                 finalResult.serviceActualAmount = req.body.servicesAmount;
                                                 finalResult.serviceDiscount = serviceDiscount;
                                                 finalResult.serviceDiscountType = serviceDiscountType;
                                                 finalResult.serviceAfterDiscountAmount = discountAmount;

                                                 callback(null,"Service Added");

                                             } else {
                                                 callback(null,"Service Not Added");
                                             }
                                         };



                                         async.map(data[0].behavior.serviceLevelDiscounts.sort(), display, function(err, result) {
                                           if(result=="Service Not Added")
                                           {

                                             res.send(JSON.stringify({
                                 status: "Fail",
                                 'message': 'No Services Are Avaliable'
                             }));


                                           }

                                             var ObjectId = mongoose.Types.ObjectId;
                                             var orderData = {
                                                 schemeName: req.body.name,
                                                 _id: new ObjectId(),
                                                 userId: req.body.userId,
                                                 businessName: req.body.businessName,
                                                 dateOfService: new Date(req.body.dateOfService),
                                                 services: req.body.services,
                                                 billAmount: req.body.billAmount,
                                                 successfullyApplied: false,
                                                 businessOrderId: req.body.businessOrderId,
                                                 locationOfService: req.body.orderLocationOfService
                                             };
                                             var m1 = models['order'](orderData);
                                             m1.save(function(err, dataOrder) {
                                                 // console.log(data);

                                                 if (err) {
                                                     res.status(503).end(JSON.stringify({
                                                         status: "DB error" + err.message
                                                     }));
                                                 } else {

                                                     finalResult.name = req.body.name;
                                                     finalResult.orderId = dataOrder._id;
                                                     finalResult.userId = req.body.userId;
                                                     finalResult.locationOfService = req.body.locationOfService;
                                                     if (req.body.doctorAmount != undefined) {
                                                         if (req.body.doctorChoiceType == "system") {
                                                             doctorDiscount = data[0].behavior.doctorLevelDiscounts.systemAllocationDiscount;


                                                             if (doctorDiscount > 0 && req.body.doctorAmount > 0) {
                                                                 doctorDiscountAmount = callDiscount(req.body.doctorAmount, data[0].behavior.doctorLevelDiscounts.systemAllocationDiscount, data[0].behavior.doctorLevelDiscounts.systemDiscountType);


                                                             } else {
                                                                 doctorDiscountAmount = req.body.doctorAmount;

                                                             }
                                                         }
                                                         if (req.body.doctorChoiceType == "user") {
                                                             doctorDiscount = data[0].behavior.doctorLevelDiscounts.userChosenDiscount;

                                                             if (doctorDiscount > 0 && req.body.doctorAmount > 0) {
                                                                 doctorDiscountAmount = callDiscount(req.body.doctorAmount, data[0].behavior.doctorLevelDiscounts.userChosenDiscount, data[0].behavior.doctorLevelDiscounts.userChosenDiscountType);

                                                             } else {
                                                                 doctorDiscountAmount = req.body.doctorAmount;
                                                             }
                                                         }
                                                         finalResult.doctorActualAmount = req.body.doctorAmount;
                                                         finalResult.doctorDiscount = doctorDiscount;
                                                         finalResult.doctorDiscountType = data[0].behavior.doctorLevelDiscounts.systemAllocationDiscountType;
                                                         finalResult.doctorAfterDiscountAmount = doctorDiscountAmount;

                                                     }

                                                     if (req.body.modeOfPayment != undefined) {


                                                         if (req.body.modeOfPayment == 'cod')

                                                         {
                                                             finalAmount = callDiscount(discountAmount + doctorDiscountAmount, data[0].behavior.modeOfPaymentDiscounts.cod.discount, data[0].behavior.modeOfPaymentDiscounts.cod.discountType);

                                                         } else if (req.body.modeOfPayment == 'epay')

                                                         {
                                                             finalAmount = callDiscount(discountAmount + doctorDiscountAmount, data[0].behavior.modeOfPaymentDiscounts.epay.discount, data[0].behavior.modeOfPaymentDiscounts.epay.discountType);

                                                         } else if (req.body.modeOfPayment == 'cheque')

                                                         {
                                                             finalAmount = callDiscount(discountAmount + doctorDiscountAmount, data[0].behavior.modeOfPaymentDiscounts.cheque.discount, data[0].behavior.modeOfPaymentDiscounts.cheque.discountType);

                                                         } else {
                                                             finalAmount = discountAmount + doctorDiscountAmount;

                                                         }
                                                     } else {

                                                         finalAmount = discountAmount + doctorDiscountAmount;
                                                     }

                                                     if (data[0].behavior && data[0].behavior.billValueDiscounts[0] && data[0].behavior.billValueDiscounts[0].billRange.from) {

                                                         if (finalAmount > data[0].behavior.billValueDiscounts[0].billRange.from && finalAmount < data[0].behavior.billValueDiscounts[0].billRange.to) {
                                                             finalResult.finalAmount = callDiscount(finalAmount, data[0].behavior.billValueDiscounts[0].discount, data[0].behavior.billValueDiscounts[0].discountType);
                                                         } else {
                                                             finalResult.finalAmount = finalAmount;
                                                         }
                                                     } else {
                                                         finalResult.finalAmount = finalAmount;
                                                     }


                                                     finalResult.status = "success";

                                                     res.send(JSON.stringify(finalResult));


                                                 }
                                             })


                                         })



                                     } else {


                                         res.status(200).end(JSON.stringify({
                                             status: "Completed Maximum Usages"
                                         }))
                                     }


                                 }
                             })

                         } else {
                             res.send(JSON.stringify({
                                 status: "Fail",
                                 'Error': 'No Scheme with requested identity'
                             }));
                         }
                         // }
                     }
                 } catch (e) {
                     console.log(e);
                     res.status(503).send(e);

                 }
             } else {
                 //  res.send(req.body)
                 res.status(200).end(JSON.stringify({
                     "status": "Fail",
                     "message": "No Valid Scheme with this criteria"
                 }));
             }
         });

     });

     app.put('/api/pricingengine/schemeAppliedSuccessfully', User.authorize, function(req, res) {

         var user = req.user || {};
         if (user && user.tokens && user.tokens[user.tokens.length - 1]) {
             var tokenobject = {
                 token: user.tokens[user.tokens.length - 1].token,
                 token_created: user.tokens[user.tokens.length - 1].token_created,
                 token_expires: user.tokens[user.tokens.length - 1].token_expires
             };
             res.set(tokenobject);
         }

         models["newscheme"].find({
             "metadata.name": req.body.name
         }, function(err, data) {


             if (err) {

                 res.send(JSON.stringify({
                     status: "DB error" + err.message
                 }))
             } else {


                 if (data.length > 0) {



                     models["order"].find({
                         schemeName: req.body.name
                     }, function(err, orderData) {

                         if (err) {
                             res.send(JSON.stringify({
                                 status: "DB error" + err.message
                             }))
                         } else {
                             if (orderData.length > 0) {

                                 if (data[0].behavior.maximumUsages >= orderData.length) {



                                     function display(sing, callback) {



                                         models["order"].findOneAndUpdate({
                                             _id: sing,
                                             successfullyAvailed: false
                                         }, {
                                             $set: {

                                                 successfullyAvailed: true

                                             }
                                         }, function(err, dataOrder) {

                                             if (err) {
                                                 callback(null, "Fail");
                                             } else {

                                                 if (dataOrder) {
                                                     callback(null, "Success")
                                                 } else {
                                                     callback(null, "Fail");
                                                 }

                                             }
                                         })



                                     }
                                     async.map([req.body.orderId], display, function(err, result) {


                                         if (result[0] == "Success") {
                                             requestify.post('http://172.16.2.88:8080/WebApplication1/rest/martjack/pricingEngine', {
                                                     "schemeName": req.body.name,
                                                     "orderID": req.body.orderId,
                                                     "locationOfService": req.body.locationOfService,
                                                     "Amount": req.body.finalAmount,
                                                     "UserID": req.body.userId


                                                 })
                                                 .then(function(response) {
                                                     // Get the response body
                                                     response.getBody();
                                                 });



                                         }
                                         res.send(JSON.stringify({
                                             status: result[0]
                                         }));

                                     })
                                 } else {

                                     res.send(JSON.stringify({
                                         status: "Maximum Usage Completed"
                                     }))
                                 }

                             } else {

                                 res.send(JSON.stringify({
                                     status: "Invalid Service"
                                 }))
                             }
                         }

                     })
                 } else {

                     res.send(JSON.stringify({
                         status: "Invalid Service"
                     }))
                 }

             }

         })

     });


     app.get('/api/pricingengine/graphdata', User.authorize, function(req, res) {

         models["newscheme"].find({
             "metadata.name": req.query.name
         }, function(err, data) {
             if (err) {

                 res.send(JSON.stringify({
                     status: "DB error" + err.message
                 }))
             } else {

                 if (data.length > 0)

                 {
                     var locations = _.pluck(data[0].behavior.locationOfServices, 'locations');

                     models["order"].find({
                         schemeName: req.query.name

                     }, function(err, orderData) {

                         if (err) {
                             res.send(JSON.stringify({
                                 status: "DB error"
                             }))
                         } else {
                             var finalData = {};
                             finalData.name = data[0].metadata.name;
                             finalData.startDate = data[0].behavior.startDate;
                             finalData.endDate = data[0].behavior.endDate;


                             var orderIdData = _.countBy(orderData, function(obj) {
                                 return obj.userId;
                             });


                             var details = [];

                             for (var i in orderIdData) {

                                 var arr = {

                                     "orderId  ": i,
                                     "orderCount ": orderIdData[i]

                                 };
                                 details.push(arr);

                             }
                             var yearAndMonth = [];
                             var monthNames = ["January", "February", "March", "April", "May", "June",
                                 "July", "August", "September", "October", "November", "December"
                             ];

                             finalData.orderDetails = details;

                             var totalOrders = _.reduce(orderIdData, function(memo, num) {
                                 return memo + num;
                             }, 0);
                             finalData.totalOrders = totalOrders;

                             var totalAmount = _.reduce(_.pluck(orderData, 'billAmount'), function(memo, num) {
                                 return memo + num;
                             }, 0);
                             finalData.totalAmount = totalAmount;

                             var dates = _.pluck(orderData, 'dateOfService');

                             var monthWiseGroup = _.groupBy(dates, function(date) {
                                 return date.getMonth()
                             });

                             var a = [];
                             for (k in monthWiseGroup) {

                                 var yearMonth = {
                                     month: k,
                                     count: monthWiseGroup[k].length
                                 };


                                 yearAndMonth.push(yearMonth);

                             }



                             finalData.orderDates = yearAndMonth;
                             finalData.status = "success";
                             res.send(JSON.stringify(finalData));

                         }
                     })

                 } else {
                     res.send(JSON.stringify({
                         status: "Fail",
                         message: "No Scheme is Avaliable with the Name"
                     }))

                 }
             }



         })


     })

  app.get('/api/pricingengine/statistics',User.authorize,function(req,res){



        models['order'].find({}, function(err, data) {
                    var orderCount = data.length;

                    var totalOrder = _.countBy(data, function(num) {
                        return num.schemeName;
                    });

                    var Precentages = {};
                    var schemePercentage = _.each(totalOrder, function(order, key) {


                        Precentages[key] = ((order * 100) / orderCount).toFixed(1);

                    });

            var locationPercentage = {};
            var locationTotal = _.countBy(data, function(num) {

                if (num._doc.orderLocationOfService) {
                    return num._doc.orderLocationOfService[0].name;
                } else {
                    return "";
                }

            })

            var locationsPercentage = _.each(locationTotal, function(location, key) {
                if (key != "") {
                    locationPercentage[key] = ((location * 100) / orderCount).toFixed(1);

                }
            })

var datesAll = [];
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


           var allDates =  _.each(data, function(date,key)
            {

                datesAll.push({"Year": date.dateOfService.getFullYear(), "Month":monthNames[date.dateOfService.getMonth()]})
        
            });



var categories = _.chain(datesAll)
  .countBy(function (i) { 

    return i.Year +","+ i.Month ;


})
  
  .value();

 var percentagedate =[];

  var data = _.each(categories,function(num,key)
  {
    var monthAndYear = key.split(",");
    
percentagedate.push({"Year":monthAndYear[0],"Month":monthAndYear[1],"totals":num})

  });

var dataall = _.groupBy(percentagedate,"Year");
console.log(dataall);
            var finalPercentages = {

                "schemePercentage": Precentages,
                "locationPercentage": locationPercentage
            }

            res.send(finalPercentages);

    })
 })


 }


