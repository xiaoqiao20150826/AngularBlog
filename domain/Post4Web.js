/**
 *  web을 위해 post의 참조를 실제 데이터로 모은 post
 *  단순자료구조. 필드에 바로 접근가능.
 */

var Post4web = module.exports = function () {
	this.post = null;
	this.user = null;
	this.answers = null;
	this.answerCount = null;
}

Post4web.createBy = function (post, user, answerCount) {
	return Post4web.createBy(post,user,answerCount,null);
}
Post4web.createBy = function (post, user, answerCount, answers) {
	var post4web = new Post4web();
	post4web.post = post;
	post4web.user = user;
	post4web.answerCount = answerCount;
	post4web.answers = answers;
	return post4web;
}

//instance method
