/*
 * GET admins listing.
 */

var _ = require('underscore')
  , debug = require('debug')('nodeblog:route:admin')
  
var scriptletUtil = require('../common/util/scriptletUtil.js')  
var H = require('../common/helper.js')
  , reqParser = require('./common/reqParser.js')
  , categoryService = require('../services/categoryService.js')
  
  
var admin = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/admin', this.adminView); //post로바꿔야함
		app.post('/ajax/category', this.insertCategory);
//		app.post('/admin/category', this.insertCategory);
//		app.post('/admin/category/delete', this.deleteCategory);
		
	},
////////////////////////////
	adminView : function (req, res) {
		var loginUser = reqParser.getLoginUser(req)
		
		if(!isAdmin(loginUser))  return _redirectMain(res);
		
		var done = new Done(dataFn, catch1(res));
		categoryService.getJoinedCategories(done);
		function dataFn(categories) {
			var blog = { loginUser : loginUser
					   , categories : categories
					   , scriptletUtil : scriptletUtil
					   }; 
			res.render('./admin/adminLayout.ejs' , {blog : blog});	
		}
		
	},
	insertCategory: function (req, res) {
		var loginUser = reqParser.getLoginUser(req)
		  , rawData = reqParser.getRawData(req)
		  , newTitle = rawData.newTitle
		  , parentId = rawData.parentId;
		
		debug('insertCategory : rawData : ', rawData);
		if(!isAdmin(loginUser))  return _redirectMain(res);
		
		var done = new Done(dataFn, catch1(res));
		categoryService.insertCategory(done, parentId, newTitle)
		function dataFn(categoryOrErrString) {
			debug('insertCategory : categoryOrErrString : ', categoryOrErrString);
			if(_.isString(categoryOrErrString)) return res.send(categoryOrErrString);
			if(!(categoryOrErrString.isEmpty())) return res.send('success');
		}
	}
//	deleteCategory: function (req, res) {
//		var loginUser = reqParser.getLoginUser(req)
//		, rawData = reqParser.getRawData(req)
//		, titles = rawData.title.split(';')
//		, categories = Category.createBy(titles);
//		console.debug(titles);
//		if(!isAdmin(loginUser))  return _redirectMain(res);
//		
//		var errFn = catch1(res)
//		  , done = new Done(dataFn, errFn);		
//		
//		console.debug(categories);
//		if(_.isEmpty(categories)) return res.redirect('/admin');
//		if(categories.length == 1) {
//			var parentCategory = _.first(categories);
//			console.debug(parentCategory);
//			return categoryDAO.removeOne(done, parentCategory);
//		} else {
//			var fromCategory = _.first(categories)
//			  , childTitle = _.last(categories).title;
//			return categoryDAO.removeChildTitleFromCategory(new Done(dataFn, errFn), childTitle, fromCategory)
//		}
//		
//		function dataFn() {
//			res.redirect('/admin');
//		}
//	}
	


};
function catch1(res) {
	return function(err) {
		res.send(new Error(err));
	}
}
function isAdmin(loginUser) {
	if(loginUser.isNotExist() || loginUser.isNotEqualById(_getAdminId()) ) return false;
	else return true;
}
function _redirectMain(res) {
	res.redirect('/');
} 
function _getAdminId() {
	return '6150493-github';
}