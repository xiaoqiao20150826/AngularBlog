/**
 * 
 */

$$namespace.include(function (require, module) {
	
	//뷰가아닌 뷰매니저니 저장소 가져오는거 괜찮을까.
	var ListView = require('/view/blogBoard/list/ListView')
	
	var ViewManager = module.exports = function (app) {
		this.app = app
		
		this.listView = new ListView();
		
		this.views = [ this.listView ]
	}
	
	
	// 모든 뷰.에대해 이펙트 다시 부여.
	ViewManager.prototype.assignEffect = function (blogMap) {
		
	}
	
	//get
	ViewManager.prototype.getListView = function () {return this.listView; }
})
//@ sourceURL=view/ViewManager.js