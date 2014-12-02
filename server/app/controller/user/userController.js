/*
 * GET users listing.
 */

var debug = require('debug')('nodeblog:controller:userController')
var _ 	  = require('underscore');

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
	app.post('/json/user/update', this.update)

//	app.get('/user/me', this.loginUserView);// 순서주의
//	
//	app.get('/user/:userId', this.userView);//
//	app.get('/user/:userId/updateView', this.updateView)
//	
//	app.post('/user/:userId/delete', this.delete)
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
		 if(status.isError()) 
			 return null
		 else 
			 return userDAO.findById( userId);
	 })
	 .then(function (user) {
		 if(!user) return jsonRes.sendFail('user update fail')
		 
		 authReq.setLoginUser(user) //session 의 유저 업뎃
		 return jsonRes.send(user)
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
////TODO: 글,댓글 살리고 싶으면 탈퇴회원 미리 만들어서 그 정보로 변경 시켜.
////      err시 되돌리기....를 생각하면 더 어려워진다.
//
//// answer, post별개로 삭제한 이유는 혹시나 비동기 행동으로 인해 
//// 이미 지운것을 또 지우려할때 에러날까봐. (아닌가. 없는것을 지우려하는것은 괜찮긴한데)
//userController.delete = function (req,res) {
//	var redirector = new JsonResponse(res)
//	var loginUser = requestParser.getLoginUser(req)
//	, rawData = requestParser.getRawData(req)
//	, userId = rawData.userId
//	
//	if(loginUser.isNotEqualById(userId)) return redirector.main()
//	
//	
//	var transaction = new Transaction()
//	transaction.atomic(function () {
//		return H.all4promise([
//								[userDAO.removeById, userId]
//							  , [answerDAO.removeByUserId, userId]
//							  , [blogBoardService.deletePostsByUserId, userId]
//				])
//				.then(function (statuses) {
//				    debug('s',statuses)
//				    req.session.passport.user = null
//				    return redirector.main()
//				})
//				.catch(function (err) {
//					debug('delete err ',err)
//					transaction.rollback() // err시 롤백
//					return redirector.catch(err)
//				})
//	})
//}