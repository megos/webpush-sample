var express = require('express');
var fetch = require('node-fetch');
var bodyParser = require('body-parser');


var GCM_ENDPOINT = 'https://android.googleapis.com/gcm/send';
var FIREFOX_ENDPOINT = 'https://updates.push.services.mozilla.com/push';
var API_KEY = '<Your Public API Key from https://console.developers.google.com>';

var app = express();

app.set('port', (process.env.PORT) || 3000);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/static'));

app.post('/api', function(req, res) {

  if (req.body.endpoint && req.body.browser) {

    if (req.body.browser === 'firefox') {
      fetch(FIREFOX_ENDPOINT + '/' + req.body.endpoint, {
        method: 'post',
        body: ''
      }).then(function(response) {
        if (response.ok) {
          res.send('OK');
        } else {
          res.status(400);
          res.send('NG');
        }
      }).catch(function(response) {
        res.status(400);
        res.send('NG');
      });
    } else if (req.body.browser === 'chrome') {
      fetch(GCM_ENDPOINT, {
        headers: {
          'Authorization': 'key=' + API_KEY,
          'Content-Type': 'application/json'
        },
        method: 'post',
        body: JSON.stringify({
          registration_ids: [req.body.endpoint]
        })
      }).then(function(response) {
        if (response.ok) {
          res.send('OK');
        } else {
          res.status(400);
          res.send('NG');
        }
      }).catch(function(response) {
        res.status(400);
        res.send('NG');
      });
    } else {
      res.status(400);
      res.send('NG');
    }
  }
});

app.use(function(req, res, next){
  res.status(404);
  res.end('404 Error : ' + req.path);
});

app.use(function(err, req, res, next){
  res.status(500);
  res.end('500 Error : ' + err);
});

app.listen(app.get('port'));
