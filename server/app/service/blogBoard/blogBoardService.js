
/* 초기화 및 의존성, 클래스 변수 */
// 뭐가 이리많아?

var debug = require('debug')('nodeblog:service:blogBoardService')
var _ = require('underscore')
  , Q = require('q')

var H = require('../../common/helper.js')
  , Status = require('../../common/Status.js')
  , path = require('path')
  , fileDAO = require('../../common/file/fileDAO.js')
  , config = require('../../config.js');

var Post = require('../../domain/blogBoard/Post.js')
  , Answer = require('../../domain/blogBoard/Answer.js')
  , Category = require('../../domain/blogBoard/Category.js')
  , User = require('../../domain/User.js')
  , Joiner = require('../../dao/util/Joiner.js')

var Transaction = require('../../dao/util/transaction/Transaction.js')
var postDAO = require('../../dao/blogBoard/postDAO.js')
   ,answerDAO = require('../../dao/blogBoard/answerDAO.js')
   ,categoryDAO = require('../../dao/blogBoard/categoryDAO.js')
   ,userDAO = require('../../dao/userDAO.js')
   ,answerService = require('./answerService.js')
   ,categoryService = require('./categoryService.js')

var POST_COOKIE = 'postNums';



/* define  */
var blogBoardService = module.exports = {};

/* functions */
//TODO: 좀더 효율적으로 할수없을까? 카테고리... 캐쉬를만들면./. ?
//get  posts, pager
blogBoardService.getFullList = function (curPageNum, sorter, categoryId, searcher) {
	
	var result = {
					  pager : null
					, posts : null
				 }; //pager,
	// temp
	var categoryIds, categories;
	return categoryDAO.findAll()
	        .then(function(_categories) {
	        	categories 	= _categories
	        	categoryIds = categoryService.allIdsOf(categoryId, categories)
		    	
		    	debug('categoryIds : ',categoryIds);
		    	return postDAO.getPager( curPageNum, categoryIds, searcher)
	        })
		    .then(function (pager) {
		    	result.pager = pager;
		    	
		    	var rowNums = pager.getStartAndEndRowNumBy(curPageNum)
		    	return postDAO.findByRange( rowNums.start, rowNums.end, sorter, categoryIds, searcher);
		    })
		     .then(function (posts) {
			     var cloneCategories = H.deepClone(categories)
			     return blogBoardService.joinPartsToPosts( posts, cloneCategories);
	        })
		     .then(function (joinedPosts) {
			     result.posts =  joinedPosts;
			     return result;
		    })
};

//function _joinUsersAndCategoriesToPosts(posts, allCategories) {
blogBoardService.joinPartsToPosts = function _joinUsersAndCategoriesToPosts(posts, allCategories) {

	var userIds = Post.getUserIds(posts)
	
	//side-effect : 루트부터..자식을 향해서.  모든 title을 모음
//	                그래서 categories를 클론해서 전달받음.
	var isToChild = true
	categoryService.categoriesToTree(allCategories, 'title', ' > ', isToChild) 
	
	return userDAO.findByIds( userIds)
     .then(function (users) {
    	 var userJoiner = new Joiner(users, '_id', 'user')
    	   , categoryJoiner = new Joiner(allCategories, 'id', 'category')
    	 
    	 joinedPosts = userJoiner.joinTo(posts, 'userId', function() {return User.getAnnoymousUser()} );
    	 joinedPosts = categoryJoiner.joinTo(joinedPosts, 'categoryId');
    	 
    	 return joinedPosts
     })
}
// -----------------------------------  detail ------------------------------------

//postNum에 해당하는 post 데이터를 가져온다.
// user, answers를 조인.
blogBoardService.getJoinedPost = function (postNum) {
	
	return Q.all([ blogBoardService.getJoinedPostByUser( postNum)
	             , answerService.getRootOfAnswerTree( postNum) 
	            ])
				 .then(function (args) {
					 var joinedPost = args[0]
					   , joinedAnswers = args[1].answers
				//		 console.log(joinedAnswers)  
					 joinedPost.setAnswers(joinedAnswers);
				 	 debug('joinedPost :', joinedPost)
				 	 
				 	 return joinedPost
				 })
}
blogBoardService.getJoinedPostByUser = function (postNum) {
	
	var post = null;
	return postDAO.findByNum( postNum)
				 .then(function (_post) {
					 post = _post;
					 return userDAO.findById( _post.getUserId() );
			     })
				 .then(function (user) {
					if(_.isEmpty(user)) return console.error('not found user : ', post);
					post.setUser(user);
					return post
				})
}

blogBoardService.insertPostAndIncreaseCategoryCount = function(post) {
	
	var categoryId = post.categoryId;
	return Q.all([ 
	               postDAO.insertOne(post)
	             , categoryService.increasePostCountById( categoryId)
			     ])
			   	 .then(function (args) {
			   		var insertedPost = args[0];
			   		return insertedPost;
			   	 })
};
//단일
//TODO: 트랜잭션 롤백시...(이미지)파일은 어찌되돌리려고..?
blogBoardService.deletePost = function (postNum) {
	var transaction = new Transaction()   
	
	return transaction.atomic(function () {
			return   postDAO.findByNum( postNum)
							.then(function(post){
								var fileInfoes = post.fileInfoes
								  , categoryId = post.categoryId
								
								//상태변화(update,delete) 함수들은 모두 status반환.
								return Q.all([
						                        postDAO.removeByPostNum( postNum)
						                      , answerDAO.removeAllByPostNum( postNum)
						                      , categoryDAO.decreasePostCountById( categoryId)
						                      , fileDAO.deleteByFileInfoes( fileInfoes)
						                      ])
	
							})
							.then(function (statuses) {
								debug('delete post statuses', statuses)
								var status = Status.reduceOne(statuses)
								if(status.isError && status.isError()) transaction.rollback()
								
								return status;
							})
	})
}

//다중
//포스트들과 그 댓글들, 파일들 삭제 하고 관련된 카테고리 감소.
blogBoardService.deletePostsByUserId = function (userId) {
	var transaction = new Transaction()   
	return transaction.atomic(function () {
		
		return postDAO.findByUserId( userId)
				.then(function(posts){
					if(_.isEmpty(posts)) return [Status.makeSuccess('not exist to delete post')]
					
					var postNums = Post.getNums(posts)
					, fileInfoes = Post.getFileInfoes(posts)
					, categoryIdAndCountMap = Post.getCategoryIdAndCountMap(posts)
					
					return Q.all([
			                        postDAO.removeByUserId( userId)
			                      , answerDAO.removeByPostNums( postNums)
			                      , categoryDAO.decreasePostCountByIdAndCountMap( categoryIdAndCountMap)
			                      , fileDAO.deleteByFileInfoes( fileInfoes)
		                        ])
				})
				.then(function (statuses) {
					var status = Status.reduceOne(statuses)
					if(status.isError &&status.isError()) transaction.rollback
					
					return status;
				})
	})
}


blogBoardService.updatePostAndCategoryId = function (post, originCategoryId) {
	  
	return Q.all([ categoryService.increaseOrDecreasePostCount( post.categoryId, originCategoryId)
	             , postDAO.update(post)
	       ])
	       .then(function(statuses) {
	    	   var status = Status.reduceOne(statuses)
				return status
	       })
}


blogBoardService.increaseReadCount = function(postNum, cookie) {
	if(cookie.isContains(POST_COOKIE, postNum)) {
		return Q()
	} else {
		cookie.set(POST_COOKIE, postNum);
		return postDAO.updateReadCount(postNum);
	}
}

//TODO: increaseVote를 call4promsie로 호출중인데.아래 postDAO.updatevoteand... 에서 promise를 반환하지 않았다.
//      안될줄알았는데.. dataFn으로 반환하니 된다. 햇갈리네.
blogBoardService.increaseVote = function(postNum, userId) {

	var where = {num:postNum, votedUserIds:userId};
	return  postDAO.findOne( where)
			 .then(function(post) {
				 var failIncreaseVote = -1; //넌 이미 투표했다
				 debug('increaseVote voted post', post)
				 if(!(post.isEmpty())) return Status.makeError('already voted');
				 
				 return postDAO.updateVoteAndVotedUserId(postNum, userId)
			 })
}


blogBoardService.findGroupedPostsByDate = function () {
	return postDAO.findGroupedPostsByDate();
} 
