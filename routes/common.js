/*
 * GET home page.
 */

var common = {
	list : function(req, res) {
		res.render('./layout.ejs', {title : 'Express'} );
	}
};
module.exports = common;