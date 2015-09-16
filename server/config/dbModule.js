var path = require("path"),
	config = require("./config.js")
mongoose = require('mongoose');
/*var models = [
	"associate",
	"consumer",
	"product",
	"roles",
	"user",
	"scheme",
	"order",
	"diagnostic"
];
*/

var models = [
	"scheme"
];
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
		return require(path.join(config.modelsFolder, models[i] + ".js"))(mongoose);
	}
}
setupMongoDB();
dbConnection();