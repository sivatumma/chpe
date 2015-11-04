module.exports = {
	expressErrorHandler: function(err, req, res, next) {
		if (err) {
			console.error(err.stack);
		}
		res.status(500).end('Something broke!');
	},

	catchAllHandler: function (err, req, res, next) {
		if (res) {
			return next(err);
		}
		res.status(500);
		res.render('error', {
			error: err
		});
	},


}

process.on('SIGTERM', function() {
	console.log("Closing");
	app.close();
});