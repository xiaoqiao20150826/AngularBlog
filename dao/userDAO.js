/**
 * 
 */
//////// 전역변수
var User = require('../domain/User.js'),
	mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema(User.getSchema());
////////////////////
var userDAO = module.exports = mongoose.model('User', userSchema);
//---------static 이지만 싱글톤객체의 함수라고 생각하면 됨.
userDAO.removeAll = function (cb) {
	  this.remove({},cb);
};
userDAO.findAll = function (cb) {
	  this.find({},cb);
};
userDAO.create = function(users, cb) {
//	if(!(users instanceof Array)) throw 'users는 배열'
	var usersData = [];
	for(var i in users) {
		var userData = users[i].getUserData();
		usersData.push(userData);
	};
	this.create(usersData, cb);
};


//////////////

//---------instace
//animalSchema.methods.findSimilarTypes = function (cb) {
//	  return this.model('Animal').find({ type: this.type }, cb);
//	}


///////////////////////////////////

User.prototype.findById = function (id, cb) {
	this.model('UserModel').find({ oauthId: id }, cb);
};
