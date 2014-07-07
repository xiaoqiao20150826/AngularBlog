/**
 * 
 */
var userDAO = require('../dao/userDAO.js');
var User = require('../domain/User.js');
var H = require('../common/helper.js');

var oauthService = module.exports = {
		findOrCreateUser : function(next, profile) {
			var user =  User.createBy(profile);
			userDAO.findOrCreate(user, H.doneOrErrFn(done));
			
			function done(data) {
				next(User.createBy(data));
			};
		}
};
			
