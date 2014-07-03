/**
 * 
 */
/* test */
var mongoose = require('mongoose');
var should = require('should');
var Q = require('q');
var async = require('async');

var _ = require('underscore'),
	H = require('../testHelper.js')
var	answerDAO = require('../../dao/answerDAO.js');
var	Answer= require('../../domain/Answer.js');
var	postDAO = require('../../dao/postDAO.js');
var	Post= require('../../domain/Post.js');



//test데이터를 삽입하고, eqaul비교 때 사용할 post의 프로퍼티 이름..
var keys4tempValue = ['content'];
var _postNum = 2;

describe('aAnswerDAO', function() {
	var _answers,_answer;
	before(function(nextCase) {
		mongoose.connect('mongodb://localhost/test',function() {
			_insertTestData(nextCase);
		});
	});
	after(function(nextCase) {
		var errFn = H.testCatch1(nextCase);
		Q.all([postDAO.removeAll(H.doneOrErrFn(function() {}, errFn))
			 , answerDAO.removeAll(H.doneOrErrFn(function() {}, errFn))
			 ])
		.then(function() {
			mongoose.disconnect(function(d) {
//				console.log('after--------',d);
				nextCase();
			});
		})
		.catch(errFn);
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
				nextCase();
			};
		});
	});
	describe('#find()',function() {
		it('should take all answers', function (nextCase) {
			answerDAO.find(done, {});
			function done(models) {
				var e_answers =  Answer.createBy(models);
				_equals(e_answers, _answers);
				nextCase();
			}
		});
		it('should take a answer', function (nextCase) {
			var num = 2;
			answerDAO.findByNum(done, num);
			function done(model) {
				var e_answer = Answer.createBy(model);
				var a_answer = _answers[num-1];
				_equals(a_answer, e_answer);
				nextCase();
			}
		});
		it('should take answers by range', function (nextCase) {
			var start = 4
				,end = 6;
			
			answerDAO.findByRange(done,_postNum, start,end);
			function done(models) {
				var e_answers = Answer.createBy(models);
				var a_answers = _answers.slice(start-1,end);
				_equals(a_answers,e_answers);
				nextCase();
			}
		});
	});
	describe('#count', function() {
		it('should take count of all answers', function(nextCase) {
			answerDAO.getCount(done);
			function done(model) {
				var a_count = _answers.length +1;
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextCase();
			}
		});
		it('should take count with where', function(nextCase) {
			var where = {title:/title/};
			answerDAO.getCount(done);
			function done(model) {
				var a_count = _answers.length +1;
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextCase();
			}
		});
	});
	describe('#update', function() {
		it('should update',function(nextCase) {
			var num = 3 , success = 1
			 	,a_answer = _answers[num-1];
			a_answer.num = num;
			a_answer.content = 'content_update';
			
			answerDAO.update(done, a_answer);
			function done(bool) {
				should.equal(bool, success);
				answerDAO.findByNum(done2, num);
				function done2(model) {
					var e_answer = Answer.createBy(model);
					_equals(a_answer, e_answer);
					nextCase();
				}
			}
		});
		it('should increase vote', function(nextCase) {
			var num = 2, success = 1
				,testArray = [num, num, num, num]
				,a_count=testArray.length;
			H.asyncLoop(testArray,answerDAO.incVote, done);
			function done() {
				answerDAO.findByNum(done2, num);
				function done2(model) {
					var e_answer = Answer.createBy(model);
					should.equal(a_count, e_answer.vote);
					nextCase();
				}
			}
		});
	});
	describe('#getCountsByPosts',function() {
		it('should take counts Of answers By posts', function(nextCase) {
			var postNum = 9;
			var posts = [{num:_postNum}, {num:postNum}];
			_insertTestData2(postNum, next, nextCase) 
			
			function next(err, datas) {
				answerDAO.getCountsByPosts(done, posts);
				function done(result) {
					var r1 = result.shift();
					var r2 = result.shift();
					should.equal(r1._id, _postNum);
					should.equal(r1.count, 11); //위에서 하나 추가되었기에 
					should.equal(r2._id, postNum);
					should.equal(r2.count, 10);
					nextCase();
				}
			}
		});
	});
});
////////==== helper =====/////////
function _equals(expectedPosts, actualsPosts) {
	H.deepEqualsByKeys(expectedPosts, actualsPosts, keys4tempValue);
};
function _createAnswers(postNum) {
	var Type = Answer
	  , count = 10;
	var answers = H.createObjsByType(Type, count, keys4tempValue);
	_.each(answers, function(val) {
		val['postNum'] = postNum;
	})
	return answers;
}
function _insertTestData(nextCase) {
	_insertTestData2(_postNum,nextCase, nextCase) 
};
function _insertTestData2(postNum, done, nextCase) {
	var post = Post.createBy({num:postNum, title:'title', content:'content'});
	var answers = _createAnswers(post.num);
	var errFn = H.testCatch1(nextCase);
	
	postDAO.insertOne(H.doneOrErrFn(next, errFn) , post);
	
	function next(d) {
		H.asyncLoop(answers, [answerDAO, answerDAO.insertOne], endDone, errFn);
			function endDone(err, datas) {
				done();
			}
	}
};