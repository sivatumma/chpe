var config = require('./config/config.js'),
  fs = require('fs'),
  path = require('path'),
  express = require('express'),
  cors = require('cors'),
  app = new express(),
  session = require('express-session'),
  exceptionHandlers = require('./config/exceptionHandlers.js'),
  dbModule = require('./config/dbModule.js')(),
  qurey = require('./config/queryBuilder.js'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  bodyParser = require('body-parser');

function fetchModels(req, res) {
  res.status(200).end("Fetch is executed " + req.params.modelName);
}

function createModels(req, res) {

  config.configVariable.loginUser = "user";

  var u1 = mongoose.model(req.params.modelName)(qurey.createSchema(req.body));
  u1.save().then(function(people) {
    res.send(people);
  }, function(err) {
    res.send(JSON.stringify({
      "status": "fail",
      "message": err.message
    }));
  });

}

function updateModels(req, res) {

console.log(req.body);
  var data = mongoose.model("scheme").find(qurey.suggestDiscount(req)).exec();

data.then(function(schemadata){
  console.log(schemadata);
  res.send(schemadata);


})


}

function deleteModels(req, res) {
  res.status(200).end("Executed delete method on model : " + req.params.modelName);
}


app.use(session({
  secret: 'Welcome2C@llHealth'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use('lib', express.static('../lib'));
app.use('dist', express.static('../dist'));
app.use('build', express.static('../build'));
app.all('/', User.authorize, function(req, res) {
  console.log(req.method);
  res.status(200).send('GET REQUEST : HEH, NO MODEL' + new Date());
});

app.route('/mdb/:modelName')
  .get(fetchModels)
  .post(createModels)
  .put(updateModels)
  .delete(deleteModels);

  app.route('/operation/:filter').put(updateModels);


var server_credentials = {
  key: fs.readFileSync(path.join(config.certificates_dir, 'server.key')),
  ca: fs.readFileSync(path.join(config.certificates_dir, 'server.csr')),
  cert: fs.readFileSync(path.join(config.certificates_dir, 'server.crt'))
};

dbModule.once('open', function callback() {
  // https.createServer(server_credentials, app).listen(config.port || 91, function() {
  //     console.log('Express HTTPS server listening on port ' + app.get('default_https_port'));
  // });

  app.listen(config.port || 91, function() {
    console.log('Express server listening on port ', config.port || 91);
  });
});