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
  qurey = require('./config/queryBuilder.js'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  bodyParser = require('body-parser'),
  compressible = require('compressible'),
  compression = require("compression")();

require('./config/logModule')(app);

function fetchModels(req, res) {
  res.status(200).end("Fetch is executed " + req.params.modelName);
}

function createModels(req, res) {
  config.configVariable.loginUser = "user";

  var u1 = mongoose.model(req.params.modelName)(qurey.createSchema(req.body));
  u1.save().then(function(people) {
    res.send(people);
  }, function(err) {
    res.send({
      "status": "fail",
      "message": err.message
    } + '');
  });

}

function updateModels(err, req, res) {
  if(err) console.log("ERROR: ", err.stack);


  var data = mongoose.model("scheme").find(qurey.suggestDiscount(req)).populate('metadata.name').exec();
//var order = mongoose.model("order").find(query.findOrderQuery(req)).exec();
data.then(function(schemadata){
  console.log(schemadata[0].metadata);
  res.send(schemadata);

})


}

function deleteModels(req, res) {
  res.status(200).end("Executed delete method on model : " + req.params.modelName);
}


app.use(cors());

app.use(session({
  genid: function(req) {
    return uuid.v4();
  },
  resave: true,
  saveUninitialized: true,
  secret: 'Welcome2C@llHe@lth'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

require('./routes/user.js')(app);

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

app.all('/',function(req, res) {
  res.sendfile('client/login.html');
  console.log('client/login.html served');
});


 
compressible('text/html') // => true 
compressible('image/png') // => false 

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