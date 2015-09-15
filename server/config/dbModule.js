var path = require("path"),
	serverConfig = require("./serverConfig.js"),
	mongoose = require('mongoose');

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

exports.setupMongoDB = setupMongoDB; 
exports.dbConnection = dbConnection;
function dbConnnection()
{
	 var path = serverConfig.database;
           
          module.exports._db = mongoose.connect(path);

 return   module.exports._db;
}

function setupMongoDB (){
	initializeMongoModels();
	    
}

function initializeMongoModels() {
    var l = models.length;
    for (var i = 0; i < l; i++) {
        // require(path.join(serverConfig.modelsFolder,models[i]+".js"))(mongoose);
        console.log(models[i]);
    }
}

console.log("hei");
setupMongoDB();
dbConnection();