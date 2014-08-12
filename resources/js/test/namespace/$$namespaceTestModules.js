


(function(){
	
	
	var modules = [
	             // 외부 모듈
	               "../lib/underscore-min.js"
	             , "../lib/chai/chai.js"
	             
	             // 사용자모듈
	             , "../../util/htmlLoger.js"
	             
	             // 테스트 모듈
	             , "../lib/mocha/mocha.js"
	             , "../mochaSetup.js"
	           
	             , "./$$namespaceTest.js"
	           
	             , "../mochaRun.js"
	              ]  

	$(document).ready(function() {
		$$namespace.load(modules)
	})
})();
