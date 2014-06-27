/**
 * postDAO (싱글톤)
 * 
 * TODO: 싱글톤 클래스의 외부참조와 초기화를 위한 코드 공간이 더럽다.
 */


//////// 참조클래스
var Post = require('../domain/Post.js')
	,Sequence = require('./Sequence.js')
	,Q = require('q');
var mongoose = require('mongoose')
	,Schema = mongoose.Schema
	,postSchema = new Schema(getSchema());

///// 참조변수
var SEQ_ID = 'post';
var _ = require('underscore')
	,H = require('../common/helper.js')
	,_seq = new Sequence(SEQ_ID)
	,_db = mongoose.model('Post', postSchema);

//// init
_seq.create();
///////////////////////////////////////////////////////////////////////////

var postDAO = module.exports = {};

/* 
 * functions(싱글톤) 
 * 
 * */
/* remove */
postDAO.removeOne = function (post, cb) {
	var cb = cb || null;
	var query = {num: post.num};
	_db.remove(query,cb);
};
postDAO.removeAll = function (done) {
	Q.all([H.nfcall([_seq,_seq.remove]), H.nfcall([_db,_db.remove],{})])
	.then(done)
	.fail(function(err){if(err)throw err;});
};
/* find */
postDAO.find = function (done,where,select) {
	var where = where || {}
		,select = select || {}
		,callback = H.doneOrErr(done);
	  _db.find(where,select).exec(callback);
};
postDAO.findByNum = function (done, num) {
	var where = {'num': num}
		,select = select || {}
		,callback = H.doneOrErr(done);
	_db.findOne(where,select).exec(callback);
};
postDAO.findByRange = function (done, start,end) {
	var where = {}
		,select = {}
		,orderBy = { 'num' : 1 }
		,callback = H.doneOrErr(done);
	var startNum = start - 1; // 배열스타일의 인덱스라 실제 개수와 일치시키기위해 -1 한다.
	var limitNum = end- startNum;
	if(startNum < 0) startNum = 0;
	
	_db.find(where,select).sort(orderBy).skip(startNum).limit(limitNum).exec(callback);
};
/* insert */
postDAO.insertOne = function(done, post) {
	H.call4done([_seq, _seq.getNext])
	 .then(function __work1(data) {
			console.log('d',data);
			if(!(H.exist(data.seq))) throw 'fail to get next seq';
			post.setNum(data.seq);
			console.log('s22');
			return H.nfcall(_create, post);
		})
	 .then(function() {
		 console.log('s33322');
		 done();
	 })
	 .catch(H.defaultErr);
	
	
};
function _create(callback, data) {
	_db.create(data,callback)// exec없음.
}
/* update */
//TODO: 업데이트할 데이터에 post를 통채로 주므로 업데이트 하지말아야할 데이터는 잘 걸러서 줘야한다. 
postDAO.update = function(done, post) {
	var where = {num : post.num}
		,data = post;
	if(!(H.exist(post.num))) throw 'num은 필수';
	_update(done, where, data);
};
postDAO.updateReadCount = function(done, num) {
	var where = {num : num}
		,data = {$inc:{readCount:1}};
	_update(done, where, data);
};
// private
function _update(done, where, data, config) {
	if(!(H.exist(done))) throw 'done need';
	//TODO: writeConcern 는 무엇을 위한 설정일까. //매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	var config = config || {upsert: false , multi:true}
		,callback = H.doneOrErr(done);
	_db.update(where, data, config).exec(callback);
}

/* etc..count */
//where는 검색 조건을 구할 경우 필요.
postDAO.getCount = function (done, where) {
	var where = where || {}
		,callback = H.doneOrErr(done);
	_db.find(where).count().exec(callback);
}



/* helper */		
function getSchema() {
	return {
        'num' : Number,
        'created' : Date,
        'readCount' : Number,
        'vote' : Number,
        'images' : String,
        'title' : String,
        'content' : String,
        'userID' : String  // 참조
		};
};

//postDAO.insert = function(posts, cb) {
//	var cb = cb || null;
//	if(!(posts instanceof Array)) {posts = [posts]; };
//	
//	for(var i in posts) {
//		var post = posts[i];
//		_seq.getNum(H.doneOrNext(done, next));
//		function done(data) {
//			post.setNum(data.seq);
//		}
//		function next() {
//			console.log('create :'+post.num);
//			_db.create(post, cb);
//		}
//	}
//};