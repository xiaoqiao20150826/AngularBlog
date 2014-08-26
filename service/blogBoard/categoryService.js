/**
 * 
 */
/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var H = require('../../common/helper.js')
  , Done = H.Done
  , _ = require('underscore')
  , debug = require('debug')('nodeblog:service:categoryService')
  
var Category = require('../../domain/blogBoard/Category.js')
  , Joiner = require('../../dao/util/Joiner.js')

var categoryDAO = require('../../dao/blogBoard/categoryDAO.js')
  , postDAO = require('../../dao/blogBoard/postDAO.js')



/* define  */
var categoryService = module.exports = {};


//deprease
categoryService.getRootOfCategoryTree = function (done, allCategories) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	if(allCategories) return returnRootOfCategoryTree(allCategories); 
	
	return H.call4promise(categoryDAO.findAll)
	 	    .then(returnRootOfCategoryTree)
	        .catch(errFn);
	
	function returnRootOfCategoryTree(categories) {
		var rootOfTree = categoryService.categoriesToTree(categories, 'postCount', 0)
		return dataFn(rootOfTree)
	 }
}
categoryService.categoriesToTree = function (categories, key4sumTo, delimiter, isToChild) {
	var isToChild = isToChild || false;
	var root = Category.makeRoot()
	  , categoryJoiner = Category.getJoiner4sumTo(categories, key4sumTo, delimiter, isToChild)
	  
	root = categoryJoiner.findNode(root)
	var rootOfTree = categoryJoiner.treeTo(root)
//	debug('getRootOfCategoryTree : ',rootOfTree)
	return rootOfTree
} 


categoryService.insertCategory = function (done, parentId, newTitle) {
	var parent = Category.createBy({id:parentId});
	if(_.isEmpty(parentId) || parentId == 'root') {parent = Category.makeRoot(); } 
	
	return categoryDAO.insertChildToParentByTitle(done, parent, newTitle);
}
categoryService.increasePostCountById = function (done, categoryId) {
	var dataFn = done.getDataFn();
	if(_.isEmpty(categoryId)) categoryId = Category.rootId
	
	debug('increase categoryId : ', categoryId)
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
