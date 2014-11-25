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



describe('aAnswerDAO', function() {
	var postNum
	before(function(nextTest) {
		mongoose.connect('mongodb://localhost/test',function() {
			//1.create answers
			initDataCreater.create()
			.then(function() {//post
				var post    = Post.createBy({title:'title', content:'content'})
				return postDAO.insertOne(post)
			})
			.then(function(_post){
			   postNum = _post.num
			   var answers = H.createObjsByType(Answer, 10, ['content']);
				_.each(answers, function(val) {
					val['postNum'] = _post.num;
				})
				
				return  _.reduce(answers, function (p, answer){
							return p.then(function() {
								return answerDAO.insertOne(answer);
							})
						}, Q())
			})
			.then(function () { nextTest() })
			.catch(H.testCatch1(nextTest))
			
		});
	});
	after(function(nextTest) {
		Q.all([ postDAO.removeAll()
		      , answerDAO.removeAll()
			  , initDataCreater.removeAll()
        ])
		.then(function() {
			mongoose.disconnect(function() {
				nextTest();
			});
		})
		.catch(H.testCatch1(nextTest))
	});
//	describe('#insertOne()', function() {
//		it('should insert a answer.',function (nextTest) {
	// 테스트데이터로 퉁.
//		});
//	});
	describe('#find()',function() {
		it('should take all answers', function (nextTest) {
			answerDAO.find({})
			.then(function dataFn(answers) {
				should.equal(answers.length, 10)
			})
			.then(function(){ nextTest()})
			.catch(H.testCatch1(nextTest))
		});
		it('should take a answer', function (nextTest) {
			var num = 2;
			answerDAO.findByNum(num)
			.then(function dataFn(answer) {
				should.equal(answer.num, 2);
			})
			.then(function(){ nextTest()})
			.catch(H.testCatch1(nextTest))
		});
		it('should take answers by range', function (nextTest) {
			var start = 4
				,end = 6;
			
			answerDAO.findByRange(postNum, start,end)   //   end 미만
			.then(function dataFn(answers) {
				should.equal(answers.length, 2);
				should.equal(answers[0].content, 'content4');  // 선순.
			})
			.then(function(){ nextTest()})
			.catch(H.testCatch1(nextTest))
		});
	});
	describe('#count', function() {
		it('should take count of all answers', function(nextTest) {
			answerDAO.getCount()
			.then(function dataFn(count) {
				should.equal(count, 10);
			})
			.then(function(){ nextTest()})
			.catch(H.testCatch1(nextTest))
		});
		it('should take count with where', function(nextTest) {
			var where = {content:/content/};
			answerDAO.getCount(where)
			.then(function dataFn(count) {
				should.equal(count, 10);
			})
			.then(function(){ nextTest()})
			.catch(H.testCatch1(nextTest))
		});
	});
	describe('#update', function() {
		it('should update',function(nextTest) {
			var content = 'content_update';
			var answer  = Answer.createBy({num:3, content:content})
			
			answerDAO.update(answer)
			.then(function dataFn(status) {
				should.equal(status.isSuccess(), true);
				return answerDAO.findByNum(3);
			})
			.then(function (answer) {
				should.equal(answer.content, content)
			})
			.then(function(){ nextTest()})
			.catch(H.testCatch1(nextTest))
		});
	});

});
