/**
 * 
 */
var userDAO = require('../dao/userDAO.js');
var User = require('../domain/User.js');
var hitOrFail = require('../common/cbSupporter.js').hitOrFail;

var userService = module.exports = {
		findOrCreateUser : function(profile, otherDo) {
			var loginUser =  new User(profile);
			userDAO.findOne(loginUser, hitOrFail(hitCb, failCb));
			
			function hitCb(userData) {
				otherDo(userData);
			};
			function failCb(err, userData) {
				userDAO.create(loginUser, 
							   hitOrFail(hitCb, function fail() {
								   throw 'create fail : ' + err;
							   }));
			};
		}
};
			
