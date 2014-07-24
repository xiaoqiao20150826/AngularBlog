/**
 * 자주 사용되는. 약간 응용된 함수.
 * 
 */
var _ = require('underscore');

var U = module.exports = { 
		///////////////  1. 기본함수
		//하나라도 존재하지 않으면 false;
		exist : function(o) { //0일경우 실패해서.. , '' 일경우는??
			if(!(_.isArray(o)) ) return _existOne(o);
			else {
				for(var i in o) {
					if(!(_existOne(o[i]))) return false;
				}
				return true;
			}
		}
		//자바스크립트 파라미터는 지역 변수이다. 즉. 이렇게는 바꿀수가없다.
  		//그래서 배열을 이용하기로 결정. 인덱스로 직접 접근한다...위험해보여. 
		,swap : function(ab,mustSwap) {
			
			if(!(_.isArray(ab) && ab.length== 2)) throw 'ab must be [a,b]';
			if(mustSwap(ab[0],ab[1])) {
				var temp = ab[0];
				ab[0] = ab[1];
				ab[1] = temp;
			}
			return ab;
		}
		////////////////  2. 복사관련
		// _.clone가 object clone시 hasOwnProperty체크를 안해서 __proto 링크의 프로퍼티까지 복사해버린다. 
		// 깊은 복사
		,deepClone : function (obj) {
			return _deepClone(obj);
		}
		// source의 키와 new Type() 의 키가 일치하면 source의 값을 type에 deepClone한다.  
		// targetType : Type
		// sources : [sourceInstance1, sourceInstance2  ....]
		// eachWrap : typeInstance에 대해 추가할 행동.
		,createTargetFromSources : function _create(targetType, sources, afterHook4EachClone) {
			if(!(sources instanceof Array)) {return __createOne(sources); }
			
			return _.map(sources, function(sources) {
				return __createOne(sources);
			});

			function __createOne(source) {
				var target = U.cloneAboutTargetKeys(new targetType(), source)
				if(afterHook4EachClone) afterHook4EachClone(target, source);	// 추가해야할 기본설정.
				return target;
			}
		}
		// target의 필드에 해당하는 값이 source에 있다면
		// 그 값을 deepClone해서 target에 할당한다.
		// sideEffect function. 
		,cloneAboutTargetKeys : function (target, source) {
			for(var key in target) { 
				if(target.hasOwnProperty(key)) {
					var value = source[key];
					if(U.exist(value)) {
						target[key] = U.deepClone(value);
					}
				}
			}
			return target;
		}
		// 얕은복사 단순히 복사.
		,cloneFnOfObject : function (source, target) {
			var target = target || {};
			if(!(_.isObject(source))) throw 'o must be instance of Object';
			for(var key in source ) {
				if(U.exist(target[key])) throw 'helper가 이미 가지고 있는 함수를 참조하려고 한다.';
				var fn = source[key];
				
				if((source.hasOwnProperty(key)) 
				&& (_.isFunction(fn))
				&& (key.charAt(0) != '_')) {
					target[key] = fn;
				};
			}
			return target;
		}
		,pushInMidOfStr : function (source, pushData, mid) {
			var midIndex = source.lastIndexOf(mid)
			  , leftStr = source.slice(0, midIndex)
			  , rightStr = source.slice(midIndex, source.length);
			return leftStr + pushData + rightStr;
		}
		//join a to b 같은 것으로 이름 변경고려.
//		,joinSourcesIntoTagertsWithList : function (sources, targets, realKey, getRealData) {
//			if(getRealData == null) getRealData = _getRealData;
//			for(var i in targets) {
//				var target = targets[i];
//				var realDatas = [];
//				for(var j in sources) {
//					var source = sources[j];
//					var realData = getRealData(source, target);
//					if(realData) realDatas.push(realData);
//				}
//				
//				target[realKey] = realDatas;
//			}
//			return targets;
//		}
		,joinSourcesIntoTagertsWithList : function (sources, targets, realKey, getRealData, initSourceValue) {
			initSourceValue = initSourceValue || []
			return _template4join2(initSourceValue, function(left, right) {
				left.push(right);
				return left;
			})
			.apply(null, _.toArray(arguments))
			
		}
		,joinSourcesIntoTagerts : function (sources, targets, realKey, getRealData, initSourceValue) {
			if(!(U.exist(initSourceValue))) initSourceValue = null; 
			
			return _template4join2(initSourceValue, function(left, right) {
				return right;
			})
			.apply(null, _.toArray(arguments)) 
		}
		
};

/** 
 * private functions
 */
function _existOne(o) {
	if(o != null || o != undefined) return true;
	else return false;
};
function _template4join2(initResult, howToInsertInToResult) {
	return function(sources, targets, key, getSourceToJoin) {
		_.each(targets, function(target, i) {
			var result = _.clone(initResult);
			var bVal;
			for(j in sources) {
				source = sources[j];
				var source4join = getSourceToJoin(source, target);
				if(source4join) {
					result = howToInsertInToResult(result, source4join);
				}
			}
			// source를 모두 result로 모았으면 target에 join시켜.
			target[key] = result;
		});
		
		return targets;
	}
}
//clone
function _deepClone(obj) {
	// Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }
    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = _deepClone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = _deepClone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
}