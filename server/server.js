var config = require('./config.js')(process.env.env);
var express = require('express');
var routes = require('./routes');
var https = require('https');
var http = require('http');
var ws = require("ws");
var path = require('path');
var mongoose = require('mongoose');
var app = express();
var fs = require('fs');
var ipfilter = require('express-ipfilter');

var morgan = require('morgan');


http.globalAgent.maxSockets = 1000;

require('./models/associate.js')(mongoose);
require('./models/consumer.js')(mongoose);
require('./models/product.js')(mongoose);
require('./models/roles.js')(mongoose);
require('./models/scheme.js')(mongoose);
require('./models/user.js')(mongoose);
require('./models/new_scheme.js')(mongoose);
require('./models/order.js')(mongoose);
require('./models/diagnostic.js')(mongoose);
require('./models/TestModel.js')(mongoose);

var logFile = fs.createWriteStream('./pricingEngine.log', {flags: 'a'}); //use {flags: 'w'} to open in write mode

app.configure(function() {
    app.set('default_http_port', process.env.PORT || 90);
    app.set('default_https_port', 443)
    app.set('config', config);
    app.set('env', config.env);

    app.use(morgan('combined',{stream:logFile}));

    // app.get('/', routes.index);
    //app.use(ipfilter(['127.0.0.1','localhost'],{mode:"allow"}));

    app.use(function(req, res, next) {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept');
        next();
    });
    //app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.compress());
    app.use(express.json({
        limit: '500mb'
    }));
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.cookieParser('secret'));
    app.use(express.cookieSession({
        secret: 'tobo!',
        maxAge: 360 * 5
    }));
    app.use(express.session({
        secret: 'keyboard cat'
    }));
    app.use(app.router);
    // app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.static(path.join(__dirname, 'ui')));
    app.use('.html', require('jade'));
    // app.use('/test/pricingengine', express.static(config.pricing_engine_app_root));
    app.get('/old-pe', express.static(config.old_pricing_engine_app_root));
    app.use('/', express.static(config.pricing_engine_app_root));
    app.use('/services', express.static(config.services_json_path));

    // development only
    app.use(express.errorHandler());

});


app.get('/', express.static(config.pricing_engine_app_root));
app.get('/old-pe', express.static(config.old_pricing_engine_app_root));
app.use(express.static('src-ui', {
    maxAge: 86400000
}));
var user = require('./routes/user.js')(app);
var fixtures = require('./routes/fixtures.js')(app);
var api = require('./routes/api.js')(app);


app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


require('./routes/proxy.js')(app);
var options = {
    db: { native_parser: true },
    server: {
        connectTimeoutMS: 10000, 
        poolSize: 20
    },
    replset: { rs_name: 'PricingEngineReplicaSet0' }
    // user: 'myUserName',
    // pass: 'myPassword'
};
mongoose.connect(config.database, options);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('error', function(err){console.log(err.stack);});

var server_credentials = {
    key: fs.readFileSync(path.join(config.certificates_dir, 'server.key')),
    ca: fs.readFileSync(path.join(config.certificates_dir, 'server.csr')),
    cert: fs.readFileSync(path.join(config.certificates_dir, 'server.crt'))
};

db.once('open', function callback() {
    https.createServer(server_credentials, app).listen(app.get('default_https_port'), function() {
        console.log('Express HTTPS server listening on port ' + app.get('default_https_port'));
    });
    http.createServer(app).listen(app.get('default_http_port'), function() {
        console.log('Express server listening on port ' + app.get('default_http_port'));
    });


    var wsServer = require('ws').Server,
        wss = new wsServer({
            port: 8001
        });

    wss.on('connection', function(ws) {
        console.log("Web Socket is listening on 8001");
        ws.on('message', function(message) {
            console.log('received: %s', message);
        });
        setInterval(function() {
            try {
                ws.send(Math.floor(Math.random() * 100) + "");
            } catch (e) {}
        }, 100);
    });

});

// var acl = require('acl');
// console.log(acl);
// acl = new acl(new acl.mongodbBackend(db, 'clsdev'));
// acl.addUserRoles('joed', 'guest');
// acl.allow('guest', 'index.html', 'view');
// acl.middleware();

// console.log(acl.isAllowed('guest', 'index.html', 'view'));

process.on('uncaughtException', function(err) {
    console.log(err)
    console.log(err.stack);
    // process.exit(1);
});

//  More efficient error handling as someone said is a node official recommendation - Is to use "domain"
domain = require('domain'),
d = domain.create();

d.on('error', function(err) {
  console.log("===============================================Error - caught an error==========================================");
  console.error(err.stack);
});