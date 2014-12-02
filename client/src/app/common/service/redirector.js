/**
 * 
 */


(function(define, _) {
	
	define([], function () {
		
		return ['$state', '$window', makeRedirector];
	})
	
	function makeRedirector($state, $window) {
		
		var redirector = {}
		
		//$stateChangeStart 에서 항상 현재 상태 저장 해놓음.
		var _cachedState;
		redirector.setState = function (state) {
			_cachedState = _.clone(state)
		}
		redirector.goBefore = function () {
			if(_isNoUse(_cachedState)) return redirector.goMain()
			
			return redirector.go(_cachedState.name , _cachedState) //좀요상하지만..이렇게.
		}
		
		redirector.goMain = function () {
			return redirector.go('app.blogBoard.list')
		}
		
		//promise반환
		// str or state
		redirector.go = function (state, param) {
			param = param || {}
			
			if(_.isString(state)) {
				state = $state.get(state)
				if(_.isEmpty(state)) return console.error(stateStr + 'is not found');
				if(_isNoUse(state)) return console.error(stateStr + 'is no use state(abstract)')
			}
			
			
			return $state.go(state, param)
		}
		
		// 현재위치로 페이지 리로드  //$state로 하면..음.상태만바뀜..?
		redirector.reLoad	= function () {
			$window.location.reload()
		}
		
		function _isNoUse(state) {
	    	if(state && (state.abstract || state.name === ""))
	    		return true;
	    	else
	    		return false
	    }
		
		
		//---------------------------
		return redirector;
	}
	
	
})(define, _)