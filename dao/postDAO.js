/**
 * postDAO (싱글톤)

 * 
 * TODO: 싱글톤 클래스의 외부참조와 초기화를 위한 코드 공간이 더럽다.
 */


//////// 참조클래스
var debug = require('debug')('nodeblog:dao:postDAO')
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
postDAO.removeByPostNum = function (done, postNum) {
	var query = {num: postNum};
	_remove(done, query);
};
postDAO.removeOne = function (done, post) {
	var query = {num: post.num};
	_remove(done, query);
};
postDAO.removeAll = function (done) {
	var dataFn = done.getDataFn()
	var errFn = done.getErrFn()   
	
	return Q.all([H.call4promise([_seq,_seq.remove]), H.call4promise([_remove],{})])
			.then(dataFn)
			.catch(errFn);
};
function _remove(done, query) {
	_db.remove(query, done.getCallback());
}
/* find */
postDAO.find = function (done,where,select) {
	done.hook4dataFn(Post.createBy);
	var where = where || {}
		,select = select || {}
		,callback = done.getCallback();
	  _db.find(where,select).exec(callback);
};
postDAO.findByNum = function (done, num) {
	var where = {'num': num};
	postDAO.findOne(done, where)
};
postDAO.findOne = function (done, where, select) {
	done.hook4dataFn(Post.createBy);
	var where = where || {}
	   ,select = select || {}
	   ,callback = done.getCallback();
	_db.findOne(where,select).exec(callback);
};
postDAO.findByRange = function (done, start, end, sorter) {
	done.hook4dataFn(Post.createBy);
	var where = {}
		,select = {}
		,sorter = _getSorter(sorter)
		,callback = done.getCallback();
	var startNum = start - 1; // 배열스타일의 인덱스라 실제 개수와 일치시키기위해 -1 한다.
	var limitNum = end- startNum;
	if(startNum < 0) startNum = 0;
 	_db.find(where,select).sort(sorter).skip(startNum).limit(limitNum).exec(callback);
};
function _getSorter(sorterStr) {
	var sorters = {
					oldest : {num:1 }
				  , newest : {num:-1 }
				  , view : {readCount : -1 }
				  , vote : {vote: -1}	
				  , answer : {answerCount: -1}	
				  };
	var sorter = null;
	
	sorter = sorters[sorterStr];
	if(!sorter) sorter = sorters['newest'];
	return sorter;
}
/* insert */
postDAO.insertOne = function(done, post) {
	var dataFn = done.getDataFn()
	var errFn = done.getErrFn()
	
	return H.call4promise([_seq, _seq.getNext])
	 		.then(function __work1(data) {
				if(!(H.exist(data.seq))) throw new Error('fail to get next seq').stack;
				post.setNum(data.seq);
				return H.call4promise(_create, post);
	 		 })
	 		.then(dataFn)
	 		.catch(errFn);
};

function _create(done, data) {
	done.hook4dataFn(Post.createBy);
	_db.create(data, done.getCallback());
}
/* update */
//TODO: 업데이트할 데이터에 post를 통채로 주므로 업데이트 하지말아야할 데이터는 잘 걸러서 줘야한다. 
postDAO.update = function(done, post) {
	var where = {num : post.num}
		,data = post;
	if(!(H.exist(post.num))) throw new Error('num은 필수').stack;
	_update(done, where, data);
};
postDAO.updateReadCount = function(done, num) {
	var where = {num : num}
		,data = {$inc:{readCount:1}};
	_update(done, where, data);
};

postDAO.updateVoteAndVotedUserId = function(done, num, userId) {
	var where = {num : num}
	var data ={ $inc:{ vote:1}
			    , $addToSet: { votedUserIds : userId }
				};
	_update(done, where, data);
};

postDAO.increaseAnswerCount = function(done, num) {
	var where = {num : num}
	,data = {$inc:{answerCount:1}};
	_update(done, where, data);
};
postDAO.decreaseAnswerCount = function(done, num, answerCount) {
	var minusAnswerCount = _minusNumber(answerCount);
	var where = {num : num}
	,data = {$inc:{answerCount:minusAnswerCount}};
	_update(done, where, data);
};

function _minusNumber(number) {
	if(number > 0) return number * -1; 
}
// private
function _update(done, where, data, config) {
	if(!(H.exist(done))) throw new Error('done need').stack;
	//TODO: writeConcern 는 무엇을 위한 설정일까. //매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	var config = config || {upsert: false , multi:true}
		,callback = done.getCallback();
	_db.update(where, data, config).exec(callback);
}

/* etc..count */
//where는 검색 조건을 구할 경우 필요.
postDAO.getCount = function (done, where) {
	var where = where || {}
		,callback = done.getCallback();
	_db.find(where).count().exec(callback);
}

postDAO.findGroupedPostsByDate = function (done) {
	done.hook4dataFn(_reGroup);
	var project = {$project : { _id:0
							  , y:{$year:'$created'}
							  , m:{$month:'$created'}
							  , d:{$dayOfMonth:'$created'}
	                          , post:'$$ROOT' 
	                          } 
				  }
//	  , match = { $match : {'post.userId': userId}} //이건 봐서...빼던가 하던가.
	  , group = { $group : { _id:{ year:'$y', month: '$m', dayOfMonth :'$d' }
						   , count:{ $sum :1 }
						   , posts:{ $push : '$post'}
	  					   }
				 }
//	  , sort = { $sort : {'_id.year' : -1, '_id.month' : -1, '_id.dayOfMonth' : -1 }}
	  , callback = done.getCallback();
	_db.aggregate([project, group], callback);
//	_db.aggregate([project, match, group, sort], callback);
}
//TODO: 이게 최선인가.... 조금더.....이쁘게안되나... 보류.
// findGroupedPostsByDate에서 가져온 데이터를 다시 그룹화함.
// array는 sort할수있지만 map으로 사용하는 object는 sort안됨.
//  - 그래서 오름차순임. 1,2,3...
function _reGroup(model) {
	debug('groupedPostsByDate origin :', model)
	//reduce말고 each하되 공통 저장소사용해도 됨.
	var groupedPostsByDate = _.reduce(model, function(memo, o){
			var count = o.count
			  , date = o._id
			  , year = date.year
			  , month = date.month
			  , day = date.dayOfMonth
			  , posts = _.sortBy(Post.createBy(o.posts), function(post) {
				 return post.num * -1; 
			  });
			
			_sumCount(memo,'count', count);
			
			var yearCounts = _getObject(memo, year);
			_sumCount(yearCounts,'count', count);
			
			var monthCounts = _getObject(yearCounts, month);
			_sumCount(monthCounts, 'count', count);
			
			var dayCounts = _getObject(monthCounts, day);
			_sumCount(dayCounts, 'count', count);
			dayCounts['posts']= posts;
			
			function _sumCount(o, key, count) {
				var prevSum = _getValue(o, key);
				o[key] = prevSum + count;
			}
			function _getValue(o, key) {
				o[key] = o[key] || 0
				return o[key];
			}
			function _getObject(o, key) {
				o[key] = o[key] || {}
				return o[key];
			}
			return memo; 
		}, {});
	debug('reGroupedPostsByDate :', groupedPostsByDate)
	return groupedPostsByDate;
	}

/* helper */		
function getSchema() {
	return {
        'num' : Number,
        'created' : Date,
        'readCount' : Number,
        'answerCount' : Number,
        'vote' : Number,
        'votedUserIds' : Array,
        'filePaths' : String,
        'title' : String,
        'content' : String,
        'userId' : String  // 참조
		};
};
