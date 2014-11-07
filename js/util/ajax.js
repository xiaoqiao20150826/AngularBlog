/**
 * 
 */

$$namespace.include(function() {
	var $ = window.$
	
	var ajax = this.exports = {};
	
	//이름이 같을경우 프로퍼티가 먹혀버리는 문제가 있다 .조심.
	ajax.call4file = function (dataFn, url, data, type) {
		var options = {
				        'url': url,
				        'data': data,
				        'type': type || 'POST',
				        'processData': false,
				        'contentType': false
	    			  }
	    return _ajaxCall(dataFn, options)
	}
	ajax.call = function (dataFn, url, data, type) {
		var options = {
				        'url': url,
				        'data': data,
				        'type': type || 'POST'
		    		   }
		return _ajaxCall(dataFn, options)
	}
	function _ajaxCall(dataFn, options) {
		var options = options || {}
		options.beforeSend = ajax.showLoadingString 
	    dataFn = _wrapHideLoadingString1(dataFn)
		$.ajax(options)
		 .then(dataFn)
		 .fail(function(o, errStatus, error) {
			 ajax.hideLoadingString()
			 var errMessage = '['+errStatus+"]["+options.url+"] : "+ error.stack; 
			 console.error(errMessage);
		 });
	}
	
	function _wrapHideLoadingString1 (fn) {
		return function () {
			ajax.hideLoadingString()
			fn.apply(null, arguments);
		}
	}
	
	var $loadingNode = null
	ajax.hideLoadingString = function () {
		if(!$loadingNode) {$loadingNode = _create$loadingNode()}
		$loadingNode.hide()
		return ;
	}
	ajax.showLoadingString = function () {
		if(!$loadingNode) {$loadingNode = _create$loadingNode()}
		$loadingNode.show()
		return ;
	}
	_create$loadingNode = function () {
		var top = $(document).height() /5
		  , left  = $(window).width() /5
		return $('<div>Loading...</div>').prependTo('body')
		 .css({
			    "font-size":"500%"
			  , 'position': 'fixed'
			  , 'opacity': 0.2
			  , 'z-index':1000 
			  , 'top' : top
			  , 'left' : left
		      })
	}
	
})
//@ sourceURL=util/ajax.js