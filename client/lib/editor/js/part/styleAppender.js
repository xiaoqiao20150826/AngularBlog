
$$namespace.include(function (require, module) {
	/*
	 * private static field
	 */
	var COMPUTED_KEYS = ["height","width","left"];//right,top,bottom,위치,크기등.
	
	var H = require('/js/util/helper.js')
	
	var styleAppender = module.exports = {}
	//이게 아마 스팬노드만 올꺼야.
	styleAppender.appendStyleToElements = function(elements, style) {
		if(!H.isArray(elements)) elements = [elements]
		var length = elements.length
		
		for(var i =0,max =length; i<max; ++i) {
			var element = elements[i]
			this.appendStyleToElement(element,style)
		}
	}
	styleAppender.appendStyleToElement = function(element,style) {
		var elementStyle = element.style,
			styleMap = this._getStyleMap(style);
		
		for(var key in styleMap) {
			var value = styleMap[key]
			  , elementValue = elementStyle[key]
			if(elementValue != "undefined" ) { //element에 없는 키값 넣을때 undefined
				if(this._mustBeComputedKey(key)) { //계산해야되는 숫자같은값 가진넘들..
					value = this._getComputedValue(elementValue, value);
					elementStyle[key] = value;
				} else { //아니라면 토글하자.
					if(elementValue == value) value = ''; 
					elementStyle[key] = value;
				}				
			}
		};
	}
	styleAppender._mustBeComputedKey = function _mustBeComputedKey(key) {
		for(var i in COMPUTED_KEYS) {
			var computedKey = COMPUTED_KEYS[i];
			if(key.indexOf(computedKey) != -1) {
				return true;
			}
		}
		return false;
	}
	styleAppender._getComputedValue = function _getComputedValue(oldValue, newValue) {
		newValue = __divideNumberAndUnit(newValue.trim());
		oldValue = __divideNumberAndUnit(oldValue.trim());
		
		if(__valueIfminus(newValue)) {
			var sum = (oldValue.number*1) - (newValue.number*1);
			if(sum<0) sum=0;
		} else {
			sum = (oldValue.number*1) + (newValue.number*1); 
		}
		var unit = newValue.unit || oldValue.unit || 0;
		return sum + unit;
		function __valueIfminus(newValue) {
			var number = newValue.number;
			var index = number.indexOf("-");
			if(index != -1) {
				newValue.number = number.replace("-","");
				return true;
			}
			return false;
		};
		function __divideNumberAndUnit(value) {
			var units = ["em", "px"];
			if(value=="") return {number:0};
			for(var i in units) {
				var index = value.indexOf(units[i]);
				if(index>0) {
					var number = value.slice(0,index);
					return {number: number,
							unit: units[i]};
				}
			}
			return {number: value , unit:null};
		};			
	}
	styleAppender._getStyleMap = function _getStyleMap(style) {
		var styleMap = {},
		styles = style.split(";");
		for(var i in styles) {
			var styleStr = styles[i];
			if(styleStr == undefined || styleStr == null) {continue;}
			styleStr = styleStr.trim();
			if(styleStr == "") {continue;}
			
			var keyAndValueArray = styleStr.split(":"),
				key = keyAndValueArray[0].trim(),value = keyAndValueArray[1].trim(),
				entry =  {key:key,value:value};
			styleMap[entry.key] = entry.value;
		};
		return styleMap;
	} 
	
	//새로추가한 것.
	
	styleAppender.getInheritedSytleMap = function ($node) {
		var $spans = _findParentSpanBeforeLine($node)
		var styleMap = _reduceStyles($spans)
		return styleMap
	}
	function _findParentSpanBeforeLine($node) {
		var nodes = []
		findParent($node)
		
		return $(nodes)
		
		function findParent($node) {
			if(H.isSpan($node)) nodes.push($node[0])
			if(H.isEmpty($node) || H.isLine($node)) return;
			
			return findParent($node.parent())	
		}
	}
	function _reduceStyles($spans) {
		var styleMap = {}
		var spansLength = $spans.length; //조심 그냥하면 무한...루프
		for(var i=0,max = spansLength; i<max; ++i) {
			var span = $spans[i]
			var cssMap = _getCssMap(span)
			_addStyle(styleMap, cssMap)
		}
		// a에게 b의 값을 단순히 덮어쓰기. 중복시에는 최상위인 마지막노드의 값이 들어가게.
		return styleMap;
		
		function _getCssMap (node) {
			var cssText = span.style.cssText
			  , lastSemicolonIndex = cssText.lastIndexOf(';')
			cssText = cssText.slice(0, lastSemicolonIndex) //마지막 세미콜론없에기
			
			var cssStrings = cssText.split(';')
			var cssMap = {}
			for(var i=0,max = cssStrings.length; i<max; ++i) {
				var cssString = cssStrings[i]
				var pair = cssString.split(':')
				if(pair.length != 2) {continue}//이상해질수도있어.
				var key = pair[0].trim()
				  , value = pair[1].trim()
				cssMap[key] = value
			}
			return cssMap
		}
		function _addStyle(a, b) {
			var keys = Object.keys(b)
			for(var i in keys) {
				var key = keys[i]
				a[key] = b[key]
			}
		}
	}
});


//@ sourceURL=editor/event/part/styleAppender.js