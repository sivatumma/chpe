module.exports = {
	createSchema: function(data) {

		return data;
	},
	findSchema: function(data) {
		var query = {};
		query.push(data);
		return query;

	},
	suggestDiscount: function(req, res) {
		var query = {
			"metadata.name": req.body.name,
			"behavior.locationOfServices": {
				$in: [req.body.locationOfService, "AllLocation"]
			},
			"behavior.startDate": {
				$lte: new Date(req.body.orderDate)
			},
			"behavior.endDate": {
				$gte: new Date(req.body.orderDate)
			},
			"metadata.toIds.id": req.body.userId,
			"metadata.published": true
		}
		return query;
	},

	findOrderQuery: function(req) {
		var query = {
			schemeName: req.body.name,
			userId: req.body.userId
		}
		return query;

	},
	shcemaFindQuery: function(query) {

		return query;
	}

};