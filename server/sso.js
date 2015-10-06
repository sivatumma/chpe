var express = require('express');
var app = express();

var request = require('request');


var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




// respond with "hello world" when a GET request is made to the homepage

app.get('/', function(req, res) {




// Set the headers
var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
}
 
// Configure the request
var options = {
    url: 'http://172.19.4.179:8080/CHSSO/sso/callhealth/secureLogin',
    method: 'POST',
    headers: headers,
    form: {            'idProvider': 'https://172.19.4.179:9443/samlsso',
                       'spEntityID': 'callhealth.com',
                       'relayState': 'http://localhost:3000/mypage'                                                      
                                                 }
}

// Start the request
request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {

        res.redirect(unescape(JSON.parse(body).url));

    }
});

});



app.all('/mypage',function(req,res)
{

console.log(req.body.SAMLResponse);
res.send("i am getting data");

})
app.listen(3000);