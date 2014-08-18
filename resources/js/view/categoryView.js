/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/viewUtil')
	
	var category = { class : '.blogCategory'}
	var CATEGORY_INSERT_FORM_ID = "#categoryInsertForm"
	  , CATEGORY_DELETE_FORM_ID = "#categoryDeleteForm"
	  , ROOT_ID = 'root'
		  
	var categoryView = module.exports = {}
	
	categoryView.init = function (app) {
		
	}
	categoryView.getDataMap = function($categoryBtn) {
		var ds = $categoryBtn.data()
		  , title = $categoryBtn.text()
		  , categoryData = {id:ds.id, title:title}
		  
		return categoryData
	}
	categoryView.get$buttons = function() { return $(category.class) }
	categoryView.get$insertForm = function() { return $(CATEGORY_INSERT_FORM_ID) }
	categoryView.get$deleteForm = function() { return $(CATEGORY_DELETE_FORM_ID) }
	
	categoryView.active = function (blogMap) {
	}
	categoryView.isRoot = function (categoryId) {
		if(categoryId == ROOT_ID) return true
		else return false;
	}
});

//@ sourceURL=/view/categoryView.js