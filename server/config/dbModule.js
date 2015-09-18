var path = require("path"),
<<<<<<< HEAD
	config = require("./config.js")
mongoose = require('mongoose');
var models = [
	"associate",
	"consumer",
	"product",
	"roles",
	// "user",
	"Scheme",
	"order",
	"diagnostic"
];


// var models = [
// "scheme"
// ];

exports.setupMongoDB = setupMongoDB;
exports.dbConnection = dbConnection;
function dbConnection() {
	var path = config.database;
	var db = mongoose.connect(path);
	return db;
}
function setupMongoDB() {
	initializeMongoModels();
}
function initializeMongoModels() {
	var l = models.length;
	for (var i = 0; i < l; i++) {
		require(path.join(config.modelsFolder, models[i]))(mongoose);
=======
	config = require("./config.js"),
	mongoose = require('mongoose');


module.exports = function(props) {
	var models = [
		"associate",
		"consumer",
		"product",
		"roles",
		"user",
		"scheme",
		"order",
		"diagnostic"
	];

	function dbConnection() {
		var path = config.database;
		var db = mongoose.connect(path);

		db.on('error', console.error.bind(console, 'connection error:'));
		db.on('error', function(err) {
			console.log(err.stack);
		});

		return db;
	}

	function initializeMongoModels() {
		var l = models.length;
		for (var i = 0; i < l; i++) {
			return require(path.join(config.modelsFolder, models[i] + ".js"))(mongoose);
		}
>>>>>>> 9084429365c6f21ed0bc18ea918d12a1b155bded
	}
	initializeMongoModels();
	return dbConnection();
}
