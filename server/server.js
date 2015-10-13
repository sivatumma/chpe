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
  quryBuilder = require('./config/queryBuilder.js'),
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
  var u1 = mongoose.model(req.params.modelName);
  u1.find(function(err, data) {
    if (err) res.status(500).send({
      status: "fail",
      message: err.message
    });
    res.status(200).send(data);
  });
}

function createModels(req, res) {

  if (req.params.modelName == 'order') {
    var u1 = mongoose.model(req.params.modelName)(quryBuilder.createSchema(req.body));
    u1.scheme = 0;
    u1.save().then(function(data) {
      res.status(200).send(data);
    }, function(reason) {
      res.status(500).send(reason);
    });
  } else {
    config.configVariable.loginUser = "user";
    var u1 = mongoose.model(req.params.modelName)(quryBuilder.createSchema(req.body));
    //u1._id = _id_count++;

    u1.save().then(function(data) {
      console.log("DATA: ", data);
      res.status(200).send(data);

    }, function(err) {
      console.log(err.message);
      res.status(500).send({
        "status": "fail",
        "message": err.message
      });
      console.log(err);
    });


  }
}

function updateModels(req, res) {

 var m = mongoose.model('scheme');
 m.update({_id:m._id},req.body,function(err, c) {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }else{
      res.status(200).send(c);
    }
  });
}

function deleteModels(req, res) {
  res.status(200).end("Executed delete method on model : " + req.params.modelName);
}

require('./routes/user.js')(app);
require('./routes/proxy.js')(app);

/*app.all('/', function(req, res) {
  // res.sendfile('client/login.html');
  res.redirect('/');
  console.log('client/login.html served');
});
*/


app.all('/', function(req, res) {

  if (req.session.user) {
    res.redirect('/index.html');
  } else {
    res.redirect('/ssoLogin');

  }



});


app.all('/ssoLogin', User.ssoLogin, function(req, res) {
  res.redirect('/');
});

app.get('/ssoLogout',function(req, res) {

 var headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/x-www-form-urlencoded'
            }

            // Configure the request
            var options = {
                url: 'http://172.19.4.179:8080/CHSSO/sso/callhealth/secureLogout',
                method: 'POST',
                headers: headers,
                form: {
                    'sessionIndex':req.session.user.sessionIndex,
                    'spEntityID': 'callhealth.com'
                }
            }

            // Start the request
            request(options, function(error, response, body) {
              console.log(response.headers.location);
              req.session.user = null;
              res.redirect(response.headers.location);
              // process.exit(1);

              // res.redirect(response);


               /* if (!error && response.statusCode == 200) {
                    res.redirect(unescape(JSON.parse(body).url));
                }*/


            });




});



var User = mongoose.model('User');

app.all('/test', updateModels)


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
  httpsServer.listen(config.https_port || 443, function(err) {
    if (err) {} else
      console.log('Express HTTPS server listening on port ' + config.http_port || 443);
  });

  app.listen(process.argv[2] || 91, function() {
    console.log('Express server (HTTP) listening on port ', process.argv[2] || 91);
  });

});