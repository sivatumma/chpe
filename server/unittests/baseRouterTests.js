var assert = require("assert");

var ws = require('../ws.js');

describe('Dummy', function() {
  describe('small check', function () {
    it('should check if -1 == -1', function () {
      assert.equal(-1, -1);
    });
  });
});

describe('test if ws is working', function(){
	it("will check if the ws module is function for least", function(){
		assert.equal(ws,require('../ws.js').Server);
		// expect(ws).toBe(require('../ws.js').Server);
	})
});