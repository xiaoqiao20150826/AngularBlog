/**
 *  WorkHistory의 텍스트를 테스트 데이터로 DB에 삽입
 *  
 *  TODO: 로컬은 잘되는데. mongolab에 직접 넣을 경우 길이가 길면..
 *        연결오류가 나버린다. 왜그런지 모르겠다.....
 */

var config = require('./config.js')
//var local_db = 'mongodb://localhost/nodeblog'
//  , remote_db = 'mongodb://'+config.mongolabId+':'+config.mongolabPw+'@ds035310.mongolab.com:35310/nodeblog'
var db = 'mongodb://asdf:asdf@ds039550.mongolab.com:39550/nodeblog'	
var mongoose = require('mongoose')

var _ = require('underscore')
  , H = require('./common/helper')
var blogBoardService = require('./service/blogBoard/blogBoardService')
var initDataCreater = require('./initDataCreater')
  , localFile = require('./common/file/localFile')
  , path = require('path')

var folderPath = __dirname+'/'+'Work-History/'
mongoose.connect(db, function(err, data) {
	if(err) return console.error(err)
	
	function fileNamesInFolder(done, folderPath) {
		var dataFn = done.getDataFn()
		
		return H.call4promise(localFile.fileNamesInFolder, folderPath)
		        .then(function (fileNames) {
		        	return dataFn(fileNames)
		        })
		        .catch(_catch)
	}
	
	function getPostByFile(done, filePath) {
		var dataFn = done.getDataFn()
		
		var Post = require('./domain/blogBoard/Post')
		  , Category = require('./domain/blogBoard/Category')
		  , userId = '6150493-github'
		return  H.all4promise([ [localFile.stat, filePath]
							  , [localFile.readKr, filePath]
				 ])
				 .then(function(args) {
					 var content = args[1].replace(/\r\n/g,'<br/>')
					 var rawData = { 'created' : args[0].ctime
							       , 'content' : content
					               , 'title' : path.basename(filePath)
					               , 'userId': userId
					               , 'categoryId' : Category.getRootId()
					               }
					 
					 var post = Post.createBy(rawData)
					 return dataFn(post)
				 })
				 .catch(_catch)
	}
	
	function _catch(err) {
		return console.error(err.stack)
	}
	
	// 실행 프로세스
	function run () {
		var lastDone = new H.Done(lastDataFn, _catch)
		//last
		
		return H.all4promise([ [initDataCreater.create]
		        			 , [fileNamesInFolder, folderPath]
				])
				.then(function (args) {
					var fileNames = args[1]
					var filePaths = _.map(fileNames, function (v) {
					 return folderPath + v;
					})
					return H.asyncLoop(filePaths, getPostByFile, lastDone)
				})
				.catch(_catch)
		
		function lastDataFn(posts) {
			 return H.asyncLoop(posts, blogBoardService.insertPostAndIncreaseCategoryCount, new H.Done(closeConnect, _catch), true)
		}
		function closeConnect(result) {
			mongoose.connection.close(function () {
				  //연결종료가아니라 프로세스종료를 해야지 lock이안생기는데..
			      console.log('Mongoose default connection disconnected through app termination');
			      process.exit(0);
			});			
		}
	}
	
	/////////////// 실행
	run()
})


