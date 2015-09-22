function generalConfig() {
	var urls = {
		apiHost: 'http://172.19.4.162:90/api/pricingengine',
		rest: '?API_KEY=MEDIBUS-12ed15e7-bc20-45c5-88dc-684bb32a9dd9',
		memcache: '/memcache'
	};

	var stateVariables = {
		isLoggedIn: false,
		schemeType: ""
	};
	return {
		urls: urls,
		stateVariables: stateVariables
	};
}