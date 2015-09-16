module.exports = function(req, res) {
	res.set('Access-Control-Allow-Origin', '*');
	res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept');
}