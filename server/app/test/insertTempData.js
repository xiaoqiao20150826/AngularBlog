/**
 *  WorkHistory의 텍스트를 테스트 데이터로 DB에 삽입
 *  
 *  TODO: 로컬은 잘되는데. mongolab에 직접 넣을 경우 길이가 길면..
 *        연결오류가 나버린다. 왜그런지 모르겠다.....
 */

var config = require('../config.js')
var local_db = 'mongodb://localhost/test'
  , remote_db = 'mongodb://'+config.mongolabId+':'+config.mongolabPw+'@ds035310.mongolab.com:35310/nodeblog'
var db = local_db

var mongoose = require('mongoose')

var Q = require('q')
var _ = require('underscore')
  , H = require('./testHelper')
var blogBoardService = require('../service/blogBoard/blogBoardService')
var initDataCreater = require('../initDataCreater')
  , localFile = require('../common/file/localFile')
  , path = require('path')

var folderPath = path.join(__dirname,'../../../Work-History/')

mongoose.connect(db, function(err, data) {
	if(err) return console.error(err)
	
	
	/////////////// 실행
	run();
	
	
	//////////////
	function run () {
		
		return Q.all([  initDataCreater.create()
		        	  , fileNamesInFolder(folderPath)
				])
				.then(function (args) {
					var fileNames = args[1]
					var filePaths = _.map(fileNames, function (v) {
											return folderPath + v;
									})
					
					var posts = []
					 
					return _.reduce(filePaths, function(p, filePath) {
						return p.then(function (post) {
									if(post) {posts.push(post)}
									
									return getPostByFile(filePath)
									})
					},Q())
				    .then(function() {
					     var count = 0;
							return _.reduce(posts, function(p, post) {
								return p.then(function () {
											return blogBoardService.insertPostAndIncreaseCategoryCount(post)
										})
										.then(function(insertedPost) {
											console.log('['+( ++count ) +'] : ' , insertedPost.title)
										})
							},Q())	
				    })
				})
				.then(closeConnect)
				.catch(H.testCatch())
	}
	/////////////
	function fileNamesInFolder(folderPath) {
		
		return localFile.fileNamesInFolder( folderPath)
		        .then(function (fileNames) {
		        	return fileNames
		        })
		        .catch(H.testCatch())
	}
	
	function getPostByFile(filePath) {
		var Post = require('../domain/blogBoard/Post')
		  , Category = require('../domain/blogBoard/Category')
		  , userId = '6150493-github'
			  
		return  Q.all([ localFile.stat( filePath)
					  , localFile.readKr( filePath)
				 ])
				 .then(function(args) {
					 var content = args[1].replace(/\r\n/g,'<br/>')
					 var rawData = { 'created' : args[0].ctime
							       , 'content' : content
					               , 'title' : path.basename(filePath)
					               , 'userId': userId
					               , 'categoryId' : Category.getRootId()
					               }
					
					 return Post.createBy(rawData)
				 })
				 .catch(H.testCatch())
	}
		
	function closeConnect() {
		
		mongoose.connection.close(function () {
			  //연결종료가아니라 프로세스종료를 해야지 lock이안생기는데..
		      console.log('Mongoose default connection disconnected through app termination');
		      process.exit(0);
		});			
	}
//
})


