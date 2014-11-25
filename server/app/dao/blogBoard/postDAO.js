/**
 * postDAO (싱글톤)

 * 
 * TODO: 싱글톤 클래스의 외부참조와 초기화를 위한 코드 공간이 더럽다.
 */


//////// 참조클래스
var debug = require('debug')('nodeblog:dao:postDAO')

var Post = require('../../domain/blogBoard/Post.js')
  , Status = require('../../common/Status.js')
  , Sequence = require('../Sequence.js')
  , Q = require('q');
var Pager = require('../../common/Pager.js');

var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , ObjectId4Schema = Schema.ObjectId
  , ObjectId = mongoose.Types.ObjectId
  , postSchema = new Schema(getSchema());

///// 참조변수
var _ = require('underscore')
  , H = require('../../common/helper.js')
  , _db = mongoose.model('Post', postSchema)
	
///////////////////////////////////////////////////////////////////////////

var postDAO = module.exports = {}

/* 
 * functions(싱글톤) 
 * 
 * */
/* remove */
postDAO.removeByPostNum = function (postNum) {
	var query = {num: postNum};
	return _remove(query);
};
postDAO.removeByUserId = function (userId) {
	var where = {'userId': userId}
	return _remove(where);
};
postDAO.removeOne = function (post) {
	var query = {num: post.num};
	return _remove(query);
};
postDAO.removeAll = function () {
    var _seq = Sequence.getForPost()
    
    return Q.all([_seq.remove, _remove({}) ])
};
function _remove(where) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	var where = where || {}
	
	_db.remove(where, callback);
	
	return deferred.promise
				   .then(function(result){return Status.makeForRemove(result);})
}
/* find */
postDAO.find = function (where,select) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = where || {}
		,select = select || {}
		
	_db.find(where,select).exec(callback);
	  
	return deferred.promise
				   .then(Post.createBy)
};
postDAO.findByNum = function (num) {
	var where = {'num': num};
	return postDAO.findOne(where)
};
postDAO.findByUserId = function (userId) {
	var where = {'userId': userId};
	return postDAO.find(where)
};
postDAO.findOne = function (where, select) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var where = where || {}
	   ,select = select || {}
	   
	_db.findOne(where,select).exec(callback);
	
	return deferred.promise
	   		.then(Post.createBy)
};

postDAO.findByRange = function (start, end, sorter, categoryIds, searcher) {
	
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	var where = where || {} 
		,select = {}
		,sorter = _getSorter(sorter);

	
	if(!_.isEmpty(categoryIds) ) where.categoryId = {$in : categoryIds }
	if(!_.isEmpty(searcher) ) where = _getWhereBySearcher(where, searcher)  
	
	var startNum = start - 1; // 배열스타일의 인덱스라 실제 개수와 일치시키기위해 -1 한다.
	var limitNum = end- startNum;
	if(startNum < 0) startNum = 0;
 	_db.find(where,select).sort(sorter).skip(startNum).limit(limitNum).exec(callback);
 	
 	return deferred.promise
	   			   .then(Post.createBy)
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
//현재는 title만 정규식으로..
function _getWhereBySearcher (originWhere, searcher) {
	var where = originWhere || {}
	where.title = new RegExp(searcher)
	return where
}

/* insert */
postDAO.insertOne = function(post) {
	var _seq = Sequence.getForPost()
	
	return _seq.getNext()
	 		   .then(function __work1(seqNum) {
					if(!(H.exist(seqNum))) return console.error('fail to get next seq');
					post.setNum(seqNum);
					return _create(post)
		 		 });
};

function _create(data) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	if(!data._id) data._id = new ObjectId()
	_db.create(data, callback);
	
	return deferred.promise
	   			   .then(Post.createBy)
}
/* update */
//TODO: 업데이트할 데이터에 post를 통채로 주므로 업데이트 하지말아야할 데이터는 잘 걸러서 줘야한다. 
postDAO.update = function(post) {
	var where = {num : post.num}
		,data = { $set : { title : post.title
		        		 , content : post.content
		        		 , categoryId : post.categoryId
		        		  }
				, $addToSet : { fileInfoes : {$each:  post.fileInfoes}  } 
				}
	if(!(H.exist(post.num))) return console.error('num은 필수');
	
	return _update(where, data);
};

postDAO.updateReadCount = function(num) {
	var where = {num : num}
		,data = {$inc:{readCount:1}};
	return _update(where, data);
};

postDAO.updateVoteAndVotedUserId = function(num, userId) {
	var where = {num : num}
	var data ={ $inc:{ vote:1}
			    , $addToSet: { votedUserIds : userId }
				};
	return _update(where, data);
};

postDAO.removeCategorId = function(categoryId) {
	var where = {categoryId : categoryId}
	  , data = {$set:{categoryId:null}}
	
	return _update(where, data);
};
postDAO.increaseAnswerCount = function(num) {
	var where = {num : Number(num)}
	  , data = {$inc:{answerCount:1}};
	
	return _update(where, data);
};

postDAO.decreaseAnswerCount = function(num, answerCount) {
	var answerCount = answerCount || 1
	  , minusAnswerCount = _minusNumber(answerCount);
	var where = {num : num}
	  , data = {$inc:{answerCount:minusAnswerCount}};
	
	return _update(where, data);
};

function _minusNumber(number) {
	if(number > 0) return number * -1; 
}
// private
function _update(where, data, config) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	//TODO: writeConcern 는 무엇을 위한 설정일까. //매치되는 doc없으면 새로 생성안해.//매치되는 doc 모두 업데이트
	var config = config || {upsert: false , multi:true}
	
	_db.update(where, data, config, callback);
	
	return deferred.promise
	      		   .then(function (result) {
	      				return Status.makeForUpdate(result);
	      			})
}

/* etc..count */
//where는 검색 조건을 구할 경우 필요.
postDAO.getPager = function (curPageNum, categoryIds, searcher) {
	
	return postDAO.getCount(categoryIds, searcher)
	        .then(function (allRowCount) {
		    	return new Pager(allRowCount)
	        })
}

postDAO.getCount = function (categoryIds, searcher) {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	var where = {}
		
	if(!_.isEmpty(categoryIds)) where.categoryId = {$in : categoryIds}
	if(!_.isEmpty(searcher) ) where = _getWhereBySearcher(where, searcher)  
	
	_db.find(where).count().exec(callback);
	
	return deferred.promise
}


postDAO.findGroupedPostsByDate = function () {
	var deferred  = Q.defer()
      , callback  = H.cb4mongo1(deferred);
	
	var project = {'$project' : { _id:0   //필드포함 안시키는..
							  , y:{'$year':'$created'}
							  , m:{'$month':'$created'}
							  , d:{'$dayOfMonth':'$created'}
	                          , post:{num:'$num',title:'$title'} 
	                          } 
				  }
//	  , match = { $match : {'post.userId': userId}} //이건 봐서...빼던가 하던가.
	  , group = { $group : { _id:{ year:'$y', month: '$m', dayOfMonth :'$d' }
						   , count:{ '$sum' :1 }
						   , posts:{ '$push' : '$post'}
	  					   }
				 }
//	  , sort = { $sort : {'_id.year' : -1, '_id.month' : -1, '_id.dayOfMonth' : -1 }}
	
	_db.aggregate([project, group], callback);
//	_db.aggregate([project, match, group, sort], callback);
	
	return deferred.promise
	   			   .then(_reGroup)
}
//TODO: 이게 최선인가.... 조금더.....이쁘게안되나... 보류.
// findGroupedPostsByDate에서 가져온 데이터를 다시 그룹화함.
// array는 sort할수있지만 map으로 사용하는 object는 sort안됨.
//  - 그래서 오름차순임. 1,2,3...
function _reGroup(model) {
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
		'_id': {type:ObjectId4Schema}, // default로 값을 할당하면 create 후 id가 반환되지않는다.
        'num' : Number,
        'created' : Date,
        'readCount' : Number,
        'answerCount' : Number,
        'vote' : Number,
        'votedUserIds' : Array,
        'fileInfoes' : Array,
        'title' : String,
        'content' : String,
        'userId' : String,  // 참조
        'categoryId' : String  // 참조
		};
};
