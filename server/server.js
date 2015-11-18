var config = require('./config/config.js'),
  fs = require('fs'),
  uuid = require('node-uuid'),
  path = require('path'),
  express = require('express'),
  cors = require('cors'),
  app = new express(),
  session = require('express-session'),
  exceptionHandlers = require('./config/exceptionHandlers.js'),
  dbModule = require('./config/dbModule.js')(),
  queryBuilder = require('./config/queryBuilder.js'),
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = mongoose.model('User'),
  bodyParser = require('body-parser'),
  compressible = require('compressible'),
  compression = require("compression")(),
  logModule = require('./config/logModule')(app),
  https = require('https'),
  request = require('request'),
  expressSession = require('express-session'),
  q2m = require('query-to-mongo'),
  mongoskin = require('mongoskin'),
  _ = require('lodash'),
  chUtils = require('../lib/chUtils.js').chUtils,
  _id_count = 0;

app.use(function(req, res, next) {
  res.header('X-Powered-By', "The Callhealth Pricing Engine Team");
  next();
});
app.use(cors());

function readRawBody(req, res, next) {
  console.log("inside readRawBody");

  req.data = '';
  req.on('data', function(chunk) {
    req.data += chunk.toString('utf-8');
  });

  req.on('end', function() {
    console.log("ended ", req.data);
    // console.log(req.data.toString('utf8',0,5));
    // next();
  });
}

app.use(bodyParser.raw({
  type: "application/xml"
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(expressSession({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

app.use('/lib', express.static(config.application.root_path + '/lib', {
  maxAge: '30d'
}));
app.use('/dist', express.static(config.application.root_path + '/dist', {
  maxAge: '30d'
}));
app.use('/build', express.static(config.application.root_path + '/build', {
  maxAge: '30d'
}));


app.use(express.static(config.application.root_path + '/client'));


compressible('text/html') // => true 
compressible('image/png') // => false 

app.use(session({
  genid: function(req) {
    return uuid.v4();
  },
  resave: true,
  saveUninitialized: true,
  secret: 'Welcome2C@llHe@lth'
}));


function fetchModels(req, res) {
  var modelId = req.params.modelId ? {
    "metadata.name": req.params.modelId
  } : {};

  // var queryreq = req.url.split('?');
  // var query = q2m(queryreq[1]);
  var u1 = mongoose.model(req.params.modelName);
  u1.find({}, function(err, data) {
    if (err) res.status(500).send({
      status: "fail",
      message: err.message
    });
    res.status(200).send(data);
  });
}

function convertXMLToJson(req, res) {
  var parseString = require('xml2js').parseString;
}

function fetchOrders(req, res) {

  var u1 = mongoose.model(req.params.modelName);
  u1.aggregate([{
    $match: {
      schemeName: req.params.schemeName
    }
  }, {
    $group: {
      _id: "$schemeName",
      total: {
        $sum: "$billAmount"
      }
    }
  }], function(err, data) {
    console.log(err);
    console.log(data);
    res.status(200).send("Call");
  })
}

function createModels(req, res) {

  config.configVariable.loginUser = "user";
  var u1 = mongoose.model(req.params.modelName)(queryBuilder.createSchema(req.body));


  u1.save().then(function(data) {
    res.status(200).send(data);
  }, function(err) {

    res.status(500).send({
      "status": "fail",
      "message": err.message
    });
  });
}


function suggestDiscounts(req, res) {
  var u1 = mongoose.model('scheme').find(queryBuilder.suggestDiscounts(req.body));
  u1.exec().then(function(data) {
    var queryData = queryBuilder.saveOrder(req.body, data);
    var o1 = mongoose.model('order')(queryData.orderData);
    o1.save().then(function(data) {
      queryData.finalData._id = data._id;
      res.status(200).send(queryData.finalData);
    }, function(err) {
      res.status(500).send({
        "status": "fail",
        "message": err.message
      })
    })
  })
}

function getPreviewData(req, res) {
 var finalData = {};
  var u1 = mongoose.model('order').find(queryBuilder.orderDetails(req.query.name));
  var s1 = mongoose.model('scheme').find(queryBuilder.schemeDetails(req.query.name));
  u1.exec().then(function(data) {
    finalData.orderDetails = chUtils.getPreviewData(data);

 s1.exec().then(function(schemeData){

  finalData.schemeDetails = schemeData;
   res.send(JSON.stringify(finalData)); 
 });

  });

}
function getOrverView(req,res)
{

  var scheme = mongoose.model('scheme').find(queryBuilder.getOrverView());
  var allScheme = mongoose.model('scheme').find({});
  var order = mongoose.model('order').find().distinct('userId');
  var finalData = {};
  scheme.exec().then(function(data) {
      finalData.expdata = _.countBy(data, function(expdata) {
        if (expdata.metadata.type == 'COUPON') return "COUPON";
        if (expdata.metadata.type == 'ADD_ON') return "ADD_ON";
        if (expdata.metadata.type = "GIFT_CARD") return "GIFT_CARD";
      });

      allScheme.exec().then(function(allData) {
        finalData.totals = _.countBy(allData, function(allData) {
       
          if (allData.metadata.type == 'COUPON') return "COUPON";
          if (allData.metadata.type == 'ADD_ON') return "ADD_ON";
          if (allData.metadata.type = "GIFT_CARD") return "GIFT_CARD";
        });

      })
    }).then(function() {
        order.exec().then(function(orderData) {
          finalData.totals.pepoles = orderData.length;
       res.send(JSON.stringify(finalData));
        })

       
  });  
}


function schemeApplied(req, res) {
  var o1 = mongoose.model('order').update(queryBuilder.schemeApplied(req.body), req.body);
  o1.exec().then(function(data) {
    res.send(data);
  })
}

function updateModels(req, res) {
  //  delete req.body._id;
  var updateBuilder = mongoose.model(req.params.modelName).update(queryBuilder.updateSchema(req.body), req.body);
  updateBuilder.exec().then(function(data) {
    res.send(data);
  });
}

function profileFetch(req, res) {
  // console.log("I am here at profileFetch function");
  // console.log("setting header: ", req.session.user || "No User");
  if(req.session.user !== undefined || req.session.user !== null){
    res.setHeader('user', JSON.stringify(req.session.user));
    res.send();
  }
  else res.status(401).send();
  // res.status(500).send("hi");
}

function deleteModels(req, res) {
  res.status(200).end("Executed delete method on model : " + req.params.modelName);
}

require('./routes/user.js')(app);
require('./routes/proxy.js')(app);

app.route('/').get(function(req, res) {
  console.log("Redirecting to /ssoLogin");
  res.redirect('/ssoLogin');
}).head(profileFetch);

app.route('/checkAuthPing').head(profileFetch);

app.all('/ssoLogin', User.ssoLogin, function(req, res) {
  console.log("req.session.user = ",req.session.user);
  res.header("user",JSON.stringify(req.session.user));
  console.log(req.headers, res.header || "No header in res object");
  res.redirect("home.html");
});

app.get('/ssoLogout', User.ssoLogout, function(req, res) {
  if (req.session.user === undefined || req.session.user === null) {
    res.redirect("unAuthorized.html");
    //res.status(401).send("User not authorized.");
  } else {
    var headers = {
        'User-Agent': 'Super Agent/0.0.1',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      options = {
        url: 'http://172.19.4.179:8080/sso/secureLogout',
        method: 'POST',
        headers: headers,
        form: {
          'sessionIndex': req.session.user.sessionIndex,
          'spEntityID': 'callhealth.com',
          'idProvider': config.authentication.idProvider
        }
      };
    request(options, function(error, response, body) {
      req.session.user = null;
      console.log(response.statusCode);
      if(303 == response.statusCode ){
        console.log("redirecting to location ...");
        res.redirect(response.headers.location);
      }
      else {
        console.log(response.statuseCode, response.headers);
        res.status(response.statusCode).send();
      }
    });
  }

});



var User = mongoose.model('User');
app.get('/pricingengine/previewData', getPreviewData);
app.get('/pricingengine/overview',getOrverView);
app.post('/pricingengine/schemeAppliedSuccessfully', schemeApplied);
app.post('/pricingengine/suggestDiscounts', suggestDiscounts);
app.all('/mdb/update/:modelName', updateModels);
app.route('/mdb/:modelName/:modelId').get(fetchModels);

app.get('/mdb/:modelName',User.ssoLogin, fetchModels);
app.post('/mdb/:modelName',User.ssoLogin, createModels);
app.put('/mdb/:modelName',User.ssoLogin, updateModels);
app.delete('/mdb/:modelName',User.ssoLogin, deleteModels);

  // .get(fetchModels)
  // .post(createModels)
  // .put(updateModels)
  // .delete(deleteModels);

app.route('/operation/:filter').put(updateModels).post(updateModels);

app.post('/utils/xml2json', function(req, res) {

  console.log(req.body);
  res.status(200).send("done reading rawbody");
});

var server_credentials = {
  key: fs.readFileSync(path.join(config.certificates_dir, 'server.key')),
  ca: fs.readFileSync(path.join(config.certificates_dir, 'server.csr')),
  cert: fs.readFileSync(path.join(config.certificates_dir, 'server.crt'))
};

dbModule.once('open', function callback() {
  var httpsServer = https.createServer(server_credentials, app)
  httpsServer.on('error', function(err) {
    console.log("HTTPS could not be started as the port is in use. Trying to serve only HTTP");
    console.log("...");
  });
  httpsServer.listen(config.https_port || 1443, function(err) {
    if (err) {} else
      console.log('Express HTTPS server listening on port ' + config.http_port || 443);
  });

  app.listen(91, function(err) {
    if (err) {
      console.log(err.message);
    }
    console.log('Express server (HTTP) listening on port ', process.argv[2] || 91);
  });

  app.on('error', function(err) {
    console.log(err);
  });

});

process.on('error', function(err) {
  console.log(err);
});