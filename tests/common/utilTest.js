

var U = require('../../common/util/util.js')
  , _ = require('underscore')
  , should = require('should');

  
describe('util', function () {
	describe('$ 기본함수' , function () {
		it('#exist should return false when null, undefined', function () {
			should.equal(U.exist([{},[],new String('2'),'ww',2,0]), true);
			should.equal(U.exist([{},0,null, 2, 0]), false);
			should.equal(U.exist([{},[],undefined, 2, 0]), false);
			should.equal(U.exist(0), true);
			should.equal(U.exist(undefined), false);
			should.equal(U.exist(null), false);
		})
		//TODO:효용성이 별로...
		it('#swap should good run by array.length', function () {
			var a = [9,4,5,6,6,7,8];
			var b = [1,4,5,6,6,7];
			var ab = [a,b];
			U.swap(ab, function(left , right) {
				if(left.length > right.length) return true;
				else return false;
			})
			b = ab.pop() , a = ab.pop();
			should.equal((a.length < b.length), true);
		})
	});
	describe('#cloneFnOfObject', function () {
		it('얕은 복사 함수만 복사되야 한다', function () {
			var source = { a:1, b:2, c:function c(){}, d:function d(){},k:function k(){}, e:[1,2]};
			var target = U.cloneFnOfObject(source);
			should.deepEqual(_.size(target), 3);
		})
		it('중복되는 프로퍼티가 없어야 한다.', function () {
			var source = {c:function c(){},f:1};
			var source2 = {cc:function d(){}, g:4};
			var source3 = {xc:function e(){}, v:5};
			var target = U.cloneFnOfObject(source);
			target = U.cloneFnOfObject(source2, target);
			target = U.cloneFnOfObject(source3, target);
			U.cloneFnOfObject.bind(null,source3, target).should.throw();
		})
	})
	
	
	
	//TODO:보류!
//	describe('#deepSearch(list, predicate(val) return T/F,  [context]', function() {
//		it('should find with deep search', function () {
//			 var targetObj = {target: 'find!'}; 
//			 var obj = {a:[1,[1,2,3],2,3], b:{c:{d:targetObj}}, c:3};
//			 
//			 var result = U.deepSearch(obj,function(val) {
//				 console.log(val);
//			 });
//			 console.log('result:',result);
//		})
//	})
});