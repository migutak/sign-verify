var crypto = require('crypto');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/sign', function (req, res) {
    const keyheader = "-----BEGIN RSA PRIVATE KEY-----\n"
    const key = req.headers.privatekey;
    const keyfooter = "\n-----END RSA PRIVATE KEY-----"
    var privatekey = keyheader + key + keyfooter;

    var signer = crypto.createSign('sha256');
    signer.update(JSON.stringify(req.body.message));
    var sign = signer.sign(privatekey, 'base64');

    res.json({
        signature: sign
    })
})

app.post('/verify', function (req, res) {
    const keyheader = "-----BEGIN PUBLIC KEY-----\n"
    const key = req.headers.publickey;
    const keyfooter = "\n-----END PUBLIC KEY-----"
    var publickey = keyheader + key + keyfooter;

    var verifier = crypto.createVerify('sha256');
    verifier.update(JSON.stringify(req.body.message));
    var ver = verifier.verify(publickey, req.headers.signature, 'base64');

    res.json({
        result: ver
    })
})

var server = app.listen(3010, function () {
    console.log('Server running at ');
});
