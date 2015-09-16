var config = require('./config/config.js'),
  express = require('express'),
  cors = require('cors'),
  app = new express(),
  session = require('express-session'),
  exceptionHandlers = require('./config/exceptionHandlers.js'),
  dbModule = require('./config/dbModule.js'),
  qurey = require('./config/queryBuilder.js'),
  mongoose = require('mongoose');

function fetchModels(req, res) {
  res.status(200).end("Fetch is executed " + req.params.modelName);
}

function createModels(req, res) {

  loginuser = "admin";
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

function updateModels(req, res) {}

function deleteModels(req, res) {
  res.status(200).end("Executed delete method on model : " + req.params.modelName);
}


app.use(session({secret: 'Welcome2C@llHealth'}));
app.use(cors());
app.use('lib', express.static('../lib'));
app.use('dist', express.static('../dist'));
app.use('build', express.static('../build'));
app.all('/', function(req, res) {
  console.log(req.method);
  res.status(200).send('GET REQUEST : HEH, NO MODEL' + new Date());
});

app.route('/:modelName')
  .get(fetchModels)
  .post(createModels)
  .put(updateModels)
  .delete(deleteModels);

// app.close();

app.listen(config.port || 91, function() {
  console.log("listening on ", config.port || 91);
});

