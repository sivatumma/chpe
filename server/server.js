var express = require('express'),
  app = new express(),
  exceptionHandlers = require('./config/exceptionHandlers.js'),
  dbModule = require('./config/dbModule'),
  qurey = require('./config/queryBuilder.js'),
  mongoose = require('mongoose');

function fetchModels(req, res) {
  res.status(200).end("Fetch is executed " + req.params.modelName);
}

function createModels(req, res) {


  config.loginuser = "admin";
  console.log("helo");

  var u1 = models[req.params.modelName](qurey.createSchema(req.body));

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

}

function deleteModels(req, res) {
  res.status(200).end("Executed delete method on model : " + req.params.modelName);

}


// app.use(require('./config/cors')());

app.use('lib', express.static('../lib'));
app.use('dist', express.static('../dist'));
app.use('build', express.static('../build'));

app.all('/', function(req, res) {
  // console.log(req.method);
  res.send('GET REQUEST : HEH, NO MODEL');
});

// app.route('/:modelName')
//   .get(fetchModels)
//   .post(createModels)
//   .put(updateModels)
//   .delete(deleteModels);
// app.close();
app.listen(3002, function(){
  console.log("listening on 3002");
});



// app.use(exceptionHandlers.expressErrorHandler);