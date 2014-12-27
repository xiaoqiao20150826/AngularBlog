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
		       , '$location'
		       , 'common.util'
		       , 'common.redirector'
		       , 'app.authDAO'
		       , setupHandler
		       ]
	})
	// TODO: 모듈로..분리시켜야 해
//			 같은동작.. 따로 제외하고 싶은데 
//	auth/admin/wirter 의'선' false, '후' true 설정을 어찌처리해야할지.
	
	function setupHandler($rootScope, $state, $location, U, redirector,  authDAO) {
		
		// -------------url 한글 디코딩.... ㅡㅡ 
		// 이렇게 private 함수를 직접 다루는 방식....좋지 않아....
		var origin$$compose = $location.$$compose
		$location.$$compose = function() {
			origin$$compose.apply($location, arguments)
			$location.$$url = decodeURI($location.$$url)
			$location.$$absUrl = decodeURI($location.$$absUrl)
		}
		
		// ------ auth,admin 등 state에 부여한 기본 규칙으로.. 검증 후 리다이렉트.
	    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
	    	//0. 상태 저장.    이거 고민좀해봐야겠다..옳은가?
	    	redirector.setState($state.current)
	    	
	    	//1. 없으면 기본동작 하고.
	        if (!(toState.auth || toState.admin || toState.writer) ) return;
	        
	        //2. 아니면 기본동작막고..ㄱㄱ(위의 auth or admin 확인 동작 고고)
	        
	    	event.preventDefault();
	    	if(toState.admin)  return _checkAdmin(toState, toParams)
	    	if(toState.writer) return _checkWriter(toState, toParams)
	        if(toState.auth)   return _checkLoginAndResetUser(toState, toParams)
	        
	        function _checkWriter(toState, toParams) {
	        	if(U.notExist(toParams.writerId)) return alert('writerId not exist')
	        	toState.writer = false
	            return authDAO.getLoginUser()
		   		   			  .then(function (user) {
		   		   				  	if(!user.isLogin) {
		   		   				  		return redirector.goBefore().then(authDAO.showLoginView)
		   		   				    }
		   		   				  	
		   		   				  return authDAO.loginUserEqual(toParams.writerId)
		   		   				  				.then(function(isEqual) {
													  if(!isEqual) return redirector.goBefore()
													  else return redirector.go(toState, toParams) 
												})
		   		   			  })
							  .then(function() { toState.writer = true })
							  .catch(function() { toState.writer = true;})
	        }
	        function _checkLoginAndResetUser(toState, toParams) {
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
		   		   				  				.then(function(isAdmin) {
		   										  if(!isAdmin) return redirector.goBefore()
		   										  else return redirector.go(toState, toParams) 
		   		   				  				})
		   		   			  })
							  .then(function() { toState.admin = true  })
							  .catch(function() { toState.admin = true;})
	        }
	    })
	}
	
})(define)