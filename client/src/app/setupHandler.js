/**
 *   // app 모듈 로딩 완료 후 run에서 이벤트에 대한 핸들러 등록.
 *   
 *    TODO: app.httpFailHandler의 리다이렉트..부분과 좀 겹치지않을까?
 *          리다이렉터를 만들어야 하지 않을까?
 *          http.....요고에서 한것처럼 $state.go($state.current)..이런식으로하는것이 편하지않을까?
 */


(function(define) {
	
	define([], function () {
		
		return [
		         '$rootScope'
		       , '$state'
		       , 'common.util'
		       , 'common.redirector'
		       , 'app.authDAO'
		       , setupHandler
		       ]
	})
	// TODO: 모듈로..분리시켜야 해
	
	function setupHandler($rootScope, $state, U, redirector,  authDAO) {
		
		// auth.. url에 따른 선 확인.
	    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
	    	//0. 상태 저장.    이거 고민좀해봐야겠다..옳은가?
	    	redirector.setState($state.current)
	    	
	    	//1. 없으면 기본동작 하고.
	        if (!(toState.auth || toState.admin) ) return;
	        
	        //2. 아니면 기본동작막고..ㄱㄱ(위의 auth or admin 확인 동작 고고)
	        event.preventDefault();
	        
	        if(toState.auth)  return _checkAndResetUser(toState, toParams)
	        if(toState.admin) return _checkAdmin(toState, toParams)
	        
	        function _checkAndResetUser(toState, toParams) {
	        	toState.auth = false
	            authDAO.getLoginUser()
      		   		   .then(function (user) {
			      			   if(!user.isLogin) {
			      				   return redirector.goBefore().then(authDAO.showLoginView);
			      			   }
			      			   //root 에 재저장..중요.
			      			   $rootScope.currentUser = user 
			      			   return redirector.go(toState, toParams)
      		   		   })
      		   		   .then(function() { toState.auth = true })
      		   		   .catch(function() { toState.auth = true })
	        }
	        
	        function _checkAdmin(toState, toParams) {
	        	toState.admin = false
	            return authDAO.getLoginUser()
		   		   			  .then(function (user) {
		   		   				  	if(!user.isLogin) {
		   		   				  		return redirector.goBefore().then(authDAO.showLoginView)
		   		   				    }
		   		   				  	
		   		   				  return authDAO.loginUserIsAdmin()	
		   		   			  })
							  .then(function(isAdmin) {
								  if(!isAdmin) return redirector.goBefore()
								  else return redirector.go(toState, toParams) 
							  })
							  .then(function() { toState.admin = true })
							  .catch(function() { toState.admin = true;})
	        }
	    })
	}
	
})(define)