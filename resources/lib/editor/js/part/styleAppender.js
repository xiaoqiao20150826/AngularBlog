
$$namespace.include(function (require, module) {
	/*
	 * private static field
	 */
	var COMPUTED_KEYS = ["height","width","left"];//right,top,bottom,��ġ,ũ���.
	
	var styleAppender = module.exports = {}
	//�̰� �Ƹ� ���ҳ�常 �ò���.
	styleAppender.appendStyleToElement = function(element,style) {
		var elementStyle = element.style,
			styleMap = this._getStyleMap(style);
		
		for(var key in styleMap) {
			var value = styleMap[key]
			  , elementValue = elementStyle[key]
			if(elementValue != "undefined" ) { //element�� ���� Ű�� ������ undefined
				if(_isEqualStyleOfParentSpan(element, key)) {
					var parentElement = element.parentElement
					  , childrenElements = parentElement.children //element��.
					  
					this._setOneStyleToElements(parentElement, key, value)
					this._setOneStyleToElements(childrenElements, key, value)
				}
				else {
					this._setOneStyleToElements(element, key, value)
				}
			}
		};
	}
	//�θ� span�̸鼭 ���� style���� ���� �־�.
	function _isEqualStyleOfParentSpan(element, key) {
		var parentElement = element.parentElement
		  , nodeName = parentElement.nodeName
		  , parentStyleValue = parentElement.style[key]
		var styleValue= element.style[key]
		
		if(nodeName =='SPAN' && parentStyleValue == styleValue) return true;
		else return false;
	}
	
	styleAppender._setOneStyleToElements  = function (elements, key, value) {
		if(!(elements instanceof Array || elements instanceof HTMLCollection) ) elements = [elements]
		
		for(var i=0, max=elements.length; i<max; ++i) {
			var element = elements[i]
			var elementStyle = element.style
			  , elementValue = elementStyle[key]
			if(this._mustBeComputedKey(key)) { //����ؾߵǴ� ���ڰ����� �����ѵ�..
				value = this._getComputedValue(elementValue, value);
				elementStyle[key] = value;
			} else { //�ƴ϶�� �������.
				if(elementValue == value) value = ''; 
				elementStyle[key] = value;
			}	
		}
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
		var unit = newValue.unit || oldValue.unit;
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
	
});


//@ sourceURL=editor/event/part/styleAppender.js