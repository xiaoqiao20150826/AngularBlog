
(function($$c, define, angular) {
	var M = $$c.modules
	
	define([ 
	         M.uiRouter.name
	       , M.app.state.StateManager.path + '.js'
	],
	
	function(StateManager) {
		
		
		var app = 'app'
		
			angular.module(app, ['ui.router'])
				   .controller('CommonController',['$scope', function($scope){
					   
				   }])
				   .config(StateManager)
				   .run(function(){})
			
		
		return app
	});
})($$c, define, angular)