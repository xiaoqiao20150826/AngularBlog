
/* 참조 및 초기화 */
var H = require('../common/helper.js')
  , C = require('../common/constant.js');


var _annoymousUser = null;
//////////////////
var User = module.exports = function User() {
	var o = User.getSchema();
	for(var key in o) {
		this[key] = null;
	}
	this.created = Date.now();
};

/* static method */
/* 생성자 */
User.createBy= function(model) {
	if(!(H.exist(model)) ) return User.getEmptyUser();
	// db의 model이라면.
	return H.createTargetFromSources(User, model);

};

User.getSchema = function () {
	return {
        '_id' : String,
//        'password' : String,
        'name' : String,
        'photo' : String,
        'email' : String,
        'created' : Date
		};
};
/* helper */

User.isAnnoymousId = function (userId) {
	if(userId == C.ANNOYMOUS_ID) 
		return true;
	else 
		return false;
};
User.getAnnoymousUser = function () {
	if(_annoymousUser) return _annoymousUser;
	else {
		var user = User.createBy({name:C.ANNOYMOUS_ID, photo:'', email:''})
		user.created = undefined;
		_annoymousUser = user; 
		return _annoymousUser;
	}
}

var _emptyUser = new User();
_emptyUser._id = null, _emptyUser.name = null;
User.getEmptyUser = function () {
	return _emptyUser; 
}


/* instance method */
//User.prototype.getPassword = function () {
//	return this.password;
//}
User.prototype.getId = function () {
	return this._id;
}
User.prototype.isNotEqualById = function (userId) {
	return !this.isEqualById(userId);
}
User.prototype.isEqualById = function (userId) {
	if (this._id == userId) return true;
	else return false;
}
User.prototype.isExist = function () {
	if(this._id == null || this.name == null) return false;
	else return true;
}
User.prototype.isNotExist = function () {
	return !this.isExist();
}
//User.prototype.getPassword = function () {
//	return this._password;
//}
