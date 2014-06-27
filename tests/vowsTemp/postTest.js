/**
 * vows board crud 테스트
 */
var mongoose = require('mongoose');
var vows = require('vows'),
	assert = require('assert');

var _ = require('underscore');
var helper = require('../common/helper.js')
var Post = require('../domain/Post.js'),
	postDAO = require('../dao/postDAO.js');

mongoose.connect('mongodb://localhost/nodeblog');
vows.describe('postDAO를 테스트하여 post에 대해서 mongoDb crud를 검증한다').addBatch({
	'posts' : {
		topic: function() {
			var rawDatas = []
				,posts = _createPosts(rawDatas);
			this.rawDatas = rawDatas;
			postDAO.insert(posts,this.callback);
		},
		'insert' : function(err, data) {
			if(err) throw err;
			var posts = data;
			_equals(posts,this.rawDatas);
		}
//		,'삭제한다' : function () {
//		},
//		'찾는다' :  function () {
//			var args = _.toArray(arguments); 
//		helper.doneOrNext(null,next).apply(args);
//		function next() {
//			postDAO.find(posts,helper.doneOrNext(done));
//			function done(data) {
//				var postsOfDB = data;
//				console.log(data);
//				_equals(posts,rawDatas);
////				postDAO.remove(posts);
//			};
//		};
//		},
//		'업데이트(upset) 한다' : function () {
//			
//		}
	}
}).run();
//////==== helper =====/////////
//userId, title, content만 확인.
function _equals(posts, rawDatas) {
	var equal = __equal3('title','content','userId');
	for(var i in rawDatas) {
		var rawData = rawDatas[i]
			,post = posts[i];
		equal(post,rawData);
	}
	function __equal3(args) {
		return function(e, a) {
			for(i in args) {
				var key = args[i];
				assert.equal(e[key],a[key]);
			}	
		};
	} ;
};
function _createPosts(rawData) {
	var posts = _.map(_.range(3),function(v, i, l){
		var raw = {title:'title'+i,content:'content'+i};
		rawData.push(raw);
		return Post.createBy(raw);
	});
	return posts;
}
