/**
 * 얼추된것같은데.
 */

define(['common/common'], function (common) {
	describe('Tree', function () {
		var Tree, names, root
		var tree
		beforeEach(function() {
			angular.mock.module(common)
			angular.mock.inject(function ($injector) {
				Tree = $injector.get('common.Tree');
			})
		})
		beforeEach(function() {
			names = [ 
			              {id:1, name:'name1'}
			            , {id:2, name:'name2', names:[
			                                            {id:4, name:'name4'}
			                                          , {id:5, name:'name5', names:[
			                                                                          {id:7, name:'name7'}
			                                                                        , {id:8, name:'name8'}  
			                                                                        ]}
			                                          , {id:6, name:'name6'}
			                                          ]}
			            , {id:3, name:'name3'}
			            ]
			root = {id:0, name:'root',  names : names}
			
			tree = new Tree(root,'names', 'id')
		})
		
		it('should get all name and id  of root', function () {
			var	count = 0;
			tree.each(eachFn)
			expect(count).toEqual( 9)
			function eachFn(node, deep, hasChild) {
				++count
//				console.log('deep :'+deep+'] '+node.name + ', hasChild : '+ hasChild);
			}
		})
		it('should call nodes before and after', function () {
			var	beforeCount = 0
				,	afterCount  = 0
				,   eachCount   = 0
			tree.each(eachFn, eachNodesBeforeIfHasChild, eachNodesAfterIfHasChild)
			expect(beforeCount).toEqual(4)
			expect(afterCount).toEqual(4)
			expect(eachCount).toEqual(9)
			
			function eachNodesBeforeIfHasChild(parentNode, parentDeep) {
				++beforeCount
//				console.log('eachNodesBeforeIfHasChild : '+ parentNode.name +" "+ parentDeep)
			}
			function eachFn(node, parentNode, deep, hasChild) {
				++eachCount
//				console.log('deep :'+deep+'] '+node.name + ', hasChild : '+ hasChild);
			}
			function eachNodesAfterIfHasChild(parentNode, parentDeep) {
//				console.log('eachNodesAfterIfHasChild : '+ parentNode.name +" "+ parentDeep)
				++afterCount
			}
		})
		it('should get first node by id', function () {
			var node = tree.first(5)
			expect(node.id).toEqual(5)
			expect(node.names.length).toEqual(2)
		})
		it('should add node', function () {
			var node = tree.first(1)
			
			expect(node.names).toEqual(undefined)
			tree.addChild(node, {id:111, name:'name111'})
			tree.addChild(node, {id:112, name:'name112'})
			
			expect(node.names.length).toEqual(2)
		})
		
		it('should drop node', function () {
			tree.drop( 1)
			expect(tree.first( 1)).toEqual(null)
		})
		it('should drop rootNode', function () {
			tree.drop( 0)
			expect(tree.first( 0)).toEqual(null)
			expect(tree.first( 2).names.length).toEqual(3)
		})
		it('should drop node', function () {
			expect(tree.first( 2).names.length).toEqual(3)
			tree.drop( 5)
			expect(tree.first( 5)).toEqual(null)
			
			var node = tree.first( 2)
			expect(node.names.length).toEqual(4)
		})
	})
})