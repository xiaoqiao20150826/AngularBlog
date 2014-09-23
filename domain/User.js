
/* 참조 및 초기화 */
var H = require('../common/helper.js')


//////////////////
var User = module.exports = function User() {
	var o = User.getSchema();
	for(var key in o) {
		this[key] = null;
	}
	this.created = Date.now();
	this.visitCount = 0;
};


/* static method */
User.ANNOYMOUS_ID = 'annoymous'; 
/* 생성자 */
User.createBy= function(model) {
	if(!(H.exist(model)) ) return User.getAnnoymousUser();
	// db의 model이라면.
	return H.createTargetFromSources(User, model);

};

User.getSchema = function () {
	return {
        '_id' : String,
        'name' : String,
        'photo' : String,
        'email' : String,
        'created' : Date,
        'visitCount' : Number
		};
};
/* helper */

User.isAnnoymousId = function (userId) {
	if(userId == User.ANNOYMOUS_ID) 
		return true;
	else 
		return false;
};
User.getAnnoymousUser = function () {
	var user = User.createBy({_id:User.ANNOYMOUS_ID, name:User.ANNOYMOUS_ID, photo:'', email:''})
	user.created = undefined;
	return user;
}
User.getTester = function () {
	return User.createBy({_id:'testUser',name:'testUser',photo:'http://res.cloudinary.com/elfmagic86-herokuapp-com/image/upload/v1410263571/sample.jpg', email:''})
}
/* instance method */
User.prototype.getId = function () {
	return this._id;
}
User.prototype.isNotEqualById = function (userId) {
	return !this.isEqualById(userId);
}
//withId가 맞지않을까?
User.prototype.isEqualById = function (userId) {
	if (this.isExist() && (this._id == userId) ) return true;
	else return false;
}

//..이건 익명판별을 하게 만들었으니 없어져야해.
User.prototype.isExist = function () {
	if(this._id == null || this.name == null) return false;
	else return true;
}
User.prototype.isNotExist = function () {
	return !this.isExist();
}
User.prototype.isAnnoymous = function () {
	if(this._id == User.ANNOYMOUS_ID) 
		return true;
	else 
		return false;
};
