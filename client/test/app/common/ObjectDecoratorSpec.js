/**
 */
define(['app'], function (app) {

	describe('ObjectDecorater', function() {
		var target, objDec
		beforeEach(function () {
			target = { name : 1
					, fn: function (a, b, c, d, e) { return a }
					, fn2: function (a) {return a} 
			}
			angular.mock.module(app)
			angular.mock.inject(function ($injector) {
				var ObjectDecorator = $injector.get('ObjectDecorator')
				objDec = new ObjectDecorator(target)
			})

		})
		
		it('should decorate target', function () {
			objDec
				.inject('fn', function (a, b, c, d,e) {
					expect(d).toEqual(4)
				})
			target.fn(1,2,3,4,5);
			
		})
		it('should decorate target with inject many', function () {
			objDec
				.inject('fn', function (a) {
					expect(a).toEqual(2)
				})
				.inject('fn2', function (a) {
					expect(a).toEqual(5)
				});
			target.fn(2);
			target.fn2(5);
		})
		it('should inject with duplicate and seq call', function () {
			var count = 0;
			var seq = []
			objDec
				.inject('fn', function (a) {
					expect(a).toEqual(5)
					++count
					seq.push(1);
				})
				.inject('fn', function (a) {
					expect(a).toEqual(5)
					++count
					seq.push(2);
				})
				.inject('fn', function (a) {
					expect(a).toEqual(5)
					++count
					seq.push(3);
				});
			target.fn(5);
			expect(count).toEqual(3)
			expect(seq[seq.length-1]).toEqual(3)
		})
	})
})