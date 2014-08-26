/*
 * GET admins listing.
 */

var _ = require('underscore')
  , debug = require('debug')('nodeblog:route:admin')
  
var scriptletUtil = require('../common/util/scriptletUtil.js')  
var H = require('../common/helper.js')
  , Done = H.Done
  , requestParser = require('./util/requestParser.js')
  , Redirector = require('./util/Redirector.js')
  , categoryService = require('../service/blogBoard/categoryService.js')
  
  
var admin = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/admin', this.adminView); //post로바꿔야함
		app.post('/ajax/category', this.insertCategory);
		app.post('/ajax/category/delete', this.deleteCategory);
		
	},
////////////////////////////
	adminView : function (req, res) {
		var redirector = new Redirector(res)
		var loginUser = requestParser.getLoginUser(req)
		
		if(!isAdmin(loginUser))  return redirector.main();
		
		var done = new Done(dataFn, redirector.catch);
		categoryService.getRootOfCategoryTree(done);
		function dataFn(rootOfCategoryTree) {
			var blog = { loginUser : loginUser
					   , rootOfCategoryTree : rootOfCategoryTree
					   , scriptletUtil : scriptletUtil
					   }; 
			res.render('./admin/adminLayout.ejs' , {blog : blog});	
		}
		
	},
	insertCategory: function (req, res) {
		var redirector = new Redirector(res)
		var loginUser = requestParser.getLoginUser(req)
		  , rawData = requestParser.getRawData(req)
		  , newTitle = rawData.newTitle
		  , parentId = rawData.parentId;
		
		debug('insertCategory : rawData : ', rawData);
		if(!isAdmin(loginUser))  return redirector.main()
		
		var done = new Done(dataFn, redirector.catch);
		categoryService.insertCategory(done, parentId, newTitle)
		function dataFn(status) {
			debug('insertCategory - categoryOrErrString : ', status);
			res.send(status.getMessage());
		}
	},
	deleteCategory: function (req, res) {
		var redirector = new Redirector(res)
		var loginUser = requestParser.getLoginUser(req)
		  , rawData = requestParser.getRawData(req)
		  , categoryId = rawData.categoryId;
		
		debug('deleteCategory - rawData : ', rawData);
		if(!isAdmin(loginUser))  return redirector.main()
		
		var done = new Done(dataFn, redirector.catch);
		categoryService.removeCategoryAndRemoveCategoryIdOfPost(done, categoryId)
		function dataFn(status) {
			debug('deleteCategory : categoryOrErrString : ', status);
			res.send(status.getMessage());
		}
	}

};
function isAdmin(loginUser) {
	if(loginUser.isNotExist() || loginUser.isNotEqualById(_getAdminId()) ) return false;
	else return true;
}
function _getAdminId() {
	return '6150493-github';
}