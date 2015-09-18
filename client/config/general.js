function generalConfig() {
	var urls = {
		apiHost: 'http://localhost:90/api/pricingengine',
		rest: '?API_KEY=MEDIBUS-12ed15e7-bc20-45c5-88dc-684bb32a9dd9',
		memcache: '/memcache'
	};

	//declaring state variables
	var stateVariables = {
		isLoggedIn: false,
		schemeType: ""
	};
	return {
		urls: urls,
		stateVariables: stateVariables
	};
};