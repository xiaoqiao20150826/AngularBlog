/**
 *    페이지 프레임범위로 핸들러바인딩, 효과부여.
 */


$$namespace.include(function (require, module) {
	var blogRepository = require('repository/blogRepository')
	
	var ReStarter = module.exports = function (viewManager, controllerManager) {
		this.viewManager = viewManager
		this.controllerManager = controllerManager
	}
	//main 
	// TODO:주소로 접속할 경우 어떤 center가 올지모르기에 모두 초기화해야한다.
	// 페이지를 감싸는 영역을 만들어놓고, 그 영역이 있으면 초기화하도록 하면되겠네.
	// 전체적으로 적용가능하겠네. 하지만. 변경사항이 많아지니....미루자.
	ReStarter.prototype.main = function () {
		//top
		this.nav()
		
		//center
		this.listOfBlogBoard()
		this.insertOfBlogBoard()
		this.detailOfBlogBoard()
		
		//admin
		this.admin()
	}
	
	ReStarter.prototype.admin = function () {
		this.controllerManager.onHandlerAboutAdmin()
		var blogMap = blogRepository.getBlogMap()
		this.viewManager.assignEffectAboutAdmin(blogMap)
	}
	//topframe
	ReStarter.prototype.nav = function () {
		this.controllerManager.onHandlerAboutNav()
		var blogMap = blogRepository.getBlogMap()
		this.viewManager.assignEffectAboutNav(blogMap)
	}
	//centerFrame 
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
	//answer포함
	ReStarter.prototype.detailOfBlogBoard = function () {
		this.controllerManager.onHandlerAboutDetailOfBlogBoard()
		var blogMap = blogRepository.getBlogMap()
		this.viewManager.assignEffectAboutDetailOfBlogBoard(blogMap)
	}
	ReStarter.prototype.answerOfBlogBoard = function () {
		this.controllerManager.onHandlerAboutAnswerOfBlogBoard()
		var blogMap = blogRepository.getBlogMap()
		this.viewManager.assignEffectAboutAnswerOfBlogBoard(blogMap)
	}
})