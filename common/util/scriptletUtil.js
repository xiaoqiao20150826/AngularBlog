/**
 * 
 */
var _ = require('underscore')
  , U = require('./util')
var scriptletUtil = module.exports = {}


//root기준으로 했으면 좋았을것을.
scriptletUtil.treeEach = function (root, childsKey, eachFn, eachChildsBefore, eachChildsAfter) {
	if(_.isEmpty(root)) return;
	if(!_.isArray(root)) root = [root]
	
	eachFn = allEachHook1(eachFn);
	eachChildsBefore =allEachHook1(eachChildsBefore); //root도 대상에 삼기위해.
	eachChildsAfter = allEachHook1(eachChildsAfter);
		
	_deepSearch(root, null, -1);
	function _deepSearch(childs, parentNode, originDeep) {
		if(U.notExist(childs)) return;
		if(_.isEmpty(childs)) return;
		
		if(!_.isArray(childs)) childs = [childs];

		
		if(eachChildsBefore) {eachChildsBefore(parentNode,originDeep) }
		var deep = originDeep+1;
		for(var i in childs) {
			var node = childs[i]
			  , childNodes = node[childsKey]
			  , hasChild = _hasChild(childNodes)
			//hasChild말고, childNodes를 전달하는것이 나을까?
	     	if(eachFn) { eachFn(node, deep, hasChild, parentNode); }
			_deepSearch(childNodes, node, deep)
		}
		
		if(eachChildsAfter) {eachChildsAfter(parentNode, originDeep)}
		return ;
	}
	// helper
	function _hasChild(childs) {
		return !_.isEmpty(childs);
	}
	function allEachHook1(each) {
		if(!each) return function () {};
		return function (node, deep) {
			if(deep < 0) return;
			
			return each.apply(null, arguments);
		}
	}
}

scriptletUtil.repeatString = function (string, num) {
	var repeatedString = ''
	_.each(_.range(num), function () {
		repeatedString = repeatedString + string
	})
	return repeatedString;
}