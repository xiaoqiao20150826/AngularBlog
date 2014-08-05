/**
 *  단순히 페이지에 문자열 추가하는 기능.
 *   - http:://.......html?debug= true; 디버그모드일 경우만 동작하도록
 *   - 아니면 false;
 */

(function (window) {
	var location = window.location
	  , $$namespace = window.$$namespace;
	
	var utilPackage = $$namespace.package('com.kang').package('util')
	utilPackage.export.log = log1(normalNewDiv);
	utilPackage.export.errLog = debugLog1(errNewDiv);

	//일반적인 html 로그
	function normalNewDiv (strings) {
		return $('<div>').text(strings);
	}
	//에러로그 (특별한 것은 없고 그냥 눈에띄는것)
	function errNewDiv(strings) {
		return $('<div>').text('ERR >>>>> '+ strings)
						 .css({
						      "background-color": "yellow",
						      "font-weight": "bolder"
						  });
	}
	
	
	function debugLog1(errNewDiv) {
		if(!isDebugMode()) return function() {};
		return log1(errNewDiv);
	}
	function log1(newDivFn) {
		var $div = $('<div>');
		$div.prependTo('body');
		var count = 0;
		
		return function log() {
			var list = [];
			var args = Array.prototype.slice.apply(arguments);
			getStrings1(list)(args);
			
			var strings = '('+(++count)+')'+ ' : '+list
			  , newDiv = newDivFn(strings);
			
			$div.append(newDiv);
			return list;
		}
	}
	function isDebugMode() {
		var qs = getQueryString();
		if(qs.debug) return true
		else return false;
	}
		
	function getStrings1(list) {
		return function getStrings(o) {
			if(o == undefined || o == null) {{return getStrings('arg is not exist');}}
			if(isElement(o)) {return getStrings(o.outerHTML);}				
			if(isJquery(o)) { return getStrings(o.toArray());}
			if(isArray(o)) {
				for(var i in o) {
					var v = o[i];
					getStrings(v);
				}
				return ;
			}
			if(isObjectAndNotElseType(o)) { return getStrings(JSON.stringify(o))}
			
			// else
			return list.push(o);
		}
	}
	
	
	function isElement(o) {
		if(o.nodeType != undefined && o.nodeType != null )
			return true;					
		else 
			return false;
	}
	function isJquery(o) {
		if(o instanceof $) return true;
		else return false;
	}
	function isArray(o) {
		if(o instanceof Array)  return true;
		else return false;
	}
	function isObjectAndNotElseType(o) {
		if(!(isElement(o) || isJquery(o) || isArray(o))) {
			if(o instanceof Object) return true;
		}
		return false;
	}
	////
	function getQueryString() {
		  var result = {}, queryString = location.search.slice(1),
		      re = /([^&=]+)=([^&]*)/g, m;

		  while (m = re.exec(queryString)) {
		    result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		  }

		  return result;
	}

})(this);

//@ sourceURL=util/helper.js