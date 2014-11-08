
/***
 * 	main
 * 
 */
(function(require){
	var tests = [];
	for (var file in window.__karma__.files) {
		//현재 항상 *Spec.js 로 끝나는 파일만 필터링...더 나은방법은?
		// $의 의미는?
	    if (/Spec\.js$/.test(file)) {  
	        tests.push(file);
	    }
	}
	
	/////////////////////////////////////////////// 
	var _paths = {}
	
	_paths.angular = "../../bower_components/angular/angular";
	_paths.uiRouter = "../../bower_components/angular-ui-router/release/angular-ui-router";
	_paths.ngStorage= "../../bower_components/ngstorage/ngStorage";
	
	var _shim = {}
	_shim.uiRouter = ['angular']
	_shim.ngStorage = ['angular']
	
	// 1. setup & run
	var _deps = Object.keys(_paths)
	  
	// 페이지 로딩 시 처음 자동 로딩하는 것 취소시키고. 나중에 복구.   
	onOffKarmaLoaded() 
	
	require.config({
				     'baseUrl' : "base/src/app"   			//karma 서버 기본 디렉토리가 base
				    	 // spect에서 사용될 의존성의 '이름'
				   , 'paths' : _paths					// 
				   , 'shim'  : _shim					//
				   , 'deps' : _deps
				   , 'callback' : loadTestSpecsAndRun
	});
	
	function loadTestSpecsAndRun() {
		require(tests, function () {
			window.__karma__.start();
			onOffKarmaLoaded();
		})
	}

	// 이렇게 안하고 그냥 없에도되려나.
	function _karmaLoaded() {}  
	function onOffKarmaLoaded() {
		var temp = _karmaLoaded
		_karmaLoaded = window.__karma__.loaded
		window.__karma__.loaded = temp 
	}
	
})(require)	
