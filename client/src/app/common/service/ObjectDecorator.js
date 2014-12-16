/**
 * 		# Why i make this
 *       - '인스턴스', 'angular service(인스턴스)'의 함수가 '어느 곳에서인가' 실행되었을 경우 
 *       그 전달 인자가 무엇인지 확인하기 위해 만들게 되었다.
 *       - 그러나 조금 더 일반적인 용도로 before, after등의 인스턴스의 함수 후킹을 위해
 *       사용할 예정이기도 하다. 
 *       TODO: 현재는 inner의 arguments 확인 용도로만 사용된다.
 * 
 * 		# What is this
 *        - 인스턴스의 함수 장식자.
 *        - 앙귤러 app에 포함된(provider에 의해 생성된) 서비스의 함수 장식자.
 *        
 *      # How to make
 *        - 객체의 함수 할당이 자유롭다는 것 이용.
 *        
 *      # How to use  
 *        var od = ObjectDecorator(객체)
 *        
 *        // wrap 보다는 decorate가 명확할 것 같아서. 이 이름.사용.
 *        // filter는 wrapFn에 전달되는 인자를 필터링하여 wrapFn을 동작시킬지 여부를 결정.
 *        od.decorate('함수이름', wrapFn, filter)  		   // default -> before
 *        od.decorate('함수이름:before', wrapFn, filter)  // before -> args에 대한 동작  추가.
 *        od.decorate('함수이름:after', wrapFn, filter)  // after ->returnValue에 대한 동작  추가.
 *        
 *     
 *      # etc
 *       - 중복하여 decorate할 경우. 호출방식을 정해야함.(모든 decorateFn 호출, 혹은 최신것 하나만 호출.)
 *       - filtering위해서 decorateBefore필요
 *       - TODO: 본래 함수 복구 기능 성능을 고려한다면 필요할 것..
 *           
 */
(function(define){
	define([], function ( ) {
		return defineClass
	}) 
	function defineClass() {
		return ObjectDecorator
	}
   //////////////////////////////////////////////////////////
	// ObjectDec class
	function ObjectDecorator (obj) {
		if(!(obj instanceof Object)) return console.error('param is not Object type');
		
		this.obj = obj
		this.hookedInfoMap = {}
	}
	//method만.
	ObjectDecorator.prototype.decorate = function (nameAndLoc, wrapFn, filter) {
		var nameAndLoc = this._divideNameAndLocation(nameAndLoc)
		  , methodName = nameAndLoc.name
		  , location   = nameAndLoc.location    // before , after 의 위치.
		  , wrapFn	   = _makeFilteredWrapFn(wrapFn, filter)
		  
		  
		if(this.existHookedMethod(methodName)) {
			  this._addWrapFn(methodName, location, wrapFn)//이미 후크가 된경우에는  method4decorate만 추가.
		} else {
			  this._wrapAndSetHookedInfo(methodName, location, wrapFn)
		}
		return this;
	}
	function _makeFilteredWrapFn (wrapFn, filter) {
		if(!filter) filter = trueFilter
		
		return function (/* args */) {
			if(filter.apply(null, arguments)) return wrapFn.apply(null, arguments) 
		}
		function trueFilter(){return true}
	}
	
	ObjectDecorator.prototype.existHookedMethod = function (methodName) {
		if(this.hookedInfoMap[methodName]) return true;
		else return false;
	}
	
	ObjectDecorator.prototype._addWrapFn = function(methodName, location, wrapFn) {
		var hookedInfo = this._getHookedInfo(methodName)
		if(!hookedInfo) return console.error( methodName + 'was not wraped')
		
		hookedInfo[location].push(wrapFn)
//		hookedInfo.inners = [wrapFn]
	}
	
	ObjectDecorator.prototype._getHookedInfo = function (methodName) {
		return this.hookedInfoMap[methodName]
	}
	
	ObjectDecorator.prototype._wrapAndSetHookedInfo = function (methodName, location,wrapFn) {
		
		var hookedInfo = this._makeHookedInfo(methodName,location , wrapFn)
		//set and wrap
		this.hookedInfoMap[methodName] = hookedInfo 
		this.obj[methodName] = hookedInfo.hook
	}
	
	ObjectDecorator.prototype._makeHookedInfo = function (methodName,location, wrapFn) {
		var obj = this.obj
		  , originMethod = obj[methodName]
		
		if(!(originMethod instanceof Function)) return console.error(methodName + ' is not Function')
		
		var hookedInfo = { 
				            originMethod : originMethod
						  ,	before		 : [] 
						  , after 		 : []
						 }
		
		hookedInfo[location].push(wrapFn)
		hookedInfo.hook = _makeHook(obj, hookedInfo, location)  //메서드 당 하나만 만들어짐.
		
		return hookedInfo;
	}
	
	function _makeHook(obj, hookedInfo, location) {
		var originMethod = hookedInfo.originMethod
		  , before       = hookedInfo.before 
		  , after       = hookedInfo.after 
		
		function hook(/*args*/) {
			_callMethods(obj, before, arguments)
			
			var ret = originMethod.apply(obj, arguments)
			
			var newRet = _callMethods(obj, after, [ret]) //apply호출위해.
			if(newRet === undefined || newRet === null) newRet = ret
			return newRet
		}
		
		return hook
	}
	function _callMethods (obj, wrapFns, args) {
		var ret
		for(var i=(wrapFns.length-1), min=-1; i > min; --i) { //역순.
			var wrapFn = wrapFns[i]
			 ret = wrapFn.apply(obj, args)
		}
		return ret;
	}
	/////////////////////////
	var LOCATION = {'before' : true, 'after' : true}
	ObjectDecorator.prototype._divideNameAndLocation = function (nameAndLocation) {
		var char4divide = ':';
		
		var nameAndLocation = nameAndLocation.split(char4divide)
		
		var name = nameAndLocation[0]
		//index 넘으면 undefined이고 그때는 기본값으로 before줌.
		var location = nameAndLocation[1] ? nameAndLocation[1] : 'before'  
		if(!LOCATION[location]) return console.error(location + ' : must be one of ' + Object.keys(LOCATION) );
		
		return {name: name, location : location}
	}
	
})(define)