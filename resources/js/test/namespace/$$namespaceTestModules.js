


(function(){
	
	
	var modules = [
	             // 외부 모듈
	               "../lib/underscore-min"
	             , "../lib/chai/chai.js"
	             
	             // 사용자모듈
	             , "../../util/htmlLoger.js"
	              ]  

	$$namespace.load(modules)
	
	var modules = [
	               // 외부 모듈
	               "../lib/underscore-min.js"
	               , "../lib/chai/chai"
	               
	               // 사용자모듈
	               , "../../util/htmlLoger"
	               
	               // 테스트 모듈
	               , "./$$namespaceTest"
	               ]  
	
	$$namespace.load(modules, function() {
		mocha.run();
	})
	
})();
