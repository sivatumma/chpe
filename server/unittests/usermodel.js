var expect = require('expect.js');
var mongoose = require('mongoose');
var user = require('../models/user.js')(mongoose);
mongoose.connect('mongodb://localhost/pricingEngine') ;
describe('Model',function(){

it('User Model Field Name Missing',function(){


expect(user.schema.paths.username).to.be.ok();
expect(user.schema.paths.password).to.be.ok();
expect(user.schema.paths.active).to.be.ok();
expect(user.schema.paths.loginAttempts).to.be.ok();
expect(user.schema.paths.lockUntil).to.be.ok();
expect(user.schema.paths.roles).to.be.ok();
expect(user.schema.paths.roleCount).to.be.ok();
expect(user.schema.paths.provider).to.be.ok();
expect(user.schema.paths.created_at).to.be.ok();
expect(user.schema.paths.updated_at).to.be.ok();
expect(user.schema.paths.tokens).to.be.an( 'object' );

mongoose.model('User')({});




})

});