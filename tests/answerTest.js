/**
 * 
 */
var answerTest = module.exports = {};
answerTest.run = function () {
	/* 외부에서 사용되는 것. */
	answerTest.insertTestData = _insertTestData;
	/* test */
	var mongoose = require('mongoose');
	var should = require('should');
	var Q = require('q');
	var async = require('async');
	
	var _ = require('underscore'),
		H = require('../common/helper.js');
	var	answerDAO = require('../dao/answerDAO.js');
	var	Answer= require('../domain/Answer.js');
	var	postDAO = require('../dao/postDAO.js');
	var	Post= require('../domain/Post.js');
	
	var _postNum = 2;
	describe('aAnswerDAO', function() {
		var _answers,_answer;
		before(function(asyncDone) {
			mongoose.connect('mongodb://localhost/test',function() {
				_insertTestData(function () { asyncDone();});
			});
		});
		after(function(asyncDone) {
			answerDAO.removeAll(function(){
				postDAO.removeAll(function() {
					mongoose.disconnect(function() {
						asyncDone();					
					});
				});
			});
		});
		beforeEach(function() {
			_answers = _createAnswers(_postNum); //testcase마다 같은 테스트데이터
		});
		describe('#insertOne()', function() {
			it('should insert a answer.',function () {
				answerDAO.insertOne(done, _answers[3]);
				function done(data) {
					var expectedanswer = data;
					_equals(expectedanswer,_answers[3]);
					asyncDone();
				};
			});
		});
		describe('#find()',function() {
			it('should take all answers', function (asyncDone) {
				answerDAO.find(done, {});
				function done(models) {
					var e_answers =  _answerList(models);
					_equals(e_answers,_answers.slice(0, e_answers.length));
					asyncDone();
				}
			});
			it('should take a answer', function (asyncDone) {
				var num = 2;
				answerDAO.findByNum(done, num);
				function done(model) {
					var e_answer = Answer.createByModel(model);
					var a_answer = _answers[num-1];
					_equals(a_answer, e_answer);
					asyncDone();
				}
			});
			it('should take answers by range', function (asyncDone) {
				var start = 4
					,end = 6;
				
				answerDAO.findByRange(done,_postNum, start,end);
				function done(models) {
					var e_answers = _answerList(models);
					var a_answers = _answers.slice(start-1,end);
					_equals(a_answers,e_answers);
					asyncDone();
				}
			});
		});
		describe('#count', function() {
			it('should take count of all answers', function(asyncDone) {
				answerDAO.getCount(done);
				function done(model) {
					var a_count = _answers.length +1;
					var e_count = model;
					should.exist(model);
					should.equal(a_count,e_count);
					asyncDone();
				}
			});
			it('should take count with where', function(asyncDone) {
				var where = {title:/title/};
				answerDAO.getCount(done);
				function done(model) {
					var a_count = _answers.length +1;
					var e_count = model;
					should.exist(model);
					should.equal(a_count,e_count);
					asyncDone();
				}
			});
		});
		describe('#update', function() {
			it('should update',function(asyncDone) {
				var num = 3 , success = 1
				 	,a_answer = _answers[num-1];
				a_answer.num = num;
				a_answer.content = 'content_update';
				
				answerDAO.update(done, a_answer);
				function done(bool) {
					should.equal(bool, success);
					answerDAO.findByNum(done2, num);
					function done2(model) {
						var e_answer = Answer.createByModel(model);
						_equals(a_answer, e_answer);
						asyncDone();
					}
				}
			});
			it('should increase vote', function(asyncDone) {
				var num = 2, success = 1
					,testArray = [num, num, num, num]
					,a_count=testArray.length;
				H.asyncLoop(testArray,answerDAO.incVote, done);
				function done() {
					answerDAO.findByNum(done2, num);
					function done2(model) {
						var e_answer = Answer.createByModel(model);
						should.equal(a_count, e_answer.vote);
						asyncDone();
					}
				}
			});
		});
		describe('#getCountsByPosts',function() {
			it('should take counts Of answers By posts', function(asyncDone) {
				var posts = [{num:5},{num:7}];
				var answers = _createAnswers(posts[0].num);
				answers = answers.concat(_createAnswers(posts[1].num));
				_insertTestData(work1,posts[1].num,answers);
				
				function work1() {
					answerDAO.getCountsByPosts(done, posts);
					function done(result) {
						var r1 = result.shift();
						var r2 = result.shift();
						should.equal(answers.length, (r1.count + r2.count)	);
						asyncDone();
					}
				}
			});
		});
	});
	////////==== helper =====/////////
	//현재는 content만 비교함.
	function _equals(expected, actuals) {
		should.exist(expected);
		should.exist(actuals); //없는것을 비교하려하는지..확인.
		var equalOne = __equalOne1('content');
		if(!(expected instanceof Array) && !(actuals instanceof Array)) {
			return equalOne(expected,actuals);
		} else {
	//		should.equal(expected.length,actuals.length); // 이렇게하려면 길이도 맞춰야하고...불편해,,, 견고하지는 못하다.
			if(expected.length < 1 || actuals.length < 1 ) throw '빈 배열을 비교하려고 한다.';
			for(var i in actuals) {
				equalOne(expected[i],actuals[i]);
			}
		}
		
		function __equalOne1() {
			var args = _.toArray(arguments);
			return function(e, a) {
				for(i in args) {
					var key = args[i];
					should.equal(e[key],a[key]);
				}	
			};
		};
	};
	// 1~10
	function _createAnswers(postNum) {
		var answers = _.map(_.range(1,11),function(v, i, l){ 
			var raw = {content:'content'+ i, postNum: postNum };
			return Answer.createByRaw(raw);
		});
		return answers;
	}
	function _insertTestData(done, postNum, answers) {
		var postNum = postNum || _postNum;
		var answers = answers || _createAnswers(postNum); 
		var post = Post.createByRaw({num:postNum,title:'title', content:'content'});
		postDAO.insertOne(work, post);
		function work() {
			H.asyncLoop(answers, answerDAO.insertOne, done);
		}
	};
	function _answerList(models) {
		return _.map(models, function(model){
			return Answer.createByModel(model);
		});
	};
	//TODO: model의 복수형이 뭐지. models로 사용하고있음.
};