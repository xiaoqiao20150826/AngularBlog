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
var	answerDAO = require('../../dao/blogBoard/answerDAO.js');
var	Answer= require('../../domain/blogBoard/Answer.js');
var	postDAO = require('../../dao/blogBoard/postDAO.js');
var	Post= require('../../domain/blogBoard/Post.js');
var initDataCreater = require('../../initDataCreater')


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
		H.all4promise([ postDAO.removeAll
		              , answerDAO.removeAll
			          , initDataCreater.removeAll
        ])
		.then(function() {
			mongoose.disconnect(function() {
				nextCase();
			});
		})
		.catch(errFn);
	});
	beforeEach(function() {
		_answers = _createAnswers(_postNum); //testcase마다 같은 테스트데이터
	});
	describe('#insertOne()', function() {
		it('should insert a answer.',function (nextCase) {
			answerDAO.insertOne(new H.Done(dataFn), _answers[3]);
			function dataFn(data) {
				var expectedanswer = data;
				_equals(expectedanswer,_answers[3]);
				nextCase();
			};
		});
	});
	describe('#find()',function() {
		it('should take all answers', function (nextCase) {
			answerDAO.find(new H.Done(dataFn, {}));
			function dataFn(answers) {
				should.equal(answers.length, 11)
				nextCase();
			}
		});
		it('should take a answer', function (nextCase) {
			var num = 2;
			answerDAO.findByNum(new H.Done(dataFn), num);
			function dataFn(answer) {
				should.equal(answer.num, 2);
				nextCase();
			}
		});
		it('should take answers by range', function (nextCase) {
			var start = 4
				,end = 6;
			
			answerDAO.findByRange(new H.Done(dataFn), _postNum, start,end);
			function dataFn(models) {
				var e_answers = Answer.createBy(models);
				var a_answers = _answers.slice(start-1,end);
				_equals(a_answers,e_answers);
				nextCase();
			}
		});
	});
	describe('#count', function() {
		it('should take count of all answers', function(nextCase) {
			answerDAO.getCount(new H.Done(dataFn));
			function dataFn(model) {
				var a_count = _answers.length +1;
				var e_count = model;
				should.exist(model);
				should.equal(a_count,e_count);
				nextCase();
			}
		});
		it('should take count with where', function(nextCase) {
			var where = {title:/title/};
			answerDAO.getCount(new H.Done(dataFn));
			function dataFn(model) {
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
			
			answerDAO.update(new H.Done(dataFn), a_answer);
			function dataFn(bool) {
				should.equal(bool, success);
				answerDAO.findByNum(new H.Done(dataFn2), num);
				function dataFn2(model) {
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
			H.asyncLoop(testArray,answerDAO.incVote, new H.Done(dataFn));
			function dataFn() {
				answerDAO.findByNum(new H.Done(dataFn2), num);
				function dataFn2(model) {
					var e_answer = Answer.createBy(model);
					should.equal(a_count, e_answer.vote);
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

//#getCountsByPosts에서 실험용으로 한번만 사용하기 위함.
//post1, answer10이었던 것을 post2, answer20 개로 만들기 위한것.
function _insertTestData2(postNum, done, nextCase) {
	var post = Post.createBy({num:postNum, title:'title', content:'content'});
	var answers = _createAnswers(post.num);
	var errFn = H.testCatch1(nextCase);
	
	H.call4promise(initDataCreater.create)
	 .then(function() {
		 
		 postDAO.insertOne(new H.Done(next, errFn) , post);
			
			function next(d) {
				H.asyncLoop(answers, [answerDAO, answerDAO.insertOne], new H.Done(endDataFn, errFn));
					function endDataFn(datas) {
						done();
					}
			} 
	 })
	
};