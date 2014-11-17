/**
 */
define(['app'], function (app) {

	describe('ObjectDecorater', function() {
		var ObjectDecorator
		var target, objDec
		beforeEach(function () {
			target = { name : 1
					, fn: function (a, b, c, d, e) { return a }
					, fn2: function (a) {return a} 
			}
			angular.mock.module(app)
			angular.mock.inject(function ($injector) {   //TODO: 인자이름을 감지하네? 어떻게 한거지.
				ObjectDecorator = $injector.get('common.ObjectDecorator')
				objDec = new ObjectDecorator(target)
			})

		})
		it('#decorate should wrap target', function () {
			objDec
				.decorate('fn', function (a, b, c, d,e) {
					expect(d).toEqual(4)
				})
			target.fn(1,2,3,4,5);
			
		})
		it('#decorate should wrap target with decorate many', function () {
			objDec
				.decorate('fn', function (a) {
					expect(a).toEqual(2)
				})
				.decorate('fn2', function (a) {
					expect(a).toEqual(5)
				});
			target.fn(2);
			target.fn2(5);
		})
		it('should decorate with duplicate and reverse seq call', function () {
			var count = 0;
			var seq = []
			objDec
				.decorate('fn', function (a) {
					expect(a).toEqual(5)
					++count
					seq.push(1);
				})
				.decorate('fn', function (a) {
					expect(a).toEqual(5)
					++count
					seq.push(2);
				})
				.decorate('fn', function (a) {
					expect(a).toEqual(5)
					++count
					seq.push(3);
				});
			target.fn(5);
			expect(count).toEqual(3)
			expect(seq[seq.length-1]).toEqual(1)
		})
		it('should divide methodName and loction for decorate method ', function () {
			var beforeStr 	= 'method:before'
			  , afterStr 	= 'method:after'
			  , originStr 	= 'method'
				  
			var nameAndLoc  = objDec._divideNameAndLocation(beforeStr)
			expect(nameAndLoc.name).toEqual('method')
			expect(nameAndLoc.location).toEqual('before')
			
			var nameAndLoc  = objDec._divideNameAndLocation(afterStr)
			expect(nameAndLoc.location).toEqual('after')
			var nameAndLoc  = objDec._divideNameAndLocation(originStr)
			expect(nameAndLoc.location).toEqual('before')
			
			// console.error로 바꿨지.
//			objDec._divideNameAndLocation('method:wrong')
		})
		
		it('should call before and after ', function () {
			var target = {sum:function(a,b){return a+b} }
			var objDec = new ObjectDecorator(target)
			objDec
				.decorate('sum', function (a,b) {
					expect(a).toEqual(1)
					expect(b).toEqual(2)
				})
				.decorate('sum:before', function (a,b) {
					expect(a).toEqual(1)
					expect(b).toEqual(2)
				})
				.decorate('sum:after', function (returnVal) {
					expect(returnVal).toEqual(3)
				})
				
			target.sum(1,2)	
		})
		it('should run filter', function () {
			var target = {sum:function(a){return a} }
			var objDec = new ObjectDecorator(target)
			objDec
			.decorate('sum', function (a) {
				expect(a).toEqual(3)
			}, function (a) {
				if(a===5) return false;
			})
			
			target.sum(5)	
			target.sum(3)	
		})
		
		
	})
})