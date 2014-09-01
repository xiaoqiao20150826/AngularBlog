/*
 * GET users listing.
 */

var _ = require('underscore');

var H = require('../../common/helper.js')
  , scriptletUtil = require('../../common/util/scriptletUtil')
  , requestParser = require('../util/requestParser.js')
  , Redirector = require('../util/Redirector')

var User = require('../../domain/User')
  , userDAO = require('../../dao/userDAO')
  , answerDAO = require('../../dao/blogBoard/answerDAO')
  , postDAO = require('../../dao/blogBoard/postDAO')
var categoryService = require('../../service/blogBoard/categoryService')
  
var userController = module.exports = {}
userController.mapUrlToResponse = function(app) {
	app.get('/user/me', this.loginUserView);// 순서주의
	app.get('/user/:userId', this.userView);//
	app.get('/user/:userId/updateView', this.updateView)
	
	app.post('/user/:userId/update', this.update)
	app.post('/user/:userId/delete', this.delete)
}
userController.userView = function (req, res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	  , userId = rawData.userId
	
	if(loginUser.isNotEqualById(userId)) return redirector.main()
	
	H.call4promise(categoryService.getRootOfCategoryTree)
	 .then(function (rootOfCategoryTree) {
		 	var blog = { loginUser: loginUser
		 			   , rootOfCategoryTree : rootOfCategoryTree
		 			   , scriptletUtil : scriptletUtil
		 			   };
		 	
			return res.render('./wholeFrame/user/list.ejs',{blog : blog});
	 })
	 .catch(redirector.catch)
}
userController.updateView = function (req, res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	, rawData = requestParser.getRawData(req)
	, userId = rawData.userId
	
	if(loginUser.isNotEqualById(userId)) return redirector.main()
	
	H.call4promise(categoryService.getRootOfCategoryTree)
	.then(function (rootOfCategoryTree) {
		var blog = { loginUser: loginUser
				    , rootOfCategoryTree : rootOfCategoryTree
				    , scriptletUtil : scriptletUtil
		};
		
		return res.render('./wholeFrame/user/update.ejs',{blog : blog});
	})
	.catch(redirector.catch)
	
}
userController.loginUserView = function (req, res) {
	var loginUser = requestParser.getLoginUser(req)
	  , userId = loginUser._id;
	
	return res.redirect('/user/'+ userId);
}

userController.update = function (req,res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	  , rawData = requestParser.getRawData(req)
	  , userId = rawData.userId
	  , user = User.createBy(rawData)
	
	if(loginUser.isNotEqualById(userId)) return redirector.main()
	console.log('update',user)
	H.call4promise(userDAO.update, user)
	 .then(function (status) {
		 if(status.isError()) 
			 return null
		 else 
			 return H.call4promise(userDAO.findById, userId);
	 })
	 .then(function (user) {
		 if(!user) return res.send('update fail')
		 
		 req.session.passport.user = user
		 return res.redirect('/user/me')
	 })
	 .catch(redirector.catch)
}
//TODO: 글,댓글 살리고 싶으면 탈퇴회원 미리 만들어서 그 정보로 변경 시켜.
//TODO:파일도 삭제해야해. 유저폴더에 있는 파일전부...!
//post정보도 삭제. ㅡㅡ 카테고리.

userController.delete = function (req,res) {
	var redirector = new Redirector(res)
	var loginUser = requestParser.getLoginUser(req)
	, rawData = requestParser.getRawData(req)
	, userId = rawData.userId
	
	if(loginUser.isNotEqualById(userId)) return redirector.main()
	H.call4promise(userDAO.removeById, userId)
	 .then(function (status) {
		if(status.isError()) return  res.send('remove fail')
		
		return H.all4promise([
		                       [postDAO.removeByUserId, userId]  
		                     , [answerDAO.removeByUserId, userId]
		                    ])
	})
	.then(function (args) {
		req.session.passport.user = null
		redirector.main()	
	})
	.catch(redirector.catch)
}