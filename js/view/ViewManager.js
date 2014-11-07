/**
 * 
 */

$$namespace.include(function (require, module) {
	//
	var CategoryView = require('/view/common/CategoryView')
	//
	var NavView = require('/view/topFrame/NavView')
	
	var AdminView = require('/view/centerFrame/admin/AdminView')
	
	var ListView = require('/view/centerFrame/blogBoard/list/ListView')
	  , InsertView = require('/view/centerFrame/blogBoard/insert/InsertView')
	  , DetailView = require('/view/centerFrame/blogBoard/insert/DetailView')
	  , AnswerView = require('/view/centerFrame/blogBoard/insert/AnswerView')
	
	var ViewManager = module.exports = function (app) {
		this.app = app
		
		// common
		this.categoryView = new CategoryView()
		
		//nav
		this.navView = new NavView();
		//blogBoard
		this.listView = new ListView(this.categoryView);
		this.insertView = new InsertView();
		this.detailView = new DetailView();
		this.answerView = new AnswerView();
		//user
		this.adminView = new AdminView(this.categoryView);
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
		this.listView.assignEffect(blogMap)
	}
	ViewManager.prototype.assignEffectAboutAnswerOfBlogBoard = function (blogMap) {
		this.answerView.assignEffect(blogMap)
	}
	ViewManager.prototype.assignEffectAboutAdmin= function (blogMap) {
		this.adminView.assignEffect(blogMap)
	}
	
	
	//get
	ViewManager.prototype.getNavView = function () {return this.navView; }
	
	ViewManager.prototype.getAdminView = function () {return this.adminView; }
	
	//
	ViewManager.prototype.getListView = function () {return this.listView; }
	ViewManager.prototype.getInsertView = function () {return this.insertView; }
	ViewManager.prototype.getDetailView = function () {return this.detailView; }
	ViewManager.prototype.getAnswerView = function () {return this.answerView; }
})
//@ sourceURL=view/ViewManager.js