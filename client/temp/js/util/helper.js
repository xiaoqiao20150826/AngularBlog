/**
 * 
 */

$$namespace.include(function() {
	var $ = window.$
	
	
	var H = this.exports = {};
    
	H.exist = function (o) {
		if(_.isFunction(o)) return true;
		if(_.isNumber(o)) return true;
		else {
			if(!_.isEmpty(o)) return true;
			else return false;
		}
	}
	H.notExist = function (o) {
		return !H.exist(o)
	}
	//한글처리 encode된 데이터를...요래요래.
	H.decodeURI = function(o) {
		if(_.isString(o)) return decodeURI(o);
		
		if(_.isObject(o)) {
			for(var key in o) {
				var value = o[key]
				if(_.isFunction(value) ) continue;
				
				o[key] = decodeURI(value)
			}
			return o
		} else { //뭔경우가있으려나.
			
			return decodeURI(o)
		}
	}
	
	H.queryStringToMap = function(queryString) {
		return JSON.parse('{"' + queryString.replace(/&/g, "\",\"").replace(/=/g,"\":\"") + '"}') 
	}
	H.formDataToMap = function($form) {
		var nameAndValueList = $form.serializeArray()
		var map = {}
		for(var i in nameAndValueList) {
			var nameAndValue = nameAndValueList[i]
			  , key = nameAndValue['name']
			  , value = nameAndValue['value']
			
			map[key] = value
		}
		return map;
	}
	H.redirect = function (url) {
		return window.location.href = url || '/'; 
	}
	H.errorWarning = function (e, message) {
		alert(message)
		return e.preventDefault();
	}
	
	
	
})
//@ sourceURL=util/helper.js