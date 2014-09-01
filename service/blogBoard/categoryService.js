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
  , Status = require('../../dao/util/Status.js')

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
categoryService.categoriesToTree = function (categories, key4aggregate, delimiter, isToChild) {
	var isToChild = isToChild || false;
	var root = Category.makeRoot()
	  , categoryJoiner = new Joiner(categories, 'parentId', 'categories')
	categoryJoiner.setKey4aggregate(key4aggregate, delimiter, null, isToChild) 
	
	root = categoryJoiner.findNode(root)
	return categoryJoiner.treeTo(root, 'id')
} 


categoryService.insertCategory = function (done, parentId, newTitle) {
	var parent = Category.createBy({id:parentId});
	if(_.isEmpty(parentId) || parentId == 'root') {parent = Category.makeRoot(); } 
	
	return categoryDAO.insertChildToParentByTitle(done, parent, newTitle);
}

// update post를 위한 함수. 그 이상으로 사용된다면 다시 생각.
categoryService.increaseOrDecreasePostCount = function(done, categoryId, originCategoryId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  
	if(categoryId == originCategoryId) return dataFn(Status.makeSuccess());

	return H.all4promise([
			                [categoryDAO.increasePostCountById, categoryId]
			              , [categoryDAO.decreasePostCountById, originCategoryId]  
						 ])
				          .then(dataFn)
						  .catch(errFn)
}
categoryService.increasePostCountById = function (done, categoryId) {
//	if(_.isEmpty(categoryId)) categoryId = Category.rootId
	if(_.isEmpty(categoryId)) return;
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
