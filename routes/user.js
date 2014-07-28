/*
 * GET users listing.
 */

var user = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/users', this.list);
		app.get('/cookie', this.cookieTest);
	},
////////////////////////////
	list : function(req, res) {
		res.send("respond with a resource");
	},
    cookieTest : function (req, res) {
	    res.send(req.headers);
    }
};

