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
		var path = config.database;
		var db = mongoose.connect(path);
		return db;
	}

	function initializeMongoModels() {
		var l = models.length;
		for (var i = 0; i < l; i++) {
			return require(path.join(config.modelsFolder, models[i] + ".js"))(mongoose);
		}
	}
	initializeMongoModels();
	return dbConnection();
}