
/* 참조 및 초기화 */
var H = require('../common/helper.js');

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
	// 외부(트위터 등)의 정보라면 password는 저장되지 않는다.
	if(H.exist(model.provider)) {
		var user = new User();
		user._id = model.id +'-' +  model.provider;
		user.password = model.password || model.pw;
		user.name =  model.displayName || model.name;
		user.photo = model.photo || model._json.avatar_url ||
						 model._json.picture || model._json.pictureUrl || oneOfMany(model.photos);
		user.email = model.email || oneOfMany(model.emails);
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
        'password' : String,
        'name' : String,
        'photo' : String,
        'email' : String,
        'created' : Date
		};
};
/* instance method */
User.prototype.getPassword = function () {
	return this.password;
}
User.prototype.getId = function () {
	return this._id;
}
/* helper */
