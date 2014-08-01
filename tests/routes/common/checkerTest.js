//deprease
var should = require('should')

var checker = require('../../../routes/common/checker.js')

describe('checker', function() {
	var userId = 'wef2343'
	  , user = {_id: userId}
	  , reqUserId = {userId : userId }
	  , req = { session : { passport : { user : user  } }
			  , method : 'get'  
			  , query : reqUserId
			  , body : reqUserId
			  , params : reqUserId
	  };	
	
	
	describe('#isAuthorizedAbout', function () {
		it('should run' , function () {
			req.method = 'post';
			var result = checker.isAuthorizedAbout(req);
			should.equal(result, true);
		})
		it('should wrong run' , function () {
			user._id = 'wg';
			var result = checker.isAuthorizedAbout(req);
			should.equal(result, false);
		})
	})
	
})