/**
 * 	# Why
 *   - 서버의 응답에 대해서. 발생하는 에러(예외상황, 실패상황)등의 공통된 처리를 한곳에 모으고 싶다.
 *   - 서버가 보내는 데이터의 구조를 알고 있는 객체가 필요. 다른 애들은 몰라도 되도록.
 *     (그럼으로 서버구조, 그로인한 에러처리 등의 처리는 이곳에서 하고
 *      서비스 호출자는 자신이 필요한 데이터에 집중만 할 수 있도록.
 *      
 *  # What
 *   - 서버의 응답 데이터에 대한 구조를 알고 있는 객체.
 *     응답의 특정 데이터 반환 전에 에러처리, 리다이렉트 등을 수행함.
 *    
 *  # How to use
 *  
 *   1) 서버의 요청에 대한 응답에 대해서 아래처럼 사용.
 *     ; 이때, $httpFail.get(...)
 *                  .catch(... ) <- 서버의 에러는 httpFailHandler내부에서 처리함.
 *     
 *   userService.getUser = function () {
 *   		return httpFailHandler.notifyAndDone ( $http.get('/getUser') )
 *   		OR
 *   		//redirectState(문자열)이 없으면 기본적으로 httpFail전의 상태(or app 메인)로 돌아감.
 *   		return httpFailHandler.notifyAndRedirect( $http.get('/getUser') , redirectState)
 *   			
 *   }
 *    
 *   2) 실제 사용하는 곳에서는  데이터(user)에 집중한다.
 *       userService.getUser()
 *       			.then(function (user) {
 *                      ..........
 *    
 */

// 싱글톤 httpFailHandler
(function(define, _){
	
	define([], function () {
		return ['common.util', '$q' ,'$state',  makeResFailHandler]
	})
	
	function makeResFailHandler (U, $q, $state) {
		var httpFailHandler = {}
		httpFailHandler.notifyAndRedirect = function (promise, stateStr) {
			return _notifyAnd(promise, _redirect1(stateStr))
		}
		httpFailHandler.notifyAndDone = function (promise) {
			return _notifyAnd(promise, _makeFakePromise)
		}
		function _notifyAnd(promise, failFn) {
			if(U.isNotPromise(promise)) return console.error(promise + 'is not promise');
			
			return  promise
				    .then(function (res) {
						var serverResult = res.data
						  , isSuccess    = serverResult.isSuccess
						  , obj			 = serverResult.obj
						  
					    if(!isSuccess) {
					    	 _notifyFail (obj)
					    	return failFn()
					    } else {
					    	return obj;  
					    }
					})
					.catch(_catchServerException)
		}
		function _redirect1(stateStr) {
			stateStr = stateStr || 'app.blogBoard.list' //main state
			return function () {
				if(_stateCanUse($state.current)) stateStr = $state.current
				
				$state.go(stateStr)
				return _makeFakePromise();
			}
		}
		function _stateCanUse(state) {
			if(state.name !== "" && !state.abstract) return true
			else return false;
		}
		
		function _makeFakePromise() {
			return $q.defer().promise //호출되지 않는 페이크 promise
		}
		
		// 에러일때, 구조를 알고있다.
		function _notifyFail (obj) {
			console.error(obj.message, obj.error)
			alert(obj.message, obj.error)			
		}
		function _catchServerException (err) {
			alert('severError : ', err)
			console.error('severError : ', err);
		}
		
		
		// ----------------------------------------
		return httpFailHandler;
	}
	
})(define, _)