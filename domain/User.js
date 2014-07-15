
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
// 생성자
/* 생성자 */
User.createBy= function(model) {
	if(!(H.exist(model)) ) return null;
	// 외부(트위터 등)의 정보라면 password는 저장되지 않는다.
	if(H.exist(model.provider)) {
		var user = new User();
		user._id = model.id +'-' +  model.provider;
//		user.password = model.password || model.pw;
		user.name =  model.displayName || model.name;
		user.photo = model.photo || model._json.avatar_url || model._json.picture || 
					 model._json.pictureUrl || oneOfMany(model.photos);
		user.email = model.email || oneOfMany(model.emails);
		if(model.provider == 'facebook') {
			user.photo = model._json.picture.data.url
		}
		return user;
		
	}
	// db의 model이라면.
	return H.createTargetFromSources(User, model);
	
	function oneOfMany(many) {
		if(many == undefined) {return null;}
		return many.shift().value || null; 
	};
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


/* instance method */
//User.prototype.getPassword = function () {
//	return this.password;
//}
User.prototype.getId = function () {
	return this._id;
}
//User.prototype.getPassword = function () {
//	return this._password;
//}
