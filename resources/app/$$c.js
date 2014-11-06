/**
 *    // 전역 객체 (  $$c  )
 *    // angualr , requireConfig를 위한 '문자열'
 */

(function (window) {
	var __rootDir__ = "/resources/app/"
	  , __libDir__ = __rootDir__ + 'bower_components/'
	
	/***
	 * default
	 */ 
	var $$c = window.$$c = {};      //set window var
	// folder
	$$c.__rootDir__ = __rootDir__
	$$c.__libDir__ = __libDir__
	
	/***
	 * path && name && dependency for module
	 * 1) requirejs의 basepath 사용하지 않고 전체이름 사용.
	 * 2) .js 붙이지 않을 것.
	 */
	function addModule(modules, name, path, deps) {
		var module = { name : name || ''
				     , path : path || ''
				     , deps : deps || []
				     }
		modules[name] = module
		
		return module;
	}
	
	var modules = $$c.modules = {}
	// libraries
	addModule(modules, 'underscore'		  , __libDir__ + "underscore/underscore-min");
	addModule(modules, 'jQuery' 		  , __libDir__ + "jquery/dist/jquery.min");
	addModule(modules, 'twitterBootstrap' , __libDir__ + "bootstrap/dist/js/bootstrap.min", ['jQuery']);
	addModule(modules, 'angular'		  , __libDir__ + "angular/angular")
	addModule(modules, 'uiRouter'		  , __libDir__ + "angular-ui-router/release/angular-ui-router", ['angular'])
	
	// user modules
	addModule(modules, 'bootstrap'	,__rootDir__ + 'bootstrap', ['angular'])
	
	var app = addModule(modules, 'app'		,__rootDir__ + 'app', ['angular'])
	var app_state = addModule(app, 'state')
	addModule(app_state, 'StateManager', __rootDir__ + 'state/StateManager')
	
})(window)
