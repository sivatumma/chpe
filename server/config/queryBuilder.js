module.exports = {
	createSchema: function(data) {

		
		return data;
	},
	findSchema : function(data)
{

var query ={};

query.push(data);
        return query;


},
suggestDiscount : function(req)
{
	
		var query = {
			"metadata.name": req.body.name,

			"behaviour.locationOfServices": {
				$in: [req.body.locationOfService, "AllLocation"]
			},
			"behaviour.startDate": {
				$lte: new Date(req.body.orderDate)
			},
			"behaviour.endDate": {
				$gte: new Date(req.body.orderDate)
			},
			"metadata.toIds.to": req.body.userId,
			"metadata.published": true

		}
		return query;
},

shcemaFindQuery : function(query)

{


             return query;
}


};