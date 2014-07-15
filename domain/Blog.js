/**
 * 블로그 데이터를 위한 클래스.
 * 각 객체를 담거나, 필요 기능의 함수를 제공한다.
 * 
 */
var Post4Web = require('./Post4Web.js')
  , User = require('./User.js');

var Blog = module.exports = function Blog () {
	this._pager = null;
	this._loginUser = null;
	
	this._post4Webs = [];
	
}
//각 blog인스턴스를 합칠수있게..혹은 blog로 생성가능하도록.new Blog(oherblog)

// set
Blog.prototype.setPager= function (pager) {
	this._pager = pager;
};
Blog.prototype.setLoginUser = function (loginUser) {
	this._loginUser = loginUser;
};
/*
 * 흩어진 데이터를 post4Web클래스를 이용하여 모아준다. 사용하기 쉽게하려고.
 *  - posts : 기준이 되는 배열.
 *  - answerCounts : {_id:'', count:0} 형태의 원소를 가진 배열. userId 비교 대응해야함.
 *  - users :  userId를 비교하여 대응시켜야함. 익명일시 임시 데이터 할당.
 */
Blog.prototype.setPost4Webs = function (posts, users, answerCounts) {
	var result = [];
	
	for(var i in posts) {
		var post = posts[i]
		  , answerCount = _getMachedId4answerCounts(answerCounts, post.getNum())
		  , user = _getMachedId4User(users, post.getUserId());
		
		var post4Web = Post4Web.createBy(post, user, answerCount);
		result.push(post4Web);		
	}
	this._post4Webs = result;
	
	function _getMachedId4User(users, userId) {
		if(User.isAnnoymousId(userId)) 
			return user = User.getAnnoymousUser();
		else
			return user = __getMachedObject(users, userId, function (user) {
				user.getId();
			});
	}
	function _getMachedId4answerCounts(answerCounts, postNum) {
		var answerCount = __getMachedObject(answerCounts, postNum, function (answerCount) {
			return answerCount._id;
		});
		if(answerCount) return answerCount.count;
		else return 0;
	}
	
	function __getMachedObject(objs, value, eachValue) {
		for(var i in objs) {
			var obj = objs[i];
			if(eachValue(obj) == value) return obj;
		}
	}
}
Blog.prototype.setPost4Web = function (post, user, answers) {
	var result = [];
	answers = answers || [];
	var post4Web = Post4Web.createBy(post, user, answers.length, answers);
	result.push(post4Web);
	this._post4Webs = result;
}

// get
Blog.prototype.getPager = function () {
	return this._pager;
}
Blog.prototype.getLoginUser = function () {
	return this._loginUser;
}
Blog.prototype.getPost4Webs = function () {
	return this._post4Webs;	
}
