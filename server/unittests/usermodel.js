var expect = require('expect.js');
var user = require('../models/user.js');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/pricingEngine') ;
describe('Model',function(){

it('database field missing',function(){
console.log(mongoose.model(user).usersSchema.username);

expect(typeof user).to.be(typeof (mongoose.model));

})

});