var express = require('express');
var app = express();
var Lights = require('./lights.js').Lights;


var port = process.env.PORT || 8080;

var lights = new Lights();

// ROUTES
var router = express.Router();


router.get('/on', function(req, res) {
  lights.setOnTo(true);
});

router.get('/off', function(req, res) {
  lights.setOnTo(false);
});

router.get('/set_bri/:val', function(req, res) {
  lights.setBrightnessTo(req.params.val);
});

router.get('/inc_bri', function(req, res) {
  lights.incrementBrightnessBy(80);
});

router.get('/dec_bri', function(req, res) {
  lights.incrementBrightnessBy(-80);
});

router.get('/inc_ct', function(req, res) {
  lights.incrementColorTempBy(140);
});

router.get('/dec_ct', function(req, res) {
  lights.incrementColorTempBy(-140);
});


// REGISTER ROUTES
app.use('/', router);


// START
app.listen(port);
console.log('happening now on port: ' + port);

