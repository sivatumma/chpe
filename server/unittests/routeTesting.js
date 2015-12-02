var supertest = require("supertest");
var expect = require('expect.js');
var api = supertest("http://localhost:91");
describe('get Scheme Data', function() {
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
});