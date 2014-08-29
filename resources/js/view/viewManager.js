/**
 * 
 */

$$namespace.include(function (require, module) {
	
	//뷰가아닌 뷰매니저니 저장소 가져오는거 괜찮을까.
	var ListView = require('/view/centerFrame/blogBoard/list/ListView')
	  , NavView = require('/view/topFrame/NavView')
	  , InsertView = require('/view/centerFrame/blogBoard/insert/InsertView')
	  , DetailView = require('/view/centerFrame/blogBoard/insert/DetailView')
	  , AnswerView = require('/view/centerFrame/blogBoard/insert/AnswerView')
	
	var ViewManager = module.exports = function (app) {
		this.app = app
		
		this.navView = new NavView();
		
		this.listView = new ListView();
		
		this.insertView = new InsertView();
		
		this.detailView = new DetailView();
		this.answerView = new AnswerView();
		
	}
	//topframe
	ViewManager.prototype.assignEffectAboutNav = function (blogMap) {
		this.navView.assignEffect(blogMap)
	}
	
	//centerframe
	ViewManager.prototype.assignEffectAboutListOfBlogBoard = function (blogMap) {
		this.listView.assignEffect(blogMap)
	}
	ViewManager.prototype.assignEffectAboutInsertOfBlogBoard = function (blogMap) {
		this.insertView.assignEffect(blogMap)
	}
	ViewManager.prototype.assignEffectAboutDetailOfBlogBoard = function (blogMap) {
		this.detailView.assignEffect(blogMap)
		this.answerView.assignEffect(blogMap)
	}
	ViewManager.prototype.assignEffectAboutAnswerOfBlogBoard = function (blogMap) {
		this.answerView.assignEffect(blogMap)
	}
	
	
	//get
	ViewManager.prototype.getListView = function () {return this.listView; }
	ViewManager.prototype.getNavView = function () {return this.navView; }
	ViewManager.prototype.getInsertView = function () {return this.insertView; }
	ViewManager.prototype.getDetailView = function () {return this.detailView; }
	ViewManager.prototype.getAnswerView = function () {return this.answerView; }
})
//@ sourceURL=view/ViewManager.js