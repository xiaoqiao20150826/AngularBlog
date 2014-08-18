/**
 * 
 */
/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var H = require('../common/helper.js')
  , Done = H.Done
  , _ = require('underscore')
  , debug = require('debug')('nodeblog:service:categoryService')
  
var Category = require('../domain/Category.js')
  , Joiner = require('../domain/Joiner.js')

var categoryDAO = require('../dao/categoryDAO.js')
  , postDAO = require('../dao/postDAO.js')



/* define  */
var categoryService = module.exports = {};

categoryService.getRootOfCategoryTree = function (done) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  
	H.call4promise(categoryDAO.findAll)
	 .then(function(categories) {
		var categoryJoiner = new Joiner(categories, 'parentId', 'categories')
		categoryJoiner.setKey4count('postCount')
		var rootOfTree = categoryJoiner.treeTo(Category.makeRoot(),'id')
		dataFn(rootOfTree)
		debug('joinedCategories : ',rootOfTree)
	 })
	 .catch(errFn);
}
categoryService.insertCategory = function (done, parentId, newTitle) {
	var parent = Category.makeRoot();
	if(!(_.isEmpty(parentId) || parentId == 'root')) parent = Category.createBy({id:parentId}); 
	
	return categoryDAO.insertChildToParentByTitle(done, parent, newTitle);
}
categoryService.increasePostCountById = function (done, categoryId) {
	var dataFn = done.getDataFn();
	if(_.isEmpty(categoryId) || Category.isRoot(categoryId)) return dataFn(null);
	
	return categoryDAO.increasePostCountById(done, categoryId);
}
categoryService.removeCategoryAndRemoveCategoryIdOfPost = function (done, categoryId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  
	H.call4promise(categoryDAO.removeById, categoryId)
	 .then(function(status) {
		 if(status.isError()) return dataFn(status);
		 
		 if(status.isSuccess()) {
			 dataFn(status);
			//비동기 작업
			 return postDAO.removeCategorId(Done.makeEmpty(), categoryId); 
		 }
	 })
}
