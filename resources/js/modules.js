/*
 */

(function(){
	var modules = [
	               // 외부 모듈
	                "/resources/lib/underscore-min.js" 
	               
      	           // 사용자 모듈
	              , "/resources/js/util/helper.js"

	              //domain
	              ,"/resources/js/domain/Pager.js"
	              ,"/resources/js/domain/Tab.js"
	              ,"/resources/js/domain/Category.js"
	              
	              //view
	              , "/resources/js/view/viewUtil.js"
	              
	              , "/resources/js/view/blogView.js"
	              , "/resources/js/view/pagerView.js"
	              , "/resources/js/view/tabView.js"
	              , "/resources/js/view/categoryView.js"
	              
	              , "/resources/js/view/answerView.js"
	              
	              , "/resources/js/view/viewManager.js"
	              
	              //repository
	              , "/resources/js/repository/blogRepository.js"
	              
	              //service
	              , "/resources/js/service/blogService.js"
	              
	              //controller
	              , "/resources/js/controller/blogController.js"
	              , "/resources/js/controller/answerController.js"
	              , "/resources/js/controller/adminController.js"
	              , "/resources/js/controller/controllerManager.js"
	              
	              , "/resources/js/app.js"
	               ]  
		
		$$namespace.load(modules, function (require, loadedModules) {
			var app = require('app.js')
			app.run();
		});
})();
