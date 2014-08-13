/**
 * 
 */

var should = require('should')
  , _ = require('underscore')
var debug = require('debug')('test:domain:JoinerTest')
  , log = console.log;

var	Joiner= require('../../domain/Joiner.js');
var count=0;
describe('Joiner', function() {

	describe('tree', function() {
		
		var childList, nodesThreeDeep, nodesTwoDeep2, nodesTwoDeep, nodesOneDeep, root
		var childsKey, joiner
		beforeEach(function() {
			root = {_id:'root'}
			nodesOneDeep = [{_id:'node1', parentId:'root'}, {_id:'node2', parentId:'root'}]
			nodesTwoDeep = [{_id:'node3', parentId:'node1'}, {_id:'node4', parentId:'node1'}]
			nodesTwoDeep2 = [{_id:'node5', parentId:'node2'}, {_id:'node6', parentId:'node2'}]
			nodesThreeDeep = [{_id:'node7', parentId:'node5'}, {_id:'node8', parentId:'node5'}]
			childList = _.union(nodesOneDeep, nodesTwoDeep, nodesTwoDeep2, nodesThreeDeep)
			
			childsKey = 'childs'
			joiner = new Joiner(childList,'parentId', childsKey);
			debug('beforeEach : ', ++count)
		})
		
		it('should get childs To bind to node', function() {
			joiner.setIdentifierKey('_id')
			var childsToBind = joiner.getChildsToBindToNode(root);
			debug('childsToBind :', childsToBind);
			should.deepEqual(childsToBind, nodesOneDeep);
		})
		it('should binded node', function() {
			var bindedNode = joiner.treeTo(root, '_id')
			debug('bindedNode', bindedNode)
			should.equal(bindedNode._id, 'root');
			should.equal(bindedNode[childsKey][0]._id, 'node1');
			should.equal(bindedNode[childsKey][0][childsKey][0]._id, 'node3');
			should.equal(bindedNode[childsKey][0][childsKey][1]._id, 'node4');
			should.equal(bindedNode[childsKey][1]._id, 'node2');
			should.equal(bindedNode[childsKey][1][childsKey][0]._id, 'node5');
			should.equal(bindedNode[childsKey][1][childsKey][0][childsKey][0]._id, 'node7');
			should.equal(bindedNode[childsKey][1][childsKey][0][childsKey][1]._id, 'node8');
			should.equal(bindedNode[childsKey][1][childsKey][1]._id, 'node6');
		})
		it('재귀함수',function () {
			var a = 1;
			var count= 0;
			function sum(value) {
				++count;
				if(value > 100) return value;
				
				return value = sum(value+1);
			}
			var value = sum(10)
//		log(count+ ' : '+ value)
		})
	})
	describe('$joinTo', function() {
		it('should get joined targets by sources and targets ', function() {
			var posts = [{num:1, userId:'ggg'}, {num:2, userId:'ggg2'}, {num:3, userId:'xxx'}];
			var users = [{_id:'ggg', name:'ggg'}, {_id:'ggg2',name:'xxx'}];
			var joiner = new Joiner(users,'_id','user');
			
			var joinedPosts = joiner.joinTo(posts, 'userId')
			debug('joined posts :', joinedPosts)
			should.deepEqual(joinedPosts[0].user, users[0]); 
			should.deepEqual(joinedPosts[1].user, users[1]); 
			should.deepEqual(joinedPosts[2].user, undefined); 
		})
		it('should join many sources', function() {
			var answers = [{num:1, answerNum:'root'}, {num:2, answerNum:'root'}, {num:3, answerNum:'root'}]
			  , lowAnswers = [{num:4, answerNum:1}, {num:5, answerNum:1}];
			var allAnswers = _.union(answers, lowAnswers)
			  , root = {num:'root'}
			var joiner = new Joiner(allAnswers, 'answerNum', 'answers');
			
			var rootOfTree = joiner.treeTo(root, 'num')
			debug('rootOfTree answers :', rootOfTree)
			should.deepEqual(rootOfTree.answers[0].answers, lowAnswers );
		})
	})
})