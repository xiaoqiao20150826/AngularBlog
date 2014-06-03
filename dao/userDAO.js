/**
 * 
 */
//////// 전역변수
var User = require('../domain/User.js'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema(User.getSchema());
////////////////////
var userDAO = module.exports = {};

userDAO._db = mongoose.model('User', userSchema);

//---------static 이지만 싱글톤객체의 함수라고 생각하면 됨.
userDAO.removeAll = function (cb) {
	  this._db.remove({},cb);
};
userDAO.findAll = function (cb) {
	  this._db.find({},cb);
};
userDAO.create = function(users, cb) {
	var usersData = [];
	if(!(users instanceof Array)) {users = [users]; };
	
	for(var i in users) {
		var user = users[i];
		usersData.push(user.getUserData());
	};
	
	this._db.create(usersData, cb);
};

userDAO.findOne = function (loginUser, cb) {
	this._db.findOne(loginUser.getOauthId(), cb);
};
userDAO.findById = function (id, cb) {
	this._db.findOne({oauthId : id}, cb);
};


///////////		helper		//////////////////////////////////
