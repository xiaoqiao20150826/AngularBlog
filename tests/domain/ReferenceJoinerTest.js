/**
 * 
 */
var should = require('should')
var debug = require('debug')('test:domain:ReferenceJoinerTest')
  , log = console.log;

var	ReferenceJoiner= require('../../domain/ReferenceJoiner.js');

describe('ReferenceJoiner', function() {
	var emptySource = {_id:'empty', name:'empty'}
	var sources = [{_id:'g1', name:'g1'}, {_id:'g2', name:'g2'}, {_id:'g3', name:'g3'}]
	it('should get joined a target by sources  ', function() {
		var target = {num:1, userId:'g2'};
		var rj = new ReferenceJoiner(target, 'userId', 'user');		
		var joinedTarget = rj.targetJoinOne(target, sources, '_id', emptySource)
		
		debug('one :', joinedTarget)
		should.deepEqual(joinedTarget.user, sources[1]); 
	})
	it('should get original target if target reference is not exist  ', function() {
		var target = {num:1, userId:null};
		var rj = new ReferenceJoiner(target, 'userId', 'user');		
		var joinedTarget = rj.targetJoinOne(target, sources, '_id', emptySource)
		
		debug('one :', joinedTarget)
		should.deepEqual(joinedTarget, target); 
	})
	it('should get origin a target by not equal sources  ', function() {
		var target = {num:1, userId:'g23'};
		
		var rj = new ReferenceJoiner(target, 'userId', 'user');		
		var originTarget = rj.targetJoinOne(target, sources, '_id', emptySource)
		
		debug('one :', originTarget)
		should.deepEqual(originTarget, target); 
	})
	it('should get joined targets by sources and targets ', function() {
		var targets = [{num:1, userId:'g2'}, {num:1, userId:'g3'}];
		
		var rj = new ReferenceJoiner(targets, 'userId', 'user');		
		var joinedTargets = rj.targetsJoin(sources, '_id', emptySource)
		
		debug('many :', joinedTargets)
		should.deepEqual(joinedTargets[0].user, sources[1]); 
		should.deepEqual(joinedTargets[1].user, sources[2]); 
	})
	it('should get joined targets by source', function () {
		var targets = [{num:1, userId:'g2'}, {num:1, userId:'g3'}];
		var source = {_id:'g2', name:'g2'}
		
		var rj = new ReferenceJoiner(targets, 'userId', 'user');		
		var joinedTargets = rj.join(source, '_id', emptySource)
		
		debug('many :', joinedTargets)
		should.deepEqual(joinedTargets[0].user, source); 
	})
	it('should join empty source if target not find source', function() {
		var posts = [{num:1, userId:'ggg'}, {num:2, userId:'ggg2'}, {num:3, userId:'xxx'}];
		var users = [{_id:'ggg', name:'ggg'}, {_id:'ggg2',name:'xxx'}];
		
		var rj = new ReferenceJoiner(posts, 'userId', 'user');
		var joinedPosts = rj.join(users, '_id', emptySource)
		debug('joined posts :', joinedPosts)
		should.deepEqual(joinedPosts[2].user, emptySource );
	})


	it('should join many sources', function() {
		var answers = [{num:1, answerNum:null}, {num:2, answerNum:null}, {num:3, answerNum:null}];
		var lowAnswers = [{num:4, answerNum:1}, {num:5, answerNum:1}];
		
		var rj = new ReferenceJoiner(answers, 'num', 'answers');
		var joinedAnswers = rj.joinMany(lowAnswers, 'answerNum', emptySource)
		debug('joined answers :', joinedAnswers)
		should.deepEqual(joinedAnswers[0].answers, lowAnswers );
	})
})