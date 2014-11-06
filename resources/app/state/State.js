/**
 * 
 */

(function(define){
	define([], function() {
		return State;
	})
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
	
	
})(define)