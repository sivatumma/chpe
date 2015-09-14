
var express = require('express'),
    app = new express(),
    exceptionHandlers = require('./exceptionHandlers.js');

function fetchModels(req, res) {
    res.status(200).end("Fetch is executed " + req.params.modelName);
}

function createModels(req, res) {

}

function updateModels(req, res) {

}

function deleteModels(req, res) {
    res.status(200).end("Executed delete method on model : " + req.params.modelName);

}


app.use('lib', express.static('../lib'));
app.use('dist', express.static('../dist'));
app.use('build', express.static('../build'));

app.use(require('./cors').enable());

app.all('/', function(req, res) {
    console.log(req.method);
    res.send('GET REQUEST : HEH, NO MODEL');
});

app.route('/:modelName')
    .get(fetchModels)
    .post(createModels)
    .put(updateModels)
    .delete(deleteModels);
// app.close();
app.listen(3002);



app.use(exceptionHandlers.expressErrorHandler);