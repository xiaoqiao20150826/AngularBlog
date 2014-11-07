
/***
 * 	main
 * 
 */
(function(require){
	var tests = [];
	for (var file in window.__karma__.files) {
	    if (/Spec\.js$/.test(file)) {
	        tests.push(file);
	    }
	}
	
	/////////////////////////////////////////////// 
	var _paths = {}
	_paths.underscore = "../bower_components/underscore/underscore-min";
	_paths.jQuery = "../bower_components/jquery/dist/jquery.min";
	_paths.twitterBootstrap = "../bower_components/bootstrap/dist/js/bootstrap.min";
	
	_paths.angular = "../bower_components/angular/angular";
	_paths.uiRouter = "../bower_components/angular-ui-router/release/angular-ui-router";
	_paths.ngStorage= "../bower_components/ngstorage/ngStorage";
	
	var _shim = {}
	_shim.twitterBootstrap = ['jQuery']
	_shim.uiRouter = ['angular']
	_shim.ngStorage = ['angular']
	
	// 1. setup
	
	var _deps = Object.keys(_paths)
	require.config({
				     'baseUrl' : "base/src"   			//karma 서버 기본 디렉토리가 base
				   , 'paths' : _paths					// 로딩위치+이름
				   , 'shim'  : _shim					// 의존성
				   , 'deps': _deps
	});
	require(tests, function() {
		   console.log(tests)
		   window.__karma__.start.apply(this, arguments);
	})

})(require)	
