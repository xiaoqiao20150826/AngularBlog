/**
 * 
 */
/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */
var H = require('../common/helper.js')
  , _ = require('underscore')
  
var Category = require('../domain/Category.js')

var categoryDAO = require('../dao/categoryDAO.js')



/* define  */
var categoryService = module.exports = {};

categoryService.findAll = function (done) {
	return categoryDAO.findAll(done);
}
categoryService.insertCategory = function (done, parentId, newTitle) {
	var parent = Category.getRoot();
	if(!(_.isEmpty(parentId) || parentId == 'root')) parent = Category.createBy({id:parentId}); 
	
	return categoryDAO.insertChildToParentByTitle(done, parent, newTitle);
}