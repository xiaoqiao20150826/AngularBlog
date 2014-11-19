/**
 *   // app 모듈 로딩 완료 후 run에서 이벤트에 대한 핸들러 등록. 
 */


(function(define) {
	
	define([], function () {
		
		return ['$rootScope', '$state', 'common.util','app.authService', setupHandler]
	})
	// TODO: 모듈로..분리시켜야 해
	
	function setupHandler($rootScope, $state, U, authService) {
		
		// auth.. url에 따른 선 확인.
	    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
	        if (!(toState.auth || toState.admin) ) return; //없으면 하던일 하고.
	        // 기본동작막고..
	        event.preventDefault();
	        
	        // currentUser 변경하고..
	        authService.getLoginUser()
	        		   .then(function (user) {
	        			   $rootScope.currentUser = user; //주의 currentUser로 사용중.
	        			   
	        			   if(!user.isLogin) return _redirectAndShow($state, fromState, fromParams, authService.showLoginView);
	        			   // 참 애매하게 해놨네..
	        			   
	        			   if(!toState.admin) return _originWork($state, toState, toParams); 
	        			   
	        			   ////////////////////////
	        			   if(toState.admin) {
	        				   _checkAdmin(authService)
	        				   .then(function(isAdmin) {
	        					   if(isAdmin) return _originWork($state, toState, toParams) 
	        					   else return _redirectAndShow($state, fromState, fromParams, null);
	        				   })
	        			   }
	        		   })
	    });
	    function _checkAdmin (authService){
			   return authService.loginUserIsAdmin()
	   			  				 .then(function(result) {
	   			  					 if(result.isSuccess) return true
	   			  					 else return false;
	   			  				 })
	    }
	    
	    function _redirectAndShow ($state, fromState, fromParams, showLoginView) {
			   var stateName = _defaultNameIfNoUse(fromState)
			   return $state.go(stateName , fromParams)
			   		 		.then(function () { 
			   		 			if(showLoginView) showLoginView(); 
			   		 		})
	    }
	    function _originWork ($state, toState, toParams) {
			   var beforeAuth  = toState.auth
			     , beforeAdmin = toState.admin
			     
			   toState.auth = toState.admin = false;
			   
			   var stateName = _defaultNameIfNoUse(toState)
			   return $state.transitionTo(stateName, toParams)//본래동작??
			   		 		.then(function() {
			   		 				toState.auth = beforeAuth
			   		 				toState.admin = beforeAdmin
			   		 			})
	    } 
	    
	    function _defaultNameIfNoUse(state) {
	    	var defaultStateName = "app.blogBoard.list";
	    	
	    	if(state.name === "" || state.defaultState)
	    		return defaultStateName;
	    	else
	    		return state.name
	    }
	}
	
})(define)