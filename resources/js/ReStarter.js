/**
 *    페이지 프레임범위로 핸들러바인딩, 효과부여.
 */


$$namespace.include(function (require, module) {
	var blogRepository = require('repository/blogRepository')
	  , actionHistory = require('history/actionHistory.js')
	
	var ReStarter = module.exports = function (viewManager, controllerManager) {
		this.viewManager = viewManager
		this.controllerManager = controllerManager
	}
	ReStarter.prototype.wholeFrame = function () {
		actionHistory.init()

		this.controllerManager.onHandlerAll()
		var blogMap = blogRepository.getBlogMap()
		this.viewManager.assignEffectAll(blogMap)
	}
	ReStarter.prototype.centerFrame = function () {
		this.controllerManager.onHandlerAboutCenterFrame()
		var blogMap = blogRepository.getBlogMap()
		this.viewManager.assignEffectAboutCenterFrame(blogMap)
	}
	
	//centerFrame 관련..
	ReStarter.prototype.listOfBlogBoard = function () {
		this.controllerManager.onHandlerAboutListOfBlogBoard()
		var blogMap = blogRepository.getBlogMap()
		this.viewManager.assignEffectAboutListOfBlogBoard(blogMap)
	}
	ReStarter.prototype.insertOfBlogBoard = function () {
		this.controllerManager.onHandlerAboutInsertOfBlogBoard()
		var blogMap = blogRepository.getBlogMap()
		this.viewManager.assignEffectAboutInsertOfBlogBoard(blogMap)
	}
})