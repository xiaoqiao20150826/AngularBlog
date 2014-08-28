/**
 * 
 */

$$namespace.include(function (require, module) {
	
	//뷰가아닌 뷰매니저니 저장소 가져오는거 괜찮을까.
	var ListView = require('/view/centerFrame/blogBoard/list/ListView')
	  , NavView = require('/view/topFrame/NavView')
	  , InsertView = require('/view/centerFrame/blogBoard/post/InsertView')
	
	var ViewManager = module.exports = function (app) {
		this.app = app
		
		this.listView = new ListView();
		this.navView = new NavView();
		this.insertView = new InsertView();
		
		this.views = [ this.listView
		             , this.navView
		             , this.insertView
		             ]
	}
	ViewManager.prototype.assignEffectAll = function (blogMap) {
		for(var i in this.views) {
			var view = this.views[i]
			if(view.assignEffect) view.assignEffect(blogMap);
		}
	}
	ViewManager.prototype.assignEffectAboutCenterFrame = function (blogMap) {
		this.listView.assignEffect(blogMap)
	}
	//개별
	ViewManager.prototype.assignEffectAboutListOfBlogBoard = function (blogMap) {
		this.listView.assignEffect(blogMap)
	}
	ViewManager.prototype.assignEffectAboutInsertOfBlogBoard = function (blogMap) {
		this.insertView.assignEffect(blogMap)
	}
	
	//get
	ViewManager.prototype.getListView = function () {return this.listView; }
	ViewManager.prototype.getNavView = function () {return this.navView; }
	ViewManager.prototype.getInsertView = function () {return this.insertView; }
})
//@ sourceURL=view/ViewManager.js