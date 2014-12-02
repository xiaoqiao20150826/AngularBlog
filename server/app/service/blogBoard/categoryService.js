/**
 * 
 */
/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */

var Q = require('q')

var H = require('../../common/helper.js')
  , Status = require('../../common/Status.js')
  , _ = require('underscore')
  , debug = require('debug')('nodeblog:service:categoryService')
  
var Category = require('../../domain/blogBoard/Category.js')
  , Joiner = require('../../dao/util/Joiner.js')

var categoryDAO = require('../../dao/blogBoard/categoryDAO.js')
  , postDAO = require('../../dao/blogBoard/postDAO.js')



/* define  */
var categoryService = module.exports = {};


//deprease
categoryService.getRootOfCategoryTree = function (allCategories) {
	var deferred = Q.defer()
	
	if(allCategories) Q(_returnRootOfCategoryTree(allCategories))
	
	categoryDAO.findAll()
	       .then(function (_allCategories) {
	    	   deferred.resolve(_returnRootOfCategoryTree(_allCategories))
	       })
	       .catch(function(err) {
	    	   deferred.reject(err);
	       });
	
	return deferred.promise;
	
	function _returnRootOfCategoryTree(categories) {
		return categoryService.categoriesToTree(categories, 'postCount', 0)
	 }
}
categoryService.categoriesToTree = function (categories, key4aggregate, delimiter, isToChild) {
	var isToChild = isToChild || false;
	var root = Category.makeRoot()
	  , categoryJoiner = new Joiner(categories, 'parentId', 'categories')
	categoryJoiner.setKey4aggregate(key4aggregate, delimiter, null, isToChild) 
	
	root = categoryJoiner.findNode(root, 'id')
	return categoryJoiner.treeTo(root, 'id')
} 


categoryService.insertCategory = function (parentId, newTitle) {
	if(_.isEmpty(parentId)) parentId = Category.getRootId(); 
	
	return categoryDAO.insertChild(parentId, newTitle);
}

// update post를 위한 함수. 그 이상으로 사용된다면 다시 생각.
categoryService.increaseOrDecreasePostCount = function(categoryId, originCategoryId) {
	
	if(categoryId == originCategoryId) { 
		return Q(Status.makeSuccess('categoryId == originCategoryId'))
	}

	return Q.all([
		            categoryDAO.increasePostCountById( categoryId)
		          , categoryDAO.decreasePostCountById( originCategoryId)  
		   	     ])
				 .then(function(statuses) {
					 return Status.reduceOne(statuses)
				 })
}
categoryService.increasePostCountById = function (categoryId) {
	if(H.notExist(categoryId)) return Q(Status.makeError('[fail] increase post count : categoryId is not exist , : ', categoryId))
	
	debug('increase categoryId : ', categoryId)
	return categoryDAO.increasePostCountById(categoryId);
}
categoryService.removeCategoryAndRemoveCategoryIdOfPost = function ( categoryId) {
	if(H.notExist(categoryId)) return Q(Status.makeError('[fail] remove: categoryId is not exist , : ', categoryId))
	
	return 	  categoryDAO.removeById( categoryId)
						 .then(function(status) {
							 if(status.isError()) return Q(status);
							 
							// 성공했을 경우 추가작업 
							 return postDAO.removeCategorId(categoryId);
						 })
}


// util
categoryService.allIdsOf = function (categoryId, allCategories) {
	var category = Category.createBy({id: categoryId})
	  , joiner = new Joiner(allCategories, 'parentId')
	
	joiner.setKey4aggregateToParent('id',',')
	var root = joiner.findNode(category, 'id')
	
	var categoryOfTree = joiner.treeTo(root, 'id')
      , ids = categoryOfTree['id'].split(',')
      
    return ids
}
