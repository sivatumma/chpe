var supertest = require("supertest");
var expect = require('expect.js');
var api = supertest("http://localhost:91");
describe('get Scheme Data', function() {

	// Test case for overView

	it('web api is not getting data', function(done) {
		api.get('/pricingengine/overview')
			.set('Accept', 'application/json')
			.expect(200).end(function(err, res) {
				expect(JSON.parse(res.text)).to.have.property('expdata');
				expect(JSON.parse(res.text)).to.have.property('totals');
				expect(JSON.parse(res.text).totals).to.have.property('COUPON');
				expect(JSON.parse(res.text).totals).to.have.property('GIFT_CARD');
				expect(JSON.parse(res.text).totals).to.have.property('ADD_ON');
				expect(JSON.parse(res.text).totals).to.have.property('pepoles');
			});
		done();
	});

	//Test case for previewData

	it('web api is not working', function(done) {
		api.get('/pricingengine/previewData?name=ADDON')
			.set('Accept', 'application/json').
		expect(200).end(function(err, res) {
			expect(JSON.parse(res.text)).to.have.property('orderDetails');
			expect(JSON.parse(res.text).orderDetails).to.have.property('uniqueUsers');
			expect(JSON.parse(res.text).orderDetails).to.have.property('orderLocations');
			expect(JSON.parse(res.text).orderDetails).to.have.property('totalAmount');
			expect(JSON.parse(res.text).orderDetails).to.have.property('discountAmount');
			expect(JSON.parse(res.text).orderDetails).to.have.property('revenues_and_discounts');
			expect(JSON.parse(res.text).orderDetails.revenues_and_discounts).to.have.property('revenues');
			expect(JSON.parse(res.text).orderDetails.revenues_and_discounts).to.have.property('discounts');
			expect(JSON.parse(res.text).orderDetails).to.have.property('unique_customers');
			expect(JSON.parse(res.text)).to.have.property('schemeDetails');
			expect(JSON.parse(res.text).schemeDetails).to.have.property('behavior');
			expect(JSON.parse(res.text).schemeDetails.behavior).to.have.property('endDate');
			expect(JSON.parse(res.text).schemeDetails.behavior).to.have.property('startDate');
			done();
		});
	});

   //Test case for schemeAppliedSuccessfully

	it('web api is not working for schemeAppliedSuccessfully', function(done) {
				api.post('/pricingengine/schemeAppliedSuccessfully')
					.set('Accept', 'application/json')
					.send({
						"billAmount": 21100,
						"SLDisocunt": "540.00",
						"DLDiscount": "18.00",
						"SRCDiscount": "175.00",
						"BLS": "1425.69",
						"MOP": "947.07",
						"finalAmount": 17994,
						"_id": "561f3ca26d1c6dd80652572f"
					})
					.expect(200).end(function(err, res) {
						expect(JSON.parse(res.text).nModified).to.eql(1);
						done();

					})

   });

	// Test case for suggestDiscounts

	it('web api is not working for suggestDiscounts',function(done)
	{
	api.post('/pricingengine/suggestDiscounts')
		.set('Accept', 'application/json')
		.send({
			"name": "a109",
			"locationOfService": "Hyderabad",
			"orderDate": "2015-09-24T10:04:42.515Z",
			"userId": "123",
			"businessName": "Double",
			"dateOfService": "2015-10-24T10:04:42.515Z",
			"businessOrderId": "2344433",
			"servicesAmount": "18000",
			"services": [
				"Econsult",
				"Drugs@Home"
			],
			"orderLocationOfService": {
				"name": "hyderbad",
				"geoLocation": [122, 30]
			},
			"doctorAmount": "600",
			"doctorChoiceType": "user",
			"modeOfPayment": "COD",
			"SRCAmount": 2500,
			"SRCServices": ["High Level Products", "Low Level Products"]

		})
		.expect(200).end(function(err, res) {

			expect(JSON.parse(res.text)).to.have.property('billAmount');
			expect(JSON.parse(res.text)).to.have.property('finalAmount');
			expect(JSON.parse(res.text)).to.have.property('_id');

			done();
		});
});
});