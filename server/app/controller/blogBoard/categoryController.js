

/* 초기화 및 클래스 변수 */

var debug = require('debug')('nodeblog:controller:categoryController')
var _ = require('underscore')
var H = require('../../common/helper.js')
  
var JsonResponse = require('../util/JsonResponse.js')
  , AuthRequest   = require('../util/AuthRequest.js')
  
var Category = require('../../domain/blogBoard/Category')
  , categoryService = require('../../service/blogBoard/categoryService')
  

var categoryController = module.exports = {}
/* 클라이언트의 요청을 컨트롤러에 전달한다.*/
categoryController.mapUrlToResponse = function(app) {
		// json. 
		app.get('/json/blogBoard/category/list', this.sendCategoryList)
		
		app.post('/json/blogBoard/category/insert', this.insertCategory)
		app.post('/json/blogBoard/category/delete', this.deleteCategory)
		app.post('/json/blogBoard/category/update', this.updateCategory)

}	
	
/* json 응답. */
// -------------- category CRUD

categoryController.sendCategoryList = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	
	categoryService.getRootOfCategoryTree()
	 			   .then(function (rootOfCategoryTree) {
						return jsonRes.send(rootOfCategoryTree);
				   })
				   .catch(jsonRes.catch())	
}

categoryController.insertCategory = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req);
	
	var loginUser 	= authReq.getLoginUser(req)
	var rawData 	= authReq.getRawData(req)
	  , newTitle 	= rawData.newTitle
	  , parentId 	= rawData.parentId;
	
	debug('insertCategory : rawData : ', rawData);
	
	if(loginUser.isNotAdmin())  return jsonRes.sendFail('login user is not admin');
	
	categoryService.insertCategory(parentId, newTitle)
	.then(function dataFn(status) {
		debug('insertCategory - categoryOrErrString : ', status);
		
		return jsonRes.send(status);
	})
	.catch(jsonRes.catch())
}

categoryController.updateCategory = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req);
	
	var loginUser 	= authReq.getLoginUser(req)
	var rawData 	= authReq.getRawData(req)
	  , newTitle 	= rawData.newTitle
	  , categoryId 	= rawData.categoryId;
	
	debug('insertCategory : rawData : ', rawData);
	
	if(loginUser.isNotAdmin())  return jsonRes.sendFail('login user is not admin');
	
	여기가틀림.
	categoryServiceegory(categoryId, newTitle)
	.then(function dataFn(status) {
		debug('insertCategory - categoryOrErrString : ', status);
		return jsonRes.send(status);
	})
	.catch(jsonRes.catch())
}

categoryController.deleteCategory = function (req, res) {
	var jsonRes 	= new JsonResponse(res)
	  , authReq 	= new AuthRequest(req);
	
	var loginUser 	= authReq.getLoginUser(req)
	var rawData 	= authReq.getRawData(req)
	  , categoryId 	= rawData.categoryId;
	
	debug('deleteCategory : rawData : ', rawData);
	
	if(loginUser.isNotAdmin())  return jsonRes.sendFail('login user is not admin');
	if(categoryId == Category.getRootId())  return jsonRes.sendFail('root can not delete');
	
	categoryService.removeCategoryAndRemoveCategoryIdOfPost(categoryId)
	.then(function dataFn(status) {
		debug('deleteCategory : categoryOrErrString : ', status);
		return jsonRes.send(status);
	})
	.catch(jsonRes.catch())
}

