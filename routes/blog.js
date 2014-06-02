
var blog = module.exports = {
/////////////////////
	mapUrlToResponse : function(app) {
		app.get('/', this.list);
		app.get('/login', this.login);
		app.get('/detail', this.detail); //temp..rest로변경해야함.
	},	
////////////////////		
	list : function(req, res) {
		res.render('./blog/list.ejs', {title : 'Express'} );
	},
	detail : function(req,res) {
		res.render('./blog/detail.ejs');
	},
	login : function(req,res) {
		res.render('./blog/login.ejs');
	}
};
