
/***
 * 	main
 * 
 */
(function(require){
	var testOneName 
//						= 'ObjectDecorator'  // 주석시 all
//						= 'inspectLogger'  // 주석시 all
						= 'uiRouter'  // 주석시 all
	
	var tests = [];
	//현재 항상 *Spec.js 로 끝나는 파일만 필터링...더 나은방법은? 
	for (var file in window.__karma__.files) {

	    if (_isTestOne(file) && /Spec\.js$/.test(file)) { 		// $의 의미는?  
	        tests.push(file);
	    }
	}
	
	function _isTestOne (path) {
		if(!testOneName) return true // all
		if(RegExp(testOneName + '[A-Za-z0-9]*\.js').test(path)) return  true
		else return false;
	}  
	
	
	/////////////////////////////////////////////// 
	var _paths = {}
	
	_paths.uiRouter = "../../bower_components/angular-ui-router/release/angular-ui-router";
	_paths.ngStorage= "../../bower_components/ngstorage/ngStorage";
	
	// 1. setup & run
	var _deps = Object.keys(_paths)
	onOffKarmaLoaded() 
	require.config({
				     'baseUrl' : "base/src/app"   			//karma 서버 기본 디렉토리가 base
				    	 // spect에서 사용될 의존성의 '이름'
				   , 'paths' : _paths					// 
				   , 'deps' : _deps
				   , 'callback' : loadTestSpecsAndRun
	});
	
	function loadTestSpecsAndRun() {
		require(tests, function () {
			console.log('tests : ', tests)
			window.__karma__.start();
			onOffKarmaLoaded();
		})
	}

//	페이지 로딩 시 처음 자동 로딩하는 것 취소시키고. 나중에 복구.
	function _karmaLoaded() {}  
	function onOffKarmaLoaded() {
		var temp = _karmaLoaded
		_karmaLoaded = window.__karma__.loaded
		window.__karma__.loaded = temp 
	}
	
})(require)	
