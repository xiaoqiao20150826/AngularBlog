/**
 * New node file
 */

var test = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/comments', this.comments);
		app.get('/test', this.test, function() {
			console.log('next() test');
		});
	},
	// //////////////////////////
	test : function(req, res, next) {
		res.send('req' + req.toString() + '<hr>' + 'res' + res.toString());
//		next();
		
		function User2(data) {
			console.log(this);
		};
		User2();
		var a = new User2();
	},
	comments : function(req, res, next) {
		res.render('./test/comments.ejs');
	}
};
