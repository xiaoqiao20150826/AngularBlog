/**
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
		if(!(obj instanceof Object)) throw 'param is not Object type'
		
		this.obj = obj
		this.hookedInfoMap = {}
	}
	//method만.
	ObjectDecorator.prototype.inject = function (methodName, inner) {
		var obj = this.obj
		  , originMethod = obj[methodName]
		
		if(!(originMethod instanceof Function)) return console.error(methodName + ' is not Function')

		var hookedInfo = this.hookedInfoMap[methodName]
		if(hookedInfo === undefined || hookedInfo === null) {
			this.hookedInfoMap[methodName] = hookedInfo = {}
			hookedInfo.originMethod = originMethod
			hookedInfo.inners = [inner]
			hookedInfo.hook = _makeHook(obj, originMethod, hookedInfo.inners)  //메서드 당 하나만 만들어짐.
			obj[methodName] = hookedInfo.hook 
		} else {
			hookedInfo.inners.push(inner)  //이미 후크가 된경우에는  inner만 추가.
		}
		return this;
	}
	function _makeHook(obj, originMethod, inners) {
		function hook(/*args*/) {
			for(var i in inners) {
				var inner = inners[i]
				inner.apply(obj, arguments)
			}
			
			var ret = originMethod.apply(obj, arguments)
			return ret
		}
		return hook
	}
	
	ObjectDecorator.prototype.getHookedInfoMap = function () {
		return this.hookedInfoMap;
	}
	
})(define)