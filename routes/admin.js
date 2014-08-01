/*
 * GET admins listing.
 */

var _ = require('underscore');

var H = require('../common/helper.js')
  , reqParser = require('./common/reqParser.js')
  , Category = require('../domain/Category.js')
  , categoryDAO = require('../dao/categoryDAO.js')
  
  
var admin = module.exports = {
	mapUrlToResponse : function(app) {
		app.get('/admin', this.adminView); //post로바꿔야함

		app.post('/admin/category', this.insertCategory);
		app.post('/admin/category/delete', this.deleteCategory);
		
	},
////////////////////////////
	adminView : function (req, res) {
		var loginUser = reqParser.getLoginUser(req)
		  , rawData = reqParser.getRawData(req)
		
		//TODO : 로긴유저가 관리자인지 확인하는 코드.
		if(loginUser.isNotExist() || loginUser.isNotEqualById(_getAdminId()) )  return _redirectMain(res);
		
		var errFn = catch1(res)
		  , done = new Done(dataFn, errFn);
		categoryDAO.findAll(done);
		function dataFn(categories) {
			var blog = {loginUser : loginUser
					  , categories : categories}; 
			res.render('./admin/adminLayout.ejs',{blog : blog});	
		}
		
	},
	insertCategory: function (req, res) {
		var loginUser = reqParser.getLoginUser(req)
		  , rawData = reqParser.getRawData(req)
		  , titleToInsert = rawData.titleToInsert
		  , category = Category.createBy(rawData);
		
		if(loginUser.isNotExist() || loginUser.isNotEqualById(_getAdminId()) )  return _redirectMain(res);
		
		var errFn = catch1(res)
		  , done = new Done(dataFn, errFn);
		
		if(category.isParent()) {
			var toCategory = category
			, childTitle = titleToInsert;
			return categoryDAO.pushChildTitleToCategory(done, childTitle, toCategory);
		} else {
			return categoryDAO.insertByTitle(done, titleToInsert)  
		}
		function dataFn() {
			res.redirect('/admin');
		}
	},
	deleteCategory: function (req, res) {
		var loginUser = reqParser.getLoginUser(req)
		, rawData = reqParser.getRawData(req)
		, titles = rawData.title.split(';')
		, categories = Category.createBy(titles);
		console.log(titles);
		if(loginUser.isNotExist() || loginUser.isNotEqualById(_getAdminId()) )  return _redirectMain(res);
		
		var errFn = catch1(res)
		  , done = new Done(dataFn, errFn);		
		
		console.log(categories);
		if(_.isEmpty(categories)) return res.redirect('/admin');
		if(categories.length == 1) {
			var parentCategory = _.first(categories);
			console.log(parentCategory);
			return categoryDAO.removeOne(done, parentCategory);
		} else {
			var fromCategory = _.first(categories)
			  , childTitle = _.last(categories).title;
			return categoryDAO.removeChildTitleFromCategory(new Done(dataFn, errFn), childTitle, fromCategory)
		}
		
		function dataFn() {
			res.redirect('/admin');
		}
	}
	


};
function catch1(res) {
	return function(err) {
		res.send(new Error(err));
	}
}
function _redirectMain(res) {
	res.redirect('/');
} 
function _getAdminId() {
	return '6150493-github';
}