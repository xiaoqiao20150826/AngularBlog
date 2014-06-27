/**
 * New node file
 */
var assert = require("assert");
describe('Array', function(){
	before(function() {
		
	});
	
	describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
})
//
//before(function(){
//  //TODO seed the database
//});
//describe('suite one ',function(){
//  beforeEach(function(){
//    //todo log in test user
//  });
//  it('test one', function(done){
//  ...
//  });
//});