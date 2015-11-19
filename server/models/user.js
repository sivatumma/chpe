var bcrypt = require("bcrypt-nodejs"),
    uuid = require('node-uuid'),
    config = require('../config/config.js'),
    request = require('request'),
    browserMessages = require('../config/messages'),
    SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    LOCK_TIME = 2 * 60 * 60 * 1000;



module.exports = function(mongoose) {
    var Schema = mongoose.Schema;
    var usersSchema = Schema({
        username: {
            type: String,
            required: true,
            index: {
                unique: true
            }
        },
        password: {
            type: String,
            required: true
        },
        active: {
            type: Boolean,
            default: true
        },
        loginAttempts: {
            type: Number,
            required: true,
            default: 0
        },
        lockUntil: {
            type: Number
        },
        roles: [{
            type: String,
            default: 'creator'
        }],
        roleCount: {
            type: Number
        },
        provider: {
            type: Boolean,
            default: false
        },
        created_at: {
            type: Date,
            default: Date.now
        },
        updated_at: Date,
        tokens: [{
            _id: false,
            token: {
                type: String
            },
            token_created: {
                type: Date
            },
            token_expires: {
                type: Date
            }
        }],
        profile: {
            gender: {
                type: String,
                default: 'male',
                enum: 'male,female'.split(',')
            },
            age: {
                type: Number,
                default: 21
            },
            origin: String,
            married: {
                type: Boolean,
                default: false
            },
            children_under_18: {
                type: Number,
                default: 0
            },
            employer: String,
            occupation: String,
            interests: [{
                _id: false,
                text: {
                    type: String,
                    default: ''
                },
                type: {
                    type: String,
                    default: 'tourism'
                }
            }]
        },
        avatar: {
            type: String
        }

    });

    Date.prototype.addMinutes = function(m) {
        this.setMinutes(this.getMinutes() + m);
        return this;
    };


    usersSchema.virtual('isLocked').get(function() {
        return !!(this.lockUntil && this.lockUntil > Date.now());
    });
    usersSchema.pre('save', function(next) {
        var user = this;
        user.updated_at = new Date();
        if (!user.isModified('password')) return next();
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            });
        });
    });

    usersSchema.methods.comparePassword = function(candidatePassword, cb) {
        bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };

    usersSchema.methods.incLoginAttempts = function(cb) {
        if (this.lockUntil && this.lockUntil < Date.now()) {
            return this.update({
                $set: {
                    loginAttempts: 1
                },
                $unset: {
                    lockUntil: 1
                }
            }, cb);
        }
        var updates = {
            $inc: {
                loginAttempts: 1
            }
        };
        if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
            updates.$set = {
                lockUntil: Date.now() + LOCK_TIME
            };
        }
        return this.update(updates, cb);
    };

    var reasons = usersSchema.statics.failedLogin = {
        NOT_FOUND: 0,
        PASSWORD_INCORRECT: 1,
        MAX_ATTEMPTS: 2
    };


    usersSchema.statics.getAuthenticated = function(username, password, cb) {
        this.findOne({
            username: username
        }, function(err, user) {
            if (err) return cb(err);

            if (!user) {
                return cb(null, null, reasons.NOT_FOUND);
            }
            if (user.isLocked) {
                return user.incLoginAttempts(function(err) {
                    if (err) return cb(err);
                    return cb(null, null, reasons.MAX_ATTEMPTS);
                });
            }

            user.comparePassword(password, function(err, isMatch) {
                if (err) return cb(err);
                if (isMatch) {
                    if (!user.loginAttempts && !user.lockUntil) return cb(null, user);
                    var updates = {
                        $set: {
                            loginAttempts: 0
                        },
                        $unset: {
                            lockUntil: 1
                        }
                    };
                    return user.update(updates, function(err) {
                        if (err) return cb(err);
                        return cb(null, user);
                    });
                }

                user.incLoginAttempts(function(err) {
                    if (err) return cb(err);
                    return cb(null, null, reasons.PASSWORD_INCORRECT);
                });
            });
        });
    };

    usersSchema.statics.ssoLogin = function(req, res, next) {
        console.log("Starting ssoLogin");
        
        if (config.approvedAuthorizedAPIKeys.indexOf(req.query.API_KEY) >= 0) {
            // console.log("API Key is available");
            next(); 
        }
        /*if (config.approvedAuthorizedAPIKeys.indexOf(req.query.API_KEY) == -1)
            res.end(401, {message: 'Authentication token required.'});*/

        else if ( req.session.user !== undefined && req.session.user !== null )
            next();

        else if(req.body && req.body.SAMLResponse != null && req.body.RelayState != 'callhealth.com'){
            console.log("if,else,else in ssoLogin");

            req.session.samlResponse = req.body.SAMLResponse;

            var buf = new Buffer(req.body.SAMLResponse, 'base64'); // Ta-da
            var parseString = require('xml2js').parseString;
            var xml = buf.toString();
            console.log(xml);
            var that = this;
            parseString(xml, function(err, result) {
                var roles = {"10002":"creator","10003":"editor","10004":"publisher"};
                if(!err){
                    try{
                    req.session.user = {
                        username: result['saml2p:Response']['saml2:Assertion'][0]['saml2:Subject'][0]['saml2:NameID'][0]._,
                        sessionIndex: result['saml2p:Response']['saml2:Assertion'][0]['saml2:AuthnStatement'][0].$.SessionIndex,
                        roles : roles[result['saml2p:Response']['saml2:Assertion'][0]['saml2:Subject'][0]['saml2:NameID'][0]._]
                    };

                    res.header('user', req.session.user);

                    next();

                } catch(e){
                    req.session.user = null;
                    res.redirect('/ssoLogin');
                }
                }
            });
        }
        else {
            // Set the headers
            var headers = {
                'User-Agent': 'Super Agent/0.0.1',
                'Content-Type': 'application/x-www-form-urlencoded'
            }

           /* console.log("This is the referer", 'http://' + req.ip.split(':')[3] + req.url, req.originalURL, req.get('Referer'), req.get('Content-Type'));*/
            // Configure the request
            var options = {
                url: config.authentication.ssoEndpoint,
                method: 'POST',
                headers: headers,
                form: {
                    'idProvider': config.authentication.idProvider,
                    'spEntityID': config.authentication.spEntityID,
                    //'relayState':  'http://' + req.ip.split(':')[3] + ':91' + req.url
                    // 'relayState':  'http://172.19.6.71:91/ssoLogin'
                    'relayState':  'http://172.19.4.162:91/ssoLogin'
                }
            }

            // Start the request
            request(options, function(error, response, body) {
                if (!error && response.statusCode == 200) {
                    res.redirect(unescape(JSON.parse(body).url));
                }else{
                    console.log(response.statusCode, " .. [400 or 500]");
                }
            });
        }
    };

        
    usersSchema.statics.ssoLogout = function(req,res, next){
        console.log("Starting ssoLogout. The req.session.user = ", req.session.user);
      // if (req.session.user === undefined || req.session.user === null) {
      //   res.redirect("unAuthorized.html");
      // } else {
        console.log("Hey, req.session from jmeter is : ", req.session);
        var headers = {
            'User-Agent': 'Super Agent/0.0.1',
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          options = {
            // url: 'http://172.19.4.179:8080/sso/secureLogout',
            url: 'http://172.19.4.179:8080/CHSSO/sso/callhealth/secureLogout',
            method: 'POST',
            headers: headers,
            form: {
              'sessionIndex': req.session.user.sessionIndex,
              'spEntityID': 'callhealth.com',
              // 'idProvider': config.authentication.idProvider
            }
          };
        request(options, function(error, response, body) {
          req.session.user = null;
          console.log(response.statusCode);
          if(303 == response.statusCode ){
            console.log("redirecting to location ...");
            res.redirect(response.headers.location);
          }
          else {
            console.log(response.statuseCode, response.headers);
            res.status(response.statusCode).send();
          }
        });
      // }
  }
    usersSchema.statics.authorize = function(req, res, next) {
   console.log("hewlo world");

        if (config.approvedAuthorizedAPIKeys.indexOf(req.query.API_KEY) >= 0) {
            return next();
        }

        if (!req.headers['token']) {
            res.status(401).send({
                status: 'fail',
                message: browserMessages.userNotAuthorized
            });
        }


        //var uModel = (app == 'portal' )?mongoose.model('User'):mongoose.model('mUser');
        var uModel = mongoose.model('User');
        uModel.findOne({
            'tokens.token': req.headers['token']
        }, function(err, user) {
            if (err) {
                res.status('500').send({
                    message: err.message
                });
            }

            if (!user) res.status('403').end({
                status: 'fail',
                message: browserMessages.userNotAuthorized
            });


            if (user && user.tokens && user.tokens[user.tokens.length - 1]) {
                var diffdays = new Date().getTime() - (user.tokens[user.tokens.length - 1].token_expires).getTime();

                var minscount = Math.floor(diffdays / 60000);

                if (minscount < 15) {
                    uModel.findOneAndUpdate({
                        'tokens.token': req.headers['token']
                    }, {
                        $set: {
                            "tokens.$.token_expires": new Date().addMinutes(15)
                        }
                    }, function(err, data) {
                        req.user = data;

                        var user = req.user || {};
                        if (user && user.tokens && user.tokens[user.tokens.length - 1]) {
                            var tokenobject = {
                                token: user.tokens[user.tokens.length - 1].token,
                                token_created: user.tokens[user.tokens.length - 1].token_created,
                                token_expires: user.tokens[user.tokens.length - 1].token_expires
                            };
                            res.set(tokenobject);
                        }


                        next();
                        // res.send(data);
                    });


                } else {
                    console.log("here");
                    return res.status('403').send({
                        status: 'fail',
                        message: 'Authorization required.'
                    });
                }
            }
        });

    };

    var User = mongoose.model('User', usersSchema);
    

    return User;


}