/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */

var debug = require('debug')('nodeblog:service:blogBoardService')
var _ = require('underscore')
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
//get  posts, pager, categories
blogBoardService.getFullList = function (done, curPageNum, sorter, categoryId, searcher) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var result = {};
	var categoryIds;
	return H.call4promise(categoryDAO.findIdsOfIncludeChildIdAndAllCategories, categoryId)
	        .then(function(idsAndAllCategories) {
		    	var _categoryIds = idsAndAllCategories.categoryIds
		    	  , _allCategories = idsAndAllCategories.allCategories
		    	
		    	debug('categoryIds : ',_categoryIds);
		    	categoryIds = _categoryIds
		    	result.allCategories = _allCategories;
		    	
		    	return H.call4promise(postDAO.getPager, curPageNum, _categoryIds, searcher)
	        })
		    .then(function (pager) {
		    	var _categoryIds = categoryIds
		    	  
		    	result.pager = pager;
		    	
		    	var rowNums = pager.getStartAndEndRowNumBy(curPageNum)
		    	return H.call4promise(postDAO.findByRange, rowNums.start, rowNums.end, sorter, _categoryIds, searcher);
		    })
		     .then(function (posts) {
			     var _allCategories = H.deepClone(result.allCategories)
			     return H.call4promise(blogBoardService.getJoinedPostsByUsersAndCategories, posts, _allCategories);
	        })
		     .then(function (joinedPosts) {
			     result.posts = joinedPosts;
			     dataFn(result)
		    })
		     .catch(errFn);
};

// 카테고리는 다른곳(사이드)에서 사용하므로 따로 전달~!
blogBoardService.getJoinedPostsByUsersAndCategories = function (done, posts, allCategories) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()

	var userIds = Post.getUserIds(posts)
	
	//side-effect : 루트부터..자식을 향해서.  모든 title을 모음
	var isToChild = true
	categoryService.categoriesToTree(allCategories, 'title', ' > ', isToChild) 
	
	H.call4promise(userDAO.findByIds, userIds)
     .then(function (users) {
    	 var userJoiner = new Joiner(users, '_id', 'user')
    	   , categoryJoiner = new Joiner(allCategories, 'id', 'category')
    	 
    	 joinedPosts = userJoiner.joinTo(posts, 'userId', function() {return User.getAnnoymousUser()} );
    	 joinedPosts = categoryJoiner.joinTo(joinedPosts, 'categoryId');
    	 
    	 return dataFn(joinedPosts)
     })
     .catch(errFn)
}


//postNum에 해당하는 post 데이터를 가져온다.
// user, answers를 조인.
blogBoardService.getJoinedPost = function (done, postNum) {
	var dataFn = done.getDataFn()
	, errFn = done.getErrFn();
	
	H.all4promise([ [blogBoardService.getJoinedPostByUser, postNum]
	              , [answerService.getRootOfAnswerTree, postNum] 
    ])
	 .then(function (args) {
		 var joinedPost = args[0]
		   , joinedAnswers = args[1].answers
//		 console.log(joinedAnswers)  
		 joinedPost.setAnswers(joinedAnswers);
	 	 debug('joinedPost :', joinedPost)
	 	 
	 	 return dataFn(joinedPost);
	 })
	 .catch(errFn);
}
blogBoardService.getJoinedPostByUser = function (done, postNum) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	var _post = null;
	
	return H.call4promise(postDAO.findByNum, postNum)
	 .then(function (post) {
		 _post = post;
		 return H.call4promise(userDAO.findById, post.getUserId());
     })
	 .then(function (user) {
		if(_.isEmpty(_post)) return console.error('not found By '+postNum + new Error().stack);
		
		_post.setUser(user);
		dataFn(_post)
	})
	.catch(errFn)
}

blogBoardService.insertPostAndIncreaseCategoryCount = function(done, post) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var categoryId = post.categoryId;
	H.all4promise([ 
	                [postDAO.insertOne ,post]
	              , [categoryService.increasePostCountById, categoryId]
     ])
   	 .then(function (args) {
   		 var insertedPost = args[0];
   		 return dataFn(insertedPost);
   	 })
	 .catch(errFn);
};
//단일
blogBoardService.deletePost = function (done, postNum) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	
	var transaction = new Transaction()   
	transaction.atomic(function () {
		return H.call4promise(postDAO.findByNum, postNum)
				.then(function(post){
					var fileInfoes = post.fileInfoes
					, categoryId = post.categoryId
					
					//상태변화(update,delete) 함수들은 모두 status반환.
					return H.all4promise([
					                        [postDAO.removeByPostNum, postNum]
					                      , [answerDAO.removeAllByPostNum, postNum]
					                      , [categoryDAO.decreasePostCountById, categoryId]
					                      , [fileDAO.deleteByFileInfoes, fileInfoes]
					                      ])

				})
				.then(function (statuses) {
				    debug('s',statuses)
					return dataFn(Status.makeSuccess('remove all in post '+postNum))
				})
				.catch(function (err) {
					debug('delete err ',err)
					transaction.rollback() // err시 롤백
					return errFn(err)
				})
	})
}

//다중
//포스트들과 그 댓글들, 파일들 삭제 하고 관련된 카테고리 감소.
blogBoardService.deletePostsByUserId = function (done, userId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()

	var transaction = new Transaction()   
	transaction.atomic(function () {  
		return H.call4promise(postDAO.findByUserId, userId)
				.then(function(posts){
					if(_.isEmpty(posts)) return Status.makeSuccess('not exist to delete post')
					
					var postNums = Post.getNums(posts)
					, fileInfoes = Post.getFileInfoes(posts)
					, categoryIdAndCountMap = Post.getCategoryIdAndCountMap(posts)
					
					return H.all4promise([
					                        [postDAO.removeByUserId, userId]
					                      , [answerDAO.removeByPostNums, postNums]
					                      , [categoryDAO.decreasePostCountByIdAndCountMap, categoryIdAndCountMap]
					                      , [fileDAO.deleteByFileInfoes, fileInfoes]
					                      ])
				})
				.then(function (statuses) {
					debug('s',statuses)
					if(!_.isArray(statuses)) return dataFn(statuses)
				    
					return dataFn(Status.makeSuccess('remove post by '+userId) )
				})
				.catch(function (err) {
					debug('delete err ',err)
					transaction.rollback() // err시 롤백
					return errFn(err)
				})
	})
	
}


blogBoardService.updatePostAndCategoryId = function (done, post, originCategoryId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	  
	H.all4promise([ [categoryService.increaseOrDecreasePostCount, post.categoryId, originCategoryId]
	              , [postDAO.update, post]
	             ])
	             .then(dataFn)
	             .catch(errFn)
}

blogBoardService.increaseReadCount = function(done, postNum, cookie) {
	if(cookie.isContains(POST_COOKIE, postNum)) {
		done.return();
	} else {
		cookie.set(POST_COOKIE, postNum);
		postDAO.updateReadCount(done, postNum);
	}
}
//TODO: increaseVote를 call4promsie로 호출중인데.아래 postDAO.updatevoteand... 에서 promise를 반환하지 않았다.
//      안될줄알았는데.. dataFn으로 반환하니 된다. 햇갈리네.
blogBoardService.increaseVote = function(done, postNum, userId) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()

	var where = {num:postNum, votedUserIds:userId};
	return  H.call4promise(postDAO.findOne, where)
			 .then(function(post) {
				 var failIncreaseVote = -1; //넌 이미 투표했다
				 if(!(post.isEmpty())) return dataFn(Status.makeError('already voted'));
				 
				 return postDAO.updateVoteAndVotedUserId(done, postNum, userId)
			 })
			 .catch(errFn);
}


blogBoardService.findGroupedPostsByDate = function (done) {
	return postDAO.findGroupedPostsByDate(done);
} 
