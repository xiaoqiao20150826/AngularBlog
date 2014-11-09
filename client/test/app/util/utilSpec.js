/**
 * 
 */

define(['app'], function (app) {
	var mock = angular.mock
	describe('util', function () {
		var U = null;
		beforeEach(function() {
			mock.module(app)
			mock.inject(['util',function (util) {
				U = util;
			}])
		})
		// 아직. 뭐 없다.
		it('should...', function () {
			expect('a').toEqual('a')
		})
			
	})
})