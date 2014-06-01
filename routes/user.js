/*
 * GET users listing.
 */

var user = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/users', this.list);
	},
////////////////////////////
	list : function(req, res) {
		res.send("respond with a resource");
	}
};

