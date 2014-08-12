/*
 */

(function(){
	var modules = [
	               // 외부 모듈
	             
	                "/resources/lib/underscore-min.js" 
	               
      	           // 사용자 모듈
	              , "/resources/js/util/htmlLoger.js"	             
	              , "/resources/js/util/helper.js"
	              
	              , "/resources/js/blog/pager.js"	             
	              , "/resources/js/blog/tabs.js"
	              
	              	// detail
	              , "/resources/js/answer/voteBtn.js"  
	              , "/resources/js/answer/insertViewBtn.js"
	              
	                // admin
	              , "/resources/js/admin/categoryInsertForm.js" 
	              
	               ]  
	
	$(document).ready(function() {
		$$namespace.load(modules, function (require, modules) {
//			var debug = require('htmlLoger').debug
//			debug(modules);
		});
	})
})();
