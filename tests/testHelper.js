var Post = require('../domain/Post.js')
  , H = require('../common/helper.js')
  , should = require('should');
var _ = require('underscore');


/*   */
var testHelper = module.exports = {};
//Helper의 기능도 사용할 수 있도록 testHelper에 통합.
H.cloneFnOfObject(H, testHelper);
///////////////////////////////////////////////////////////

// create  ex) 
//				var post = new Post()
//				, count = 10
//				, keys4tempValue = ['title','content'];
//				var result = testHelper.createObjs(post, count, keys4tempValue);
testHelper.createObjsByType = function(Type, count, keys4tempValue) {
	return _createObjs(createOne1(Type), count, keys4tempValue);
	
	function createOne1(_Type) {
		return function() {
			return new _Type();
		}
	}
}
testHelper.createObjs = function(obj, count, keys4tempValue) {
	return _createObjs(createOne1(obj), count, keys4tempValue);
	
	function createOne1(_obj) {
		return function() {
			return H.deepClone(_obj);
		}
	}
};


testHelper.testCatch1 = function (nextCase) {
	return function (err) {
		console.log(err);
		nextCase(err)
		
	}
}

//
testHelper.deepEqualsByKeys = function (expectedSome, actualsSome, keys) {
	_deepEqualsByKeys(expectedSome, actualsSome, keys);
};

/* private  */
function _createObjs(createOne, count, keys4tempValue) {
	return _.map(_.range(1,count+1), function(v) {
		var newobj = createOne();
		for(var i in keys4tempValue) {
			var field = keys4tempValue[i];
			newobj[field] = field+v; //field의 데이터는 필드이름1... 이런식
		}
		return newobj;
	})
}
function _deepEqualsByKeys(expectedSome, actualSome, keys) {
	if(!(H.exist(keys))) { throw 'need keys to compare' }; 
	//없는것을 비교하려하는지..확인.
	should.exist(expectedSome);
	should.exist(actualSome); 
	
	//하나는 이렇게하는데.
	var deepEqualOne = __deepEqualOneByKeys1(keys);
	if(!(expectedSome instanceof Array) && !(actualSome instanceof Array)) {
		return deepEqualOne(expectedSome,actualSome);
	}
	
	// 배열일 경우
	// 둘중 길이가 작은것을 기준으로 for문을 수행한다.
	var minSome = _.min([expectedSome, actualSome], function(val) {
		return val.length;
	});
	for(var i in minSome) {
		deepEqualOne(expectedSome[i], actualSome[i]);
	}
	
	
	function __deepEqualOneByKeys1(keys) {
		return function(e, a) {
			for(var i in keys) {
				var key = keys[i];
				should.deepEqual(e[key],a[key]);
			}	
		};
	};
};