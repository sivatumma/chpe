var fs = require('fs');

module.exports = function() {
	fs.createWriteStream('./pricingEngine.log', {
		flags: 'a'
	});
}