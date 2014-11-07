/**
 *  
 */

$$namespace.include(function(require, module) {

//	
	var Action = module.exports = function (contextOrMethod /*...args*/) {
		var context, method;
		
		if(_.isFunction(contextOrMethod) ) {
			context = null;
			method = contextOrMethod;
		}
		if(_.isArray(contextOrMethod)) {
			method = contextOrMethod.pop()
			context = contextOrMethod.pop()
		}
		if(!_.isFunction(method) ) throw console.error(method+ ' must be function '+new Error().stack)
		
		var args = _.rest(arguments);
		
		this.context = context;
		this.method = method;
		this.arguments = args;
		this.afterHook = _emptyHook;
	}
	
	Action.prototype.setAfterHook = function (hookFn) {
		if(!_.isFunction(hookFn) ) throw console.error(hookFn+ ': hook must be function '+new Error().stack)
		this.afterHook = hookFn
	}
	Action.prototype.run = function() {
		this.method.apply(this.context, this.arguments)
		this.afterHook.call(this);
	}
	function _emptyHook() {}
})
 