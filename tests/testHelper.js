/**
 *  TestData 모음 getXX은 clone임.
 *  
 */
var Post = require('../domain/Post.js')
  , H = require('../common/helper.js');
var _ = require('underscore');

/*   */
var testHelper = module.exports = {};
// create 
// ex)..
//		var post = new Post()
//		, count = 10
//		, fields4TempValue = ['title','content'];
//		var result = testHelper.createObjs(post, count, fields4TempValue);

testHelper.createObjs = function(obj, count, fields4TempValue) {
	return _.map(_.range(1,count+1), function(v) {
		var newobj = H.deepClone(obj);
		for(var i in fields4TempValue) {
			var field = fields4TempValue[i];
			newobj[field] = field+v; //fied의 데이터는 필드이름1... 이런식
		}
		return newobj;
	})
}
