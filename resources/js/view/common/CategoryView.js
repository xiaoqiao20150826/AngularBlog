/**
 * 
 */

$$namespace.include(function(require, module){
	
	var viewUtil = require('/view/util/viewUtil')

	var CATEGORY_BTNS = '.blogCategory'
	var CATEGORY_INSERT_FORM_ID = "#categoryInsertForm"
	  , CATEGORY_DELETE_FORM_ID = "#categoryDeleteForm"
	  , ROOT_ID = 'root'
		  
	var CategoryView = module.exports = function CategoryView() {
		// 이건 초기 효과 주지말자. rootId를 찾기가 곤란하고, 없어도 될것같음.
	}
	
	CategoryView.prototype.getDataMap = function($categoryBtn) {
		var ds = $categoryBtn.data()
		  , title = $categoryBtn.text()
		  , categoryData = {id:ds.id, title:title}
		  
		return categoryData
	}
	CategoryView.prototype.get$btns4find = function() { return $(CATEGORY_BTNS) }
	CategoryView.prototype.get$insertForm = function() { return $(CATEGORY_INSERT_FORM_ID) }
	CategoryView.prototype.get$deleteForm = function() { return $(CATEGORY_DELETE_FORM_ID) }
	
	CategoryView.prototype.isRoot = function (categoryId) {
		if(categoryId == ROOT_ID) return true
		else return false;
	}
	
	CategoryView.prototype.assignEffect = function (id) {
		var all$btns = this.get$btns4find()
		  , $btn = viewUtil.find$btn(all$btns, id, 'id')
		  
		viewUtil.assignBgColorTo$btn($btn, all$btns)
	}
});

//@ sourceURL=/view/CategoryView.js