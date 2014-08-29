/*
 */

(function(){
	var modules = [
	               // 외부 모듈
	                "/resources/lib/underscore-min.js" 
	               
      	           // 사용자 모듈
	              , "/resources/js/util/helper.js"
	              , "/resources/js/util/ajax.js"
	              , "/resources/js/util/eventBinder.js"

	              , "/resources/js/history/actionHistory.js"
	              , "/resources/js/history/Action.js"
	              
	              //domain
	              ,"/resources/js/domain/blogBoard/Pager.js"
	              ,"/resources/js/domain/blogBoard/Tab.js"
	              ,"/resources/js/domain/blogBoard/Category.js"
	              ,"/resources/js/domain/blogBoard/Post.js"
	              
	              //view
	              , "/resources/js/view/ViewManager.js"

	              
	              , "/resources/js/view/util/viewUtil.js"
	              , "/resources/js/view/util/divUtil.js"
	              
	              //view-common
	              , "/resources/js/view/common/CategoryView.js"

	              , "/resources/js/view/topFrame/NavView.js"
	              
	              , "/resources/js/view/centerFrame/blogBoard/list/PagerView.js"
	              , "/resources/js/view/centerFrame/blogBoard/list/TabView.js"
	              , "/resources/js/view/centerFrame/blogBoard/list/ListView.js"
	              
	              , "/resources/js/view/centerFrame/blogBoard/insert/InsertView.js"
	              , "/resources/js/view/centerFrame/blogBoard/detail/DetailView.js"
	              , "/resources/js/view/centerFrame/blogBoard/detail/answer/AnswerView.js"
	              
	              
	              //repository
	              , "/resources/js/repository/blogRepository.js"
	              
	              //service
	              , "/resources/js/service/blogBoardService.js"
	              
	              //controller
	              , "/resources/js/controller/NavController.js"
	              
	              , "/resources/js/controller/blogBoard/ListController.js"
	              , "/resources/js/controller/blogBoard/InsertController.js"
	              , "/resources/js/controller/blogBoard/DetailController.js"
	              
	              , "/resources/js/controller/blogBoard/AnswerController.js"
	              
//	              , "/resources/js/controller/adminController.js"
	              , "/resources/js/controller/ControllerManager.js"
	              
	              , "/resources/js/ReStarter.js"
	              , "/resources/js/app.js"
	               ]  
		
		$$namespace.load(modules, function (require, loadedModules) {
			var app = require('app.js')
			app.run();
		});
})();
