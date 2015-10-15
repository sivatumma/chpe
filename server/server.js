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
  _id_count = 0;

app.use(function(req, res, next) {
    res.header('X-Powered-By', "The Callhealth Pricing Engine Team");
    next();
});
app.use(cors());
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
  var modelId = req.params.modelId ? req.params.modelId : {};
  var u1 = mongoose.model(req.params.modelName)({"metadata.name":modelId});
  u1.find(function(err, data) {
    if (err) res.status(500).send({
      status: "fail",
      message: err.message
    });
    res.status(200).send(data);
  });
}



function fetchOrders(req,res)
{

var u1 = mongoose.model(req.params.modelName);
u1.aggregate([{$match:{schemeName:req.params.schemeName}},{$group:{_id:"$schemeName",total:{$sum:"$billAmount"}}}],function(err,data){
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

function updateModels(req, res) {
  console.log("in updateModels function");
  delete req.body._id;
  var updateBuilder = mongoose.model(req.params.modelName).update(queryBuilder.updateSchema(req.body));
  updateBuilder.update(req.body, function(err, data){
    // console.log(err ? err + "ERROR++++++++++++++++++++++++++++++++" : data);
    console.log("Callback", data);
  });

  // updateBuilder.exec().then(function(err, data) {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send(err);
  //   }else{
  //     res.status(200).send(data);
  //   }
  // });
}

function deleteModels(req, res) {
  res.status(200).end("Executed delete method on model : " + req.params.modelName);
}

require('./routes/user.js')(app);
require('./routes/proxy.js')(app);

app.all('/',function(req, res) {
    res.redirect('/ssoLogin');
});


app.all('/ssoLogin', User.ssoLogin, function(req, res) {
  res.send("verify document.URL to confirm login");
});

app.get('/ssoLogout',function(req, res) {

 var headers = {
      'User-Agent': 'Super Agent/0.0.1',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    options = {
      url: 'http://172.19.4.179:8080/CHSSO/sso/callhealth/secureLogout',
      method: 'POST',
      headers: headers,
      form: {
          'sessionIndex':req.session.user.sessionIndex,
          'spEntityID': 'callhealth.com'
      }
    };
    request(options, function(error, response, body) {
      console.log(response.headers.location);
      req.session.user = null;
      res.redirect(response.headers.location);
    });

});



var User = mongoose.model('User');

app.all('/test', updateModels);

app.route('/order/:modelName/:schemeName').get(fetchOrders);
app.route('/mdb/:modelName/:modelId').get(fetchModels);

app.route('/mdb/:modelName')
  .get(fetchModels)
  .post(createModels)
  .put(updateModels)
  .delete(deleteModels);

app.route('/operation/:filter').put(updateModels).post(updateModels);


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
    if(err){
      console.log(err.message);
    }
    console.log('Express server (HTTP) listening on port ', process.argv[2] || 91);
  });

  app.on('error', function(err){
    console.log(err);
  });

});

process.on('error',function(err){
  console.log(err);
});