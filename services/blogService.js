/**
 * 
 */

/* 초기화 및 의존성, 클래스 변수 */

var debug = require('debug')('nodeblog:service:blogService')
var _ = require('underscore')
var H = require('../common/helper.js')
  , path = require('path')
  , localFile = require('../common/localFile.js')
  , config = require('../config.js');

var Post = require('../domain/Post.js')
  , User = require('../domain/User.js')
  , Answer = require('../domain/Answer.js')
  , Category = require('../domain/Category.js')
  , Status = require('../domain/Status.js')
  , Joiner = require('../domain/Joiner.js')

var postDAO = require('../dao/postDAO.js')
  , userDAO = require('../dao/userDAO.js')
   ,answerDAO = require('../dao/answerDAO.js')
   ,categoryDAO = require('../dao/categoryDAO.js')
   ,answerService = require('./answerService.js')
   ,categoryService = require('./categoryService.js')

/* define  */
var blogService = module.exports = {};

/* functions */
var POST_COOKIE = 'postNums';
blogService.getPostsAndPagerAndAllCategoires = function (done, curPageNum, sorter, categoryId) {
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
		    	
		    	return H.call4promise(postDAO.getPager, curPageNum, _categoryIds)
	        })
		    .then(function (pager) {
		    	var _categoryIds = categoryIds
		    	  
		    	result.pager = pager;
		    	
		    	var rowNums = pager.getStartAndEndRowNumBy(curPageNum)
		    	return H.call4promise(postDAO.findByRange, rowNums.start, rowNums.end, sorter, _categoryIds);
		    })
		     .then(function (posts) {
			     var _allCategories = H.deepClone(result.allCategories)
			     return H.call4promise(blogService.getJoinedPostsByUsersAndCategories, posts, _allCategories);
	        })
		     .then(function (joinedPosts) {
			     result.posts = joinedPosts;
			     dataFn(result)
		    })
		     .catch(errFn);
};

// 카테고리는 다른곳(사이드)에서 사용하므로 따로 전달~!
blogService.getJoinedPostsByUsersAndCategories = function (done, posts, allCategories) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()

	var userIds = Post.getUserIds(posts)
	
	//side-effect : 모든 자식의 title을 부모로 모으기 위함.
	var isToChild = true
	categoryService.categoriesToTree(allCategories, 'title', ' > ', isToChild) 
	
	H.call4promise(userDAO.findByIds, userIds)
     .then(function (users) {
    	 var userJoiner = new Joiner(users, '_id', 'user')
    	   , categoryJoiner = new Joiner(allCategories, 'id', 'category')
    	 
    	 
    	 joinedPosts = userJoiner.joinTo(posts, 'userId', User.getAnnoymousUser());
    	 joinedPosts = categoryJoiner.joinTo(joinedPosts, 'categoryId');
    	 
    	 return dataFn(joinedPosts)
     })
     .catch(errFn)
}


//postNum에 해당하는 post 데이터를 가져온다.
// user, answers를 조인.
blogService.getJoinedPost = function (done, postNum) {
	var dataFn = done.getDataFn()
	, errFn = done.getErrFn();
	
	H.all4promise([ [blogService.getJoinedPostByUser, postNum]
	              , [answerService.getJoinedAnswers, postNum] 
    ])
	 .then(function (args) {
		 var joinedPost = args[0]
		   , joinedAnswers = args[1]
		 
		 joinedPost.setAnswers(joinedAnswers);
	 	 debug('joinedPost :', joinedPost)
	 	 
	 	 return dataFn(joinedPost);
	 })
	 .catch(errFn);
}
blogService.getJoinedPostByUser = function (done, postNum) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn()
	var _post = null;
	
	return H.call4promise(postDAO.findByNum, postNum)
	 .then(function (post) {
		 _post = post;
		 return H.call4promise([userDAO.findById], post.getUserId());
     })
	 .then(function (user) {
		if(_.isEmpty(_post)) return console.error('not found By '+postNum + new Error().stack);
		
		_post.setUser(user);
		dataFn(_post)
	})
	.catch(errFn)
}

blogService.insertPostWithFile = function(done, post, file) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	var categoryId = post.categoryId;
	
	H.all4promise([ 
	                [postDAO.insertOne ,post]
	              , [categoryService.increasePostCountById, categoryId]
     ])
   	 .then(function (args) {
   		 var insertedPost = args[0];
   		
   	     //post insert 후 비동기로 작업 후 곧바로 다음 할일을 수행 
   		 blogService.saveFileAndUpdatePost(file, insertedPost)
   		 return dataFn(insertedPost);
   	 })
	 .catch(errFn);
};


// 비동기 작업하며로 실패는 무시, 성공도 무시. 신경 쓰지 않음.
// 나중에 파일업로드방식을 바꾸자.
blogService.saveFileAndUpdatePost = function (file, post) {
	if(!localFile.existFile(file)) return ;
	//file저장 및 업데이트.
	var imgDir =config.imgDir + '\\' + post.userId
	  , urls = localFile.getToAndFromFileUrl(file, imgDir);
		
	H.call4promise(localFile.copyNoDuplicate, urls.from , urls.to)
	 .then(function(savedFileUrl) {
		debug('saved file url : ', savedFileUrl) 
		 if(_.isEmpty(savedFileUrl)) return;
		
		 return H.call4promise(postDAO.updateFilePaths ,post.num ,savedFileUrl)
	 })
	 .catch(function(){});
}	

blogService.deletePostOrFile = function (done, postNum, filepath) {
	var dataFn = done.getDataFn()
	  , errFn = done.getErrFn();
	
	H.all4promise(postDAO.removeByPostNum, postNum)
	 .then(function(status) {
		 if(status.isSuccess()) return dataFn(status)
		 else return errFn(status.appendMessage('remove faile :', postNum))
	 })
	 
	 //비동기로 호출
	localFile.deleteFileAndDeleteFolderIfNotExistFile(Done.makeEmpty(), filePath);
	
	return;
}

blogService.increaseReadCount = function(done, postNum, cookie) {
	if(cookie.isContains(POST_COOKIE, postNum)) {
		done.return();
	} else {
		cookie.set(POST_COOKIE, postNum);
		postDAO.updateReadCount(done, postNum);
	}
}
blogService.increaseVote = function(done, postNum, userId) {
	var errFn = done.getErrFn();
	var where = {num:postNum, votedUserIds:userId};
	H.call4promise(postDAO.findOne, where)
	 .then(function(post) {
		 var failIncreaseVote = -1; //넌 이미 투표했다
		 if(!(post.isEmpty())) return done.return(Status.makeError('already voted'));
		 
		 postDAO.updateVoteAndVotedUserId(done, postNum, userId)
	 })
	 .catch(errFn);
}
blogService.findGroupedPostsByDate = function (done) {
	postDAO.findGroupedPostsByDate(done);
} 
