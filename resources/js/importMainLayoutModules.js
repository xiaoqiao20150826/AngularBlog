/*
 * 		# 선수 조건 
 *   1) importModules를 사용하기 위해서는 아래 모듈이 로딩되어 있어야 한다.
 *  <script src="../resources/lib/jquery-2.0.0.min.js"></script>  
 *	<script src="../resources/js/namespace.js"></script>	
 *	<script src="../resources/js/util/path.js"></script>
 *	<script src="../resources/js/util/moduleLoader.js"></script> 
 * 
 *   2) moduleLoader를 사용하기 위해서 moduleLoader와 path가 export된 패키지를 확인해야한다.
 *   
 *   3) done로 모든 모듈 호출 후의 동작을 지정한다.(아무 동작이 없다면 하지않아도된다)
 *    
 */

////TODO:여러개의 import모듈을 사용하려면 실행부분을 별개 독립시키고 마지막으로 미뤄야한다.
   // 즉, modules, import(or run)
   // - 하고싶은것 : 한곳에서 모듈을 불러오는것이아니라. 소속된 부분으로 나누기. 나중에..
(function(){
	var utilPackage = $$namespace.package('com.kang').package('util')
	  
	  , moduleLoader = utilPackage.import('moduleLoader');
	  
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
	
	moduleLoader.load(modules);
})();
