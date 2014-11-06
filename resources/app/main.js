
/***
 * 	main
 * 
 */
(function($$c, require){
	var M = $$c.modules
	
	// 1. config
	var paths = {}
	paths[M.underscore.name] = M.underscore.path
	paths[M.jQuery.name] = M.jQuery.path
	paths[M.twitterBootstrap.name] = M.twitterBootstrap.path
	paths[M.angular.name] = M.angular.path
	paths[M.uiRouter.name] = M.uiRouter.path
	//
	paths[M.bootstrap.name] = M.bootstrap.path
	
	var shim = {}
	shim[M.uiRouter.name] = M.uiRouter.deps
    shim[M.bootstrap.name] = M.bootstrap.deps
	shim[M.app.name] = M.app.deps
	
	require.config({
					 'paths' : paths
				   , 'shim'  : shim 
	});
	
	//2. run
	require([M.bootstrap.name] ,
		function() {
	})
})($$c, require)	
