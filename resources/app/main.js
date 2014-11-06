
/***
 * 	main
 * 
 */
(function(require){
	
	var _paths = {}
	_paths.underscore = "bower_components/underscore/underscore-min";
	_paths.jQuery = "bower_components/jquery/dist/jquery.min";
	_paths.twitterBootstrap = "bower_components/bootstrap/dist/js/bootstrap.min";
	
	_paths.angular = "bower_components/angular/angular";
	_paths.uiRouter = "bower_components/angular-ui-router/release/angular-ui-router";
	
	_paths.bootstrap = "bootstrap"
	
	var _shim = {}
	_shim.twitterBootstrap = ['jQuery']
	_shim.uiRouter = ['angular']
	_shim.bootstrap = ['angular']
	
	// 1. setup
	require.config({
				     'baseUrl' : "/resources/app/"
				   , 'paths' : _paths					// 로딩위치+이름
				   , 'shim'  : _shim					// 의존성 
	});
	
	//2. 의존성 로딩 및 bootstrap
	var _deps = Object.keys(_paths)
	
	require(_deps,
		function() {
		console.log('start angular...')
	})
})(require)	
