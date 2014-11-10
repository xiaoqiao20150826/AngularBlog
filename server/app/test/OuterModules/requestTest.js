var _ = require('underscore');
var request = require('request');
var express = require('express')
, http = require('http')

app = express();
server = http.createServer(app).listen(3000)

app.get('/', function (req, res) {
	var options = {
			url:'',
			host: '',
		    port: 82,
		};
		request(options, callback);
		function callback(error, response, body) {
		    if (!error && response.statusCode == 200) {
		    	res.write(body)
		    }
		}
});