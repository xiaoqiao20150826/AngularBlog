//
var USER_DATA ;


/////////profile나 userData를 받아서 userData를 초기화해준다.
var User = module.exports = function(data) {
	this._userData = _adaptForUser(data);
	function _adaptForUser(data) { //기본은 페이스북
		var userData = {};
		if(!data) {throw "data가 필요하다";};
		if(data.id == null || data.id == undefined) {throw "id는 필수다";};	
		userData.oauthId = data.provider+ data.id;
		userData.name =  data.displayName || data.name;
		userData.photo = data.photo || data._json.avatar_url ||
						 data._json.picture || data._json.pictureUrl || oneOfMany(data.photos);
		userData.email = data.email || oneOfMany(data.emails);
		userData.created = Date.now();
		
		////////helper
		function oneOfMany(many) {
			if(many == undefined) {return null;}
			var one = null;
			one = many[0].value; //항상 이 형식일리 없다.
			return one; 
		};
		return userData;
	};
};
//-------------------------------------------


//------- static 함수
User.getSchema = function () {
	return {
		oauthId: String,
		name: String,
		photo: String,
		email: String,
		created: Date
	};
};

//-------- instance 함수
User.prototype.getUserData = function () {
	return this._userData;
};
User.prototype.getOauthId = function () {
	return {oauthId: this._userData.oauthId};
};

/////////////////db관련 
////어차피 콜백은 this를 못쓰니 prototype에 넣을필요없다.static 함수로.
//User.findCallBack = function dbCallBack(param, err, user) {
//	if(err) { User.catchDbException(); }//DB예외
//	
//	if (isUser(err,user))
//		param.done(null, user);
//	else 
//		createAndSaveUser(param);
//	
//	///////////		helper		//////////////////////////////////
//	function isUser(err, user) {
//		if(!err && user != null)
//			return true;
//		else
//			return false;
//	};
//	function createAndSaveUser(param) {
//		var user = new User(param.profile);
//		var bindedSaveCallBack = User.saveCallBack.bind(null, user, param.done);
//		user.save(bindedSaveCallBack);				
//	}
//};
//User.saveCallBack = function(user, done ,err) {
//	if(err) {User.catchDbException(err); };
//	console.debug("saving user ...");
//    done(null, user);
//};
//User.catchDbException = function (err) {
//	throw "db예외"+ err;
//};