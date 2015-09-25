function generalConfig() {
	var urls = {
		toUseApiHost:false,
		apiHost: '',
		rest: '/mdb/scheme?API_KEY=MEDIBUS-12ed15e7-bc20-45c5-88dc-684bb32a9dd9',
		memcache: '/memcache'
	};

	var stateVariables = {
		isLoggedIn: false,
		schemeType: ""
	};
	var userStatus = function() {
            if (localStorage !== undefined &&
                (localStorage.userName !== undefined || localStorage.userName != "") && localStorage.loggedIn) {
                window.location = "dashboard.html";
            }
    };
	return {
		urls: urls,
		stateVariables: stateVariables,
		user:userStatus
	};
}