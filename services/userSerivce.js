/**
 * 
 */
var User = require('../domain/User.js');
var async = require('async');

var userService = module.exports = {
		findOrCreateUser : function(profile, result) {
			async.waterfall([User.findOrCreateUser.bind(profile)],
							result);
		}
};