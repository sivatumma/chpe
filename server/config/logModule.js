var config = require('./config'),
	path = require('path'),
	fs = require('fs'),
	morgan = require('morgan');


module.exports = function(app) {
	var accessLogs = fs.createWriteStream(path.join(config.application.root_path, config.logFiles.plainLogFile), {
		flags: 'a'
	});
	app.use(require('morgan')('combined', {
		stream: accessLogs
	}));

	console.log("Plain Logs are written into : ", path.join(config.application.root_path, config.logFiles.plainLogFile));
}