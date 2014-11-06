/**
 * 
 */

(function(define, angular) {
	
	define([], function () {
		return ['$stateProvider', '$urlRouterProvider', RouteManager]
	})
	
	/////
	var frame = { 	  top	 : 'topFrame'
			        , center : 'centerFrame'
			        , bottom : 'bottomFrame'
			        , side 	 : 'sideFrame'
		}
		
		function RouteManager($stateProvider, $urlRouterProvider) {
			_setState($stateProvider)
			
			$urlRouterProvider
//              .when( '/menu', '/menu/pizza'  ) // Switch to Pizza listing view
              .otherwise('/');       // Return to the main ordering screen
		}
		function _setState($stateProvider) {
			var __viewUrl = 'resources/app/view/'
			
			var appState = new State('app')
								  .url('')
								  .view(frame.top, __viewUrl+'topFrame/nav.ejs')
								  .view(frame.center, __viewUrl+'centerFrame/blogBoard/list.ejs')
								  .view(frame.side, __viewUrl+'sideFrame/category.ejs')
								  .view(frame.bottom, __viewUrl+'bottomFrame/footer.html')
			
								 
			// 등록
			$stateProvider
			  .state(appState.name, appState);
		}
		// State Class
		function State(name) {
			this.name = name;
			this.views = {}
			return this
		}
		State.prototype.url = function(url) { this.url = url;  return this;} 
		State.prototype.view = function (viewName, viewResource) {
			//
			this.views[viewName] = {templateUrl : viewResource }  //template면 직접 내용넣기.
			return this;
		}
	
} )(define, angular)