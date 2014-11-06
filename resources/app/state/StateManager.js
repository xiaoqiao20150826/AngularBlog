/**
 * 
 */

(function(define, angular) {
	
	define(['state/State'], function (State) {
		
		return ['$stateProvider', '$urlRouterProvider', setupState1(State)]
	})
	
	/////
	var frame = { 	  top	 : 'topFrame'
			        , center : 'centerFrame'
			        , bottom : 'bottomFrame'
			        , side 	 : 'sideFrame'
		}
	
	function setupState1(State) {
		var __viewUrl = 'resources/app/view/'
		// 모듈화해야지. 뷰 객체 재사용하게 만들어놔야지.
	    
		var appState = new State('app')
							  .url('')
							  .view(frame.top, __viewUrl+'topFrame/nav.ejs')
							  .view(frame.center, __viewUrl+'centerFrame/blogBoard/list.ejs')
							  .view(frame.side, __viewUrl+'sideFrame/category.ejs')
							  .view(frame.bottom, __viewUrl+'bottomFrame/footer.html')
		
		
		var states = [appState]
		return function RouteManager($stateProvider, $urlRouterProvider) {
			_setState($stateProvider, states)
			_setOtherRouting($urlRouterProvider)
		} 
	}
	
	//-----------------------------------------------------------------
	
	function _setState($stateProvider, states) {
							 
		// 등록
		for(var i in states) {
			var state = states[i]
			$stateProvider.state(state);
		}
	}
	function _setOtherRouting($urlRouterProvider) {
		$urlRouterProvider
//      .when( '/menu', '/menu/pizza'  ) // Switch to Pizza listing view
		  .otherwise('/');       // Return to the main ordering screen
	}
	
	
} )(define, angular)