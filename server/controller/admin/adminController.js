/*
 * GET admins listing.
 */

var _ = require('underscore')
  , debug = require('debug')('nodeblog:route:admin')
  
var scriptletUtil = require('../../common/util/scriptletUtil.js')  
var H = require('../../common/helper.js')
  , Done = H.Done
  , requestParser = require('../util/requestParser.js')
  , Redirector = require('../util/Redirector.js')
  , categoryService = require('../../service/blogBoard/categoryService.js')
var User = require('../../domain/User.js')
  
  
var admin = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/admin', this.adminView); //post로바꿔야함
		app.post('/admin/category/insert', this.insertCategory);
		app.post('/admin/category/delete', this.deleteCategory);
		
	},
////////////////////////////
	adminView : function (req, res) {
		var redirector = new Redirector(res)
		var loginUser = requestParser.getLoginUser(req)
		
		if(!_isAdmin(loginUser))  return redirector.main();
		
		var done = new Done(dataFn, redirector.catch);
		categoryService.getRootOfCategoryTree(done);
		function dataFn(rootOfCategoryTree) {
			var blog = { loginUser : loginUser
					   , rootOfCategoryTree : rootOfCategoryTree
					   , scriptletUtil : scriptletUtil
					   }; 
			return res.render('./wholeFrame/admin/admin.ejs',{blog : blog});	
		}
		
	},
	insertCategory: function (req, res) {
		var redirector = new Redirector(res)
		var loginUser = requestParser.getLoginUser(req)
		  , rawData = requestParser.getRawData(req)
		  , newTitle = rawData.newTitle
		  , parentId = rawData.parentId;
		
		debug('insertCategory : rawData : ', rawData);
		if(!_isAdmin(loginUser))  return redirector.main();
		
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
		if(!_isAdmin(loginUser))  return redirector.main();
		
		var done = new Done(dataFn, redirector.catch);
		categoryService.removeCategoryAndRemoveCategoryIdOfPost(done, categoryId)
		function dataFn(status) {
			debug('deleteCategory : categoryOrErrString : ', status);
			res.send(status.getMessage());
		}
	}

};
// admin 과 test 유저가 카테고리 조작가능.
function _isAdmin(loginUser) {
	var testerId = User.getTester()._id
	if(loginUser.isEqualById(_getAdminId() )) return true;
	if(loginUser.isEqualById(testerId)) return true;
		
	return false;
}
function _getAdminId() {
	return '6150493-github';
}