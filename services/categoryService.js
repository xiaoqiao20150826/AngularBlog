/**
 * 
 */
/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var H = require('../common/helper.js')
  , _ = require('underscore')
  , debug = require('debug')('nodeblog:service:categoryService')
  
var Category = require('../domain/Category.js')
  , Joiner = require('../domain/Joiner.js')

var categoryDAO = require('../dao/categoryDAO.js')



/* define  */
var categoryService = module.exports = {};

categoryService.getJoinedCategories = function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  
	H.call4promise(categoryDAO.findAll)
	 .then(function(categories) {
		var categoryJoiner = new Joiner(categories, 'parentId', 'categories')
		var rootOfTree = categoryJoiner.treeTo(Category.makeRoot(),'id')
		dataFn(rootOfTree.categories)
		debug('joinedCategories : ',rootOfTree.categories)
	 })
	 .catch(errFn);
}
categoryService.insertCategory = function (done, parentId, newTitle) {
	var parent = Category.makeRoot();
	if(!(_.isEmpty(parentId) || parentId == 'root')) parent = Category.createBy({id:parentId}); 
	
	return categoryDAO.insertChildToParentByTitle(done, parent, newTitle);
}