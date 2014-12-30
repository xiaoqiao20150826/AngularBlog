
/***
 * 	main
 * 
 */
(function(require){
	//0. spin
	_spin()
	
	// min으로 나중에 바꾸자. 
	var _paths = {}
	_paths.underscore = "../../bower_components/underscore/underscore-min";
	_paths.jQuery = "../../bower_components/jquery/dist/jquery.min";
	_paths.twitterBootstrap = "../../bower_components/bootstrap/dist/js/bootstrap.min";
	
	_paths.angular     = "../../bower_components/angular/angular";
	_paths.uiRouter    = "../../bower_components/angular-ui-router/release/angular-ui-router";
	_paths.ngStorage   = "../../bower_components/ngstorage/ngStorage";
	_paths.loadingBar = "../../bower_components/angular-loading-bar/build/loading-bar";
	_paths.ocLazyLoad = "../../bower_components/oclazyload/dist/ocLazyLoad";
	
	//lib
	_paths.editorModules = "../../lib/editor/editorModules";
	_paths.namespace     = "../../lib/editor/lib/namespace/$$namespace";
	
	
	var _shim = {}
	_shim.twitterBootstrap = ['jQuery']
	
	_shim.angular 		   = ['jQuery']
	_shim.uiRouter    	   = ['angular'];
	_shim.ngStorage   	   = ['angular'];
	_shim.loadingBar 	   = ['angular'];
	_shim.ocLazyLoad 	   = ['angular'];
	
	_shim.namespace 	   = ['jQuery'];
	
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
			console.log('angular bootstrap...')
//			_toggleLoadingBar()
		})
	})
	
	/// etc
	// 지금은 첫로딩에서만 간단히 사용함. ui-view에 할당했기에.. 템플릿 로딩되면 자동 없어짐.
	function _spin(){ 
		var Spinner = window.Spinner || console.error('not exist Spinner') 
		var opts = {
			  lines: 13, // The number of lines to draw
			  length: 20, // The length of each line
			  width: 10, // The line thickness
			  radius: 30, // The radius of the inner circle
			  corners: 1, // Corner roundness (0..1)
			  rotate: 0, // The rotation offset
			  direction: 1, // 1: clockwise, -1: counterclockwise
			  color: '#000', // #rgb or #rrggbb or array of colors
			  speed: 1, // Rounds per second
			  trail: 60, // Afterglow percentage
			  shadow: false, // Whether to render a shadow
			  hwaccel: false, // Whether to use hardware acceleration
			  className: 'spinner', // The CSS class to assign to the spinner
			  zIndex: 2e9, // The z-index (defaults to 2000000000)
			  top: '30%', // Top position relative to parent
			  left: '50%' // Left position relative to parent
			};
			var target = document.getElementById('spinner');
			var spinner = new Spinner(opts).spin(target);
	}
	
})(require)	
