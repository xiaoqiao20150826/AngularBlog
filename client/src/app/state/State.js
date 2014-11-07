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
	State.prototype.view = function (viewName, viewResource) {
		this.views[viewName] = {templateUrl : viewResource }  //template면 직접 내용넣기임.
		return this;
	}
	State.prototype.url = function(url) { this.url = url;  return this;}
	// template만 사용할때...scope필요할시 할듯.
	State.prototype.controller = function(ctrl) { this.controller = ctrl;  return this;}
	
	
})(define)