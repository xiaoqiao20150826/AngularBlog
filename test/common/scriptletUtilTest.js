/**
 * 
 */
var debug = require('debug')('test:common:scriptletUtil')

var _ = require('underscore')
var should = require('should')
  , scriptletUtil = require('../../common/util/scriptletUtil.js');


describe('scriptletUtil', function() {
	var names = [ 
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
	var root = {id:0, name:'root',  names : names}
	it('should get all name and id  of root', function () {
		var childsKey = 'names'
		  ,	count = 0;
		scriptletUtil.treeEach(root, childsKey, eachFn)
		should.equal(count, 9)
		function eachFn(node, deep, hasChild) {
			++count
			debug('deep :'+deep+'] '+node.name + ', hasChild : '+ hasChild);
		}
	})
	
	it('should call nodes before and after', function () {
		var childsKey = 'names'
			,	beforeCount = 0
			,	afterCount = 0
		scriptletUtil.treeEach(root, childsKey, eachFn, eachNodesBeforeIfHasChild, eachNodesAfterIfHasChild)
		should.equal(beforeCount, 3)
		should.equal(afterCount, 3)
		function eachNodesBeforeIfHasChild(parentNode, parentDeep) {
			++beforeCount
			debug('eachNodesBeforeIfHasChild : '+ parentNode.name +" "+ parentDeep)
		}
		function eachFn(node, deep, hasChild) {
			debug('deep :'+deep+'] '+node.name + ', hasChild : '+ hasChild);
		}
		function eachNodesAfterIfHasChild(parentNode, parentDeep) {
			debug('eachNodesAfterIfHasChild : '+ parentNode.name +" "+ parentDeep)
			++afterCount
		}
	})
})