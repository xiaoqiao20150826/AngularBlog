/**
 * 
 */
var _ = require('underscore');

var should = require('should');
  
describe('underscore', function() {
	describe('know how to run functions', function () {
		describe('#each(obj, iterator(obj[i],i,obj) , context) return obj', function() {
			it('have not side effect about array, object', function () {
				var a_ref ={a:3}
				  , e_ref = {a:3};
				var a_ref2 = [1,2,3]
				  , e_ref2 = [1,2,3];
				var a_list =[e_ref,e_ref2,{b:3},[1,2,3], 1,2]
				  , e_list = [e_ref,e_ref2,{b:3},[1,2,3], 1,2];
				var result = _.each(e_list, iter);
				
				_.isEqual(result, e_list).should.be.true;
				_.isEqual(e_list, a_list).should.be.true;
				_.isEqual(a_ref, e_ref).should.be.true;
				_.isEqual(a_ref2, e_ref2).should.be.true;
				// 1) 얕은 탐색을 수행.(객체안의 객체를 탐색하지는 않는다는 것).
				// 2) val에 대해서는 side effect 없다.(원소를 값복사, 참조복사로 val에 할당하는 것이므로)
				function iter(val, i, obj) {
					val = 'none side effect';
//					obj[i] = 'side effect';
				};
			})
		});
		//장황스럽지만.. 타입이 아닌 값만 비교하면서 깊은 비교를 한다.(내가원하던)
		describe('#isXXX fn' , function() {
			describe('#isEqual(a,b)',function() {
				it('should equal a,b about Object,Array', function() {
					var a = [1,2,3]
					  , b = [1,2,3];
					var a2 = [ [1,2,3],[1,[1,2,3],2,3],  1,2,3]
					  , b2 = [ [1,2,3],[1,[1,2,3],2,3],  1,2,3];
					var aa = {a:1, b:2, c:3}
					  , bb = {a:1, b:2, c:3};
					var aa2 = {a:[1,[1,2,3],2,3], b:a2, c:3}
					  , bb2 = {a:[1,[1,2,3],2,3], b:b2, c:3};
					
					('s'===new String('s')).should.be.false;  // 이건 타입비교하는데
					_.isEqual('s',new String('s')).should.be.true;  // 타입비교안하네. 값만!
					
					_.isEqual(a,b).should.be.true;
					_.isEqual(a2,b2).should.be.true;
					_.isEqual(aa,bb).should.be.true;
					_.isEqual(aa2,bb2).should.be.true; //b가 다름. 참조도 같지 않아도 되네.
					_.isEqual([ [1,2,3],[1,[1,2,3],2,3],  1,2,3]
					        , [ [1,2,3],[1,[1,{},3],2,3],  1,2,3]).should.be.false;
					_.isEqual([1,2,3],[1,1,3]).should.be.false;
					_.isEqual({a:1, b:2, d:3},{a:1, b:2, c:3}).should.be.false;
					_.isEqual({a:[1,[1,2,3],2,3], b:a2, c:3}
					        , {a:[1,[1,2,3],2,3], b:bb, c:3}).should.be.false;
				});
				//함수는 object이지만, object는 함수가 아니다.
				it('#isObject should not return ture with function', function () {
					function  fn () {};
					var obj = {}
					should.equal(_.isObject(fn), true);
					should.equal(_.isFunction(obj), false);
				});
			});

		})
		describe('$정렬', function() {
			it('#sortBy should reverse array element', function() {
				var list =  [{a:1},{a:2},{a:3}];
				var a_list = [{a:3},{a:2},{a:1}];
				
				var e_list = _.sortBy(list, function(o) {
					return -o.a;
				});
				should.deepEqual(e_list, a_list);
			})
		})
		describe('#etc', function () {
			it('#union', function () {
				var a = {a:1};
				var b = {b:1};
				var c = [4,5];
				var d = [6,2];
				should.equal(_.union(a,b,c,d).length, 6)
				should.deepEqual(_.compact(_.union(null,'sss')), ['sss'])
			})
			it('#isEmpty', function () {
				var  k = {
						  "datas": {
							    "pageCount": 0,
							    "posts": [],
							    "answerCount": []
							  },
							  "loginUser": null
							};
				should.equal(false, _.isEmpty(k));
				should.equal(false, _.isEmpty('ee'));
				should.equal(true, _.isEmpty({}));
				should.equal(true, _.isEmpty(''));
				should.equal(true, _.isEmpty(""));
				should.equal(true, _.isEmpty([]));
				should.equal(true, _.isEmpty(function(){})); //함수는 없는샘치는군!
//				should.equal(true, _.isEmpty(0)); 	//숫자가 있으면 다 false
//				should.equal(true, _.isEmpty(1));   
//				should.equal(true, _.isEmpty(-1));
//				should.equal(true, _.isEmpty(11));
			})
			it('#compact', function() {
				should.deepEqual([1,{a:1}, true], _.compact([1,{a:1},null,'',false, true]))
			})
			it('temp',function() {
				var  k = {
						  "datas": {
							    "pageCount": 0,
							    "posts": [],
							    "answerCount": []
							  },
							  "loginUser": null
							};
//				console.log(JSON.stringify(k));
			})
		})
		
	});
});  
