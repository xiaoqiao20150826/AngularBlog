
$$namespace.include(function (require, module) {
	/*
	 * private static field
	 */
	var COMPUTED_KEYS = ["height","width","left"];//right,top,bottom,위치,크기등.
	
	var styleAppender = module.exports = {
		appendStyleToElement : function(element,style) {
			var elementStyle = element.style,
				styleMap = this._getStyleMap(style);
			
			for(var key in styleMap) {
				var value = styleMap[key];
				if(elementStyle[key] != "undefined") {
					if(this._mustBeComputedKey(key)) {
						value = this._getComputedValue(elementStyle[key], value);
					} 
					console.log(element + elementStyle + value);
					elementStyle[key] = value;
				}
			};
		},
		_mustBeComputedKey : function(key) {
			for(var i in COMPUTED_KEYS) {
				var computedKey = COMPUTED_KEYS[i];
				if(key.indexOf(computedKey) != -1) {
					return true;
				}
			}
			return false;
		},
		_getComputedValue : function (oldValue, newValue) {
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
		},
		_getStyleMap : function __getStyleMap(style) {
			var styleMap = {},
			styles = style.split(";");
		for(var i in styles) {
			var styleStr = styles[i];
			if(styleStr != "") {
				var keyAndValueArray = styleStr.split(":"),
					key = keyAndValueArray[0].trim(),value = keyAndValueArray[1].trim(),
					entry =  {key:key,value:value};
				styleMap[entry.key] = entry.value;
			};
		};
		return styleMap;
		} 
	
	};
	
});