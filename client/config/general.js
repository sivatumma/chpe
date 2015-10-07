function generalConfig() {
	var urls = {
		toUseApiHost:false,
		apiHost: '',
		rest: '/mdb/scheme?API_KEY=MEDIBUS-12ed15e7-bc20-45c5-88dc-684bb32a9dd9',
		memcache: {
			names:'/api/proxy?url=http://52.76.37.144:8080/javaapi/rest/names',
			locations: '/api/proxy?url=http://52.76.37.144:8080/javaapi/rest/locations',
			schemeNames: '/api/proxy?url=http://52.76.37.144:8080/javaapi/rest/schemeNames',
			API_KEY:'52d0747f-2bb1-438e-879a-84726c4f90d0'
		}
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
    var serviceLevelDiscounts=["E-Consultation","Drugs@Home","Diagnostics@Home","Care@Home","Facilitation@Home"] ;

	return {
		urls: urls,
		stateVariables: stateVariables,
		user:userStatus,
		staticServices:serviceLevelDiscounts
	};
}