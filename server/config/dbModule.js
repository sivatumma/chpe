var path = require("path"),
	serverConfig = require("./serverConfig.js")
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
function dbConnection()
{
	console.log("in dbConnection()");
	    var path = serverConfig.database;
          
          var db = mongoose.connect(path);
	console.log("This is _db", db);

 return   db;
}

function setupMongoDB (){
	console.log("in setupMongoDB()");
	initializeMongoModels();
	    
}

function initializeMongoModels() {
    var l = models.length;
    for (var i = 0; i < l; i++) {
        
        //return  require(path.join(serverConfig.modelsFolder,models[i]+".js"))(mongoose);
    }
}

console.log("hei");
setupMongoDB();
dbConnection();