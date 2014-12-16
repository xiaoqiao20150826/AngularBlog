/*
 * GET users listing.
 */

var debug = require('debug')('nodeblog:controller:userController')
var _ 	  = require('underscore')
  , Q 	  = require('q');


var Status		  = require('../../common/Status.js')
var H 			  = require('../../common/helper.js')
  , AuthRequest   = require('../util/AuthRequest.js')
  , JsonResponse  = require('../util/JsonResponse')
  
var Transaction = require('../../dao/util/transaction/Transaction')
var User = require('../../domain/User')
  , userDAO = require('../../dao/userDAO')
  , answerDAO = require('../../dao/blogBoard/answerDAO')
  , postDAO = require('../../dao/blogBoard/postDAO')
var categoryService = require('../../service/blogBoard/categoryService')
  , blogBoardService = require('../../service/blogBoard/blogBoardService')

////  
  
/////  
var userController = module.exports = {}
userController.mapUrlToResponse = function(app) {
	app.get('/json/user/loginUser', this.getLoginUser)
	app.get('/json/user', this.getUser);//
	app.post('/json/user/update', this.update)

	app.post('/json/user/delete', this.delete)
//	app.get('/user/me', this.loginUserView);// 순서주의
//	
//	app.get('/user/:userId/updateView', this.updateView)
//	
	///////
}

userController.getLoginUser = function (req, res) {
	var jsonRes = new JsonResponse(res)
	  , authReq = new AuthRequest(req)
	var loginUser = authReq.getLoginUser()
	
	if(loginUser.isAnnoymous())  //isLogin... 클라이언트에서 사용되는 속성임 주의.. 
		loginUser.isLogin = false;
	else 
		loginUser.isLogin = true;
	
	return jsonRes.send(loginUser);
}
userController.getUser = function (req, res) {
	var jsonRes = new JsonResponse(res)
	  , authReq = new AuthRequest(req)
	
	var rawData = authReq.getRawData(req)
	  , userId = rawData.userId
	  
	return userDAO.findById(userId)
				  .then(function(user) {
					  return jsonRes.send(user);				  
				  })
				  .catch(jsonRes.catch())
	
	
}

userController.update = function (req,res) {
	var jsonRes = new JsonResponse(res)
	  , authReq = new AuthRequest(req)
	var loginUser = authReq.getLoginUser()
	  , rawData = authReq.getRawData(req)
	  , user = User.createBy(rawData)
	  , userId = user._id
	
	if(loginUser.isNotEqualById(userId)) return jsonRes.sendFail(userId + 'is not current login user');
	
	userDAO.update( user)
	 .then(function (status) {
		 if(status.isError && status.isError()) 
			 return null
		 else 
			 return userDAO.findById( userId);
	 })
	 .then(function (user) {
		 if(!user) return jsonRes.sendFail('user update fail')
		 user.isLogin = true;
		 authReq.setLoginUser(user) //session 의 유저 업뎃
		 return jsonRes.send(user)
	 })
	 .catch(jsonRes.catch())
}

userController.delete = function (req,res) {
	var jsonRes = new JsonResponse(res)
	  , authReq = new AuthRequest(req)
	var loginUser = authReq.getLoginUser()
	  , rawData   = authReq.getRawData(req)
	  , userId 	  = rawData.userId;
	
	debug('user delete rawData ', rawData);
	if(loginUser.isNotEqualById(userId)) return jsonRes.sendFail(userId + ' is not current login user');
	
	var transaction = new Transaction()
	transaction.atomic(function () {
		return Q.all([
						userDAO.removeById(userId)
					  , answerDAO.removeByUserId( userId)
					  , blogBoardService.deletePostsByUserId( userId)
				])
				.then(function (statuses) {
					debug('user delete', statuses)
					var status = Status.reduceOne(statuses)
					
					if(status.isError && status.isError()) {
						transaction.rollback() // err시 롤백
						return jsonRes.sendFail(status);
					}
					
				    req.session.passport.user = null
				    return jsonRes.send(status.message);
				})
	})
	.catch(jsonRes.catch())
}

//------------   before angular  --------------------//
//userController.loginUserView = function (req, res) {
//	var redirector = new JsonResponse(res)
//	var loginUser = requestParser.getLoginUser(req)
//	  , rawData = requestParser.getRawData(req)
//	  , userId = rawData.userId
//	
//	if(loginUser.isNotEqualById(userId)) return redirector.main()
//	
//	H.call4promise(categoryService.getRootOfCategoryTree)
//	 .then(function (rootOfCategoryTree) {
//		 	var blog = { loginUser: loginUser
//		 			   , user : loginUser
//		 			   , rootOfCategoryTree : rootOfCategoryTree
//		 			   , scriptletUtil : scriptletUtil
//		 			   };
//		 	
//			return res.render('./wholeFrame/user/list.ejs',{blog : blog});
//	 })
//	 .catch(redirector.catch)
//}
//userController.userView = function (req, res) {
//	var redirector = new JsonResponse(res)
//	var loginUser = requestParser.getLoginUser(req)
//	  , rawData = requestParser.getRawData(req)
//	  , userId = rawData.userId
//	
//	  
//	H.all4promise([
//	                [categoryService.getRootOfCategoryTree]
//	              , [userDAO.findById, userId]
//	             ])
//	 .then(function (args) {
//		 var rootOfCategoryTree = args[0]
//		   , user = args[1]
//		 	
//	 	var blog = { 'loginUser' : loginUser
//				   , 'user' : user
//	 			   , rootOfCategoryTree : rootOfCategoryTree
//	 			   , scriptletUtil : scriptletUtil
//	 			   };
//	 	
//		return res.render('./wholeFrame/user/list.ejs',{blog : blog});
//	 })
//	 .catch(redirector.catch)
//}
//userController.updateView = function (req, res) {
//	var redirector = new JsonResponse(res)
//	var loginUser = requestParser.getLoginUser(req)
//	, rawData = requestParser.getRawData(req)
//	, userId = rawData.userId
//	
//	if(loginUser.isNotEqualById(userId)) return redirector.main()
//	
//	H.call4promise(categoryService.getRootOfCategoryTree)
//	.then(function (rootOfCategoryTree) {
//		var blog = { loginUser: loginUser
//				    , rootOfCategoryTree : rootOfCategoryTree
//				    , scriptletUtil : scriptletUtil
//		};
//		
//		return res.render('./wholeFrame/user/update.ejs',{blog : blog});
//	})
//	.catch(redirector.catch)
//	
//}
//
//
