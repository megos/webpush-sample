var express = require('express');
var fetch = require('node-fetch');
var app = express();



app.use(express.static(__dirname + '/client'));
console.log(express.static(__dirname + '/client'));
app.get('/api', function(req, res) {
	console.log(req.query);
	var endpoint = req.query.endpoint;
	fetch(endpoint, {
      method: 'post',
      mode: 'cors',
      body: ''
    }).then(function(response) {
      if (response.ok) {
        window.Demo.debug.log(SEND_OK_MESSAGE);
      } else {
        window.Demo.debug.log(SEND_NG_MESSAGE + response.status);
      }
    });
});

app.listen(3000);
