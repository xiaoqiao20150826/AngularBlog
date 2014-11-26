/**
 * 
 */
var userDAO = require('../dao/userDAO.js');
var User = require('../domain/User.js');
var H = require('../common/helper.js');

var userService = module.exports = {
		findOrCreate : function(loginUser) {
			return userDAO.findOrCreateByUser(loginUser);
		}
};
			
