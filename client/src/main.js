
/***
 * 	main
 * 
 */
(function(require){
	// min으로 나중에 바꾸자. 
	var _paths = {}
	_paths.underscore = "../../bower_components/underscore/underscore-min";
	_paths.jQuery = "../../bower_components/jquery/dist/jquery.min";
	_paths.twitterBootstrap = "../../bower_components/bootstrap/dist/js/bootstrap.min";
	
	_paths.angular = "../../bower_components/angular/angular";
	_paths.uiRouter = "../../bower_components/angular-ui-router/release/angular-ui-router";
	_paths.ngStorage= "../../bower_components/ngstorage/ngStorage";
	
	
	
	var _shim = {}
	_shim.twitterBootstrap = ['jQuery']
	_shim.uiRouter = ['angular']
	_shim.ngStorage = ['angular']
	
	// 1. setup && 필수 의존성 선로딩
	
	require.config({
				     'baseUrl' : "/resource/src/app"
				   , 'paths' : _paths					// 로딩위치+이름
				   , 'shim'  : _shim					// 의존성
	});
	
	//2. 의존성 선 로딩(paths에 등록된것) 후 bootstrap
	var _deps = Object.keys(_paths)
	require(_deps, function () {
		require(['../bootstrap'], function () {
			console.log('start angular...')
		})
	})
})(require)	
