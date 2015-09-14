var serverConfig = require('./serverConfig'),
	path = require('path'),
	fs = require('fs'),
	morgan = require('morgan');

exports.initialize = function() {
	fs.createWriteStream(process.cwd() + serverConfig.logFiles.plainLogFile, {
		flags: 'a'
	});
}

console.log("Plain Logs are written into : ", process.cwd() + serverConfig.logFiles.plainLogFile);
console.log(serverConfig.application.addPrefixes);