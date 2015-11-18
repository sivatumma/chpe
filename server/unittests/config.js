var config = require('../config/config.js');
var expect = require('expect.js');

describe('fileds',function(){


it('fileds are missing in config file',function(){
// application variable

expect(config.application.root_path).to.be.ok();
expect(config.application.addPrefixes).to.be.ok();
expect(config.application.logFilenamePrefix).to.equal('');
expect(config.application.modelNamePrefix).to.equal('');
expect(config.application.http_port).to.be.ok();
expect(config.application.https_port).to.be.ok();
// authentication variable

expect(config.authentication.ssoEndpoint).to.be.ok();
expect(config.authentication.idProvider).to.be.ok();
expect(config.authentication.spEntityID).to.be.ok();

//logFiles variable

expect(config.logFiles.databaseLogFile).to.be.ok();
expect(config.logFiles.webserverLogFile).to.be.ok();
expect(config.logFiles.exceptionLogFile).to.be.ok();
expect(config.logFiles.plainLogFile).to.be.ok();


// configVariable
expect(config.configVariable.user.Discount).to.be.ok();
expect(config.configVariable.admin.Discount).to.be.ok();
expect(config.configVariable.loginUser).to.be.ok();

//Global Variable
expect(config.modelsFolder).to.be.ok();
expect(config.database).to.be.ok();
expect(config.memcache_host).to.be.ok();
expect(config.app_name).to.be.ok();
expect(config.app_root).to.be.ok();
expect(config.temp).to.be.ok();
expect(config.certificates_dir).to.be.ok();
expect(config.old_pricing_engine_app_root).to.be.ok();
expect(config.pricing_engine_app_root).to.be.ok();
expect(config.approvedAuthorizedAPIKeys).to.be.ok();
expect(config.modelsFolder).to.be.ok();
expect(config.modelsFolder).to.be.ok();
expect(config.services_json_path).to.be.ok();
expect(config.env).to.be.ok();

});



});
