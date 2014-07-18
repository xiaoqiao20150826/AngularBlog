/**
 * 
 */

/* 참조 및 초기화 */
var H = require('../common/helper.js')
  , _ = require('underscore')

var User = require('./User.js')
  , Post4web = require('./Post4web.js');
//////////////////
var Board = module.exports = function Board() {
	this.pager = null;
	//
	this.posts4web = null;
};
/* static method */


/* instance method */
//get
Board.prototype.getpager = function () {
	return this.pager;
}
Board.prototype.getPosts4web = function () {
	return this.posts4web;
};
//set
Board.prototype.setPager= function (pager) {
	this.pager = pager;
};

/*
 * 흩어진 데이터를 board클래스를 이용하여 모아준다. 사용하기 쉽게하려고.
 *  - posts : 기준이 되는 배열.
 *  - answerCounts : {_id:'', count:0} 형태의 원소를 가진 배열. userId 비교 대응해야함.
 *  - users :  userId를 비교하여 대응시켜야함. 익명일시 임시 데이터 할당.
 */
Board.prototype.setPosts4web = function (posts, users, answerCounts) {
	var result = [];
	for(var i in posts) {
		var post = posts[i]
		  , answerCount = _getCountOfMachedId(answerCounts, post.getNum())
		  , user = _getUserOfMachedId(users, post.getUserId());
		var post4web = Post4web.createBy(post, user, answerCount)
		result.push(post4web);		
	}
	this.posts4web = result;
	//
}

//helper
function _getUserOfMachedId(users, userId) {
	if(User.isAnnoymousId(userId)) 
		return user = User.getAnnoymousUser();
	else
		return user = __getObjOfMachedValue(users, userId, function (user) {
			return user.getId();
		});
}
function _getCountOfMachedId(answerCounts, postNum) {
	var answerCount = __getObjOfMachedValue(answerCounts, postNum, function (answerCount) {
		return answerCount._id;
	});
	if(answerCount) return answerCount.count;
	else return 0;
}

function __getObjOfMachedValue(objs, value, eachValue) {
	for(var i in objs) {
		var obj = objs[i];
		if(eachValue(obj) == value) return obj;
	}
}