/**
 * 
 */
var debug = require('debug')('test:common:scriptletUtil')

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
	it('should get all name and id  of names', function () {
		var childsKey = 'names'
		  ,	count = 0;
		scriptletUtil.treeEach(names, childsKey, eachFn)
		should.equal(count, 8)
		function eachFn(node, deep) {
			++count
			debug('deep :'+deep+'] '+node.name);
		}
	})
	
})