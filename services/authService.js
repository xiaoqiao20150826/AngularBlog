/**
 * userServices
 */
var userService = require('./userSerivce.js');

var authService = module.exports = {
///////////인증관련
		verify : function(profile, done) {
			
			//1. user가 있는지 찾아봄.
			userService.findOrCreateUser(profile, result);
			//2. user의 id를 session에 저장 후 ?
			function result(user) { 
				done(null, user);
			}
			
		},
		
		
};