/*
 * GET home page.
 */

var blog = {
	list : function(req, res) {
		res.render('./blog/list.ejs', {title : 'Express'} );
	},
	detail : function(req,res) {
		res.render('./blog/detail.ejs');
	}
};

module.exports = blog;