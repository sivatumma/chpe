var path = require("path"),
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
		mongoose.connect(config.database);
		var db = mongoose.connection;

		db.on('error', console.error.bind(console, 'connection error:'));
		db.on('error', function(err) {
			console.log(err.stack);
		});

		return db;
	}

	function initializeMongoModels() {
		var l = models.length;
		for (var i = 0; i < l; i++) {
			require(path.join(config.modelsFolder, models[i] + ".js"))(mongoose);
		}
	}
	initializeMongoModels();
	return dbConnection();
}