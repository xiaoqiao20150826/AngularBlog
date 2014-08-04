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



// 비동기적으로 가져오기에 모든 작업 후 해야할일을 done으로 정해줘야함.

(function(){
	var utilPackage = $$namespace.package('com.kang').package('util')
	  , moduleLoader = utilPackage.import('moduleLoader');
	  
	var modules = [
	             // 외부 모듈
	              
	             
      	         // 사용자 모듈
	              "../util/htmlLoger.js"

	             // 테스트 외부 모듈
	             , "./lib/chai/chai.js"
	             , "./lib/mocha/mocha.js"
	             , "./mochaSetup.js" // describe를 전역 이름으로 할당하여 사용할 수 있게 해줌.
	             // 테스트모듈 (로딩되며 자동실행)  
	             , "./util/pathTest.js"
	             , "./util/moduleLoaderTest.js"
	             , "./util/htmlLogerTest.js"
	             , "./util/namespaceTest.js"
	             // 테스트 실행
	             , "./mochaRun.js"
	               ]  
	
	moduleLoader.load(modules);  
})();
